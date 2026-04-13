import json
import os
import urllib.request
from typing import List, Optional

def verify_answer_with_ai(question: str, options: List[str], selected_index: int) -> bool:
    """
    Uses Groq API to verify if the selected answer is correct.
    This replaces hardcoded answer checking.
    """
    api_key = os.getenv("GROQ_API_KEY")
    if not api_key:
        print("GROQ_API_KEY not found in environment. Falling back to local check.")
        return None  # Let the router handle fallback

    selected_text = options[selected_index]
    
    prompt = f"""
    You are a quiz evaluator. 
    Question: {question}
    Options: {", ".join(options)}
    User selected: {selected_text}
    
    Is the user's selection the correct answer to the question?
    Respond ONLY with a JSON object: {{"is_correct": true}} or {{"is_correct": false}}
    """

    data = {
        "model": "llama-3.3-70b-versatile",
        "messages": [
            {"role": "user", "content": prompt}
        ],
        "response_format": {"type": "json_object"}
    }

    req = urllib.request.Request(
        "https://api.groq.com/openai/v1/chat/completions",
        data=json.dumps(data).encode("utf-8"),
        headers={
            "Authorization": f"Bearer {api_key}",
            "Content-Type": "application/json"
        },
        method="POST"
    )

    try:
        with urllib.request.urlopen(req) as res:
            response = json.loads(res.read().decode("utf-8"))
            content = json.loads(response["choices"][0]["message"]["content"])
            return content.get("is_correct", False)
    except Exception as e:
        print(f"AI Verification Error: {e}")
        return None
