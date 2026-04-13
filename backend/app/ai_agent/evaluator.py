import re
import os
from functools import lru_cache

try:
    from transformers import AutoModelForCausalLM, AutoTokenizer, pipeline
except Exception:  # pragma: no cover
    AutoModelForCausalLM = None
    AutoTokenizer = None
    pipeline = None


MODEL_ID = "TinyLlama/TinyLlama-1.1B-Chat-v1.0"


@lru_cache(maxsize=1)
def _generator():
    if pipeline is None or AutoTokenizer is None or AutoModelForCausalLM is None:
        return None
    local_only = os.getenv("HF_LOCAL_ONLY", "1") == "1"
    try:
        tokenizer = AutoTokenizer.from_pretrained(MODEL_ID, local_files_only=local_only)
        model = AutoModelForCausalLM.from_pretrained(MODEL_ID, local_files_only=local_only)
        return pipeline("text-generation", model=model, tokenizer=tokenizer)
    except Exception:
        return None


def _fallback_evaluation(answer: str) -> dict:
    words = len(answer.split())
    score = min(100, max(10, 30 + words * 3))
    feedback = "Good effort. Add concrete collaboration outcomes for a stronger answer."
    if score >= 70:
        feedback = "Relevant and clear response with useful teamwork context."
    return {"score": score, "feedback": feedback}


def evaluate_answer(answer: str) -> dict:
    prompt = f"""Evaluate the following answer out of 100 based on:
- relevance
- clarity
- completeness

Answer: "{answer}"

Return strictly in this format:
Score: <number>
Feedback: <short sentence>
"""
    generator = _generator()
    if generator is None:
        return _fallback_evaluation(answer)

    try:
        output = generator(
            prompt,
            temperature=0.2,
            max_new_tokens=50,
            do_sample=True,
        )[0]["generated_text"]
    except Exception:
        return _fallback_evaluation(answer)

    score_match = re.search(r"Score:\s*(\d{1,3})", output)
    feedback_match = re.search(r"Feedback:\s*(.+)", output)

    if not score_match or not feedback_match:
        return _fallback_evaluation(answer)

    score = max(0, min(100, int(score_match.group(1))))
    feedback = feedback_match.group(1).strip()
    return {"score": score, "feedback": feedback}
