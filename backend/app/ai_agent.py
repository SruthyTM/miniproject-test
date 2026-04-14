import os
from typing import Annotated, TypedDict, List
from langgraph.graph import StateGraph, END
from langchain_groq import ChatGroq
from langchain_core.messages import HumanMessage
from dotenv import load_dotenv

load_dotenv()

class AgentState(TypedDict):
    question: str
    options: List[str]
    selected_index: int
    is_correct: bool

def verify_node(state: AgentState):
    """
    Node that uses Groq LLM to verify the answer.
    """
    api_key = os.getenv("GROQ_API_KEY")
    if not api_key:
        # Fallback if no API key
        return {"is_correct": None}

    try:
        llm = ChatGroq(
            temperature=0,
            model_name="llama-3.3-70b-versatile",
            api_key=api_key
        )
        
        selected_text = state["options"][state["selected_index"]]
        options_text = ", ".join(state["options"])
        
        prompt = f"""
        Evaluation for Quiz:
        Question: {state['question']}
        Options: {options_text}
        User Choice: {selected_text}
        
        Is the user choice the correct answer? 
        Respond with 'YES' or 'NO' only.
        """
        
        response = llm.invoke([HumanMessage(content=prompt)])
        content = response.content.strip().upper()
        
        return {"is_correct": "YES" in content}
    except Exception as e:
        print(f"LLM Node Error: {e}")
        return {"is_correct": None}

def build_graph():
    workflow = StateGraph(AgentState)
    workflow.add_node("evaluate", verify_node)
    workflow.set_entry_point("evaluate")
    workflow.add_edge("evaluate", END)
    return workflow.compile()

# Initialize the graph once
graph_app = build_graph()

def verify_answer_with_ai(question: str, options: List[str], selected_index: int) -> bool:
    """
    Uses LangGraph + LangChain + Groq to verify the answer.
    """
    try:
        inputs = {
            "question": question,
            "options": options,
            "selected_index": selected_index,
            "is_correct": False
        }
        result = graph_app.invoke(inputs)
        return result.get("is_correct")
    except Exception as e:
        print(f"LangGraph execution error: {e}")
        return None

class CreativeState(TypedDict):
    text: str
    score: int
    sentiment: str

def evaluate_creative_node(state: CreativeState):
    api_key = os.getenv("GROQ_API_KEY")
    if not api_key:
        print("GROQ_API_KEY not found, using fallback values")
        return {"score": 5, "sentiment": "Neutral"}

    try:
        llm = ChatGroq(
            temperature=0.3,
            model_name="llama-3.3-70b-versatile",
            api_key=api_key
        )
        
        prompt = f"""
        You are an expert judge evaluating a 25-word creative submission for a car giveaway.
        Submission: "{state['text']}"
        
        Task:
        1. Analyze the sentiment (e.g., Enthusiastic, Hopeful, Nostalgic, Neutral, Negative).
        2. Assign a score from 1 to 10 based on creativity, emotional resonance, and clarity.
        
        Format your response exactly as:
        Score: [number]
        Sentiment: [word]
        """
        
        response = llm.invoke([HumanMessage(content=prompt)])
        content = response.content.strip()
        
        score = 5
        sentiment = "Neutral"
        
        for line in content.split('\\n'):
            line = line.strip()
            if line.startswith("Score:"):
                try:
                    score = int(line.replace("Score:", "").strip())
                except:
                    pass
            elif line.startswith("Sentiment:"):
                sentiment = line.replace("Sentiment:", "").strip()
        
        # Ensure we always have valid values
        if not sentiment or sentiment.strip() == "":
            sentiment = "Neutral"
        if score < 1 or score > 10:
            score = 5
                
        return {"score": score, "sentiment": sentiment}
    except Exception as e:
        print(f"Creative LLM Node Error: {e}")
        return {"score": 5, "sentiment": "Neutral"}

def build_creative_graph():
    workflow = StateGraph(CreativeState)
    workflow.add_node("evaluate_creative", evaluate_creative_node)
    workflow.set_entry_point("evaluate_creative")
    workflow.add_edge("evaluate_creative", END)
    return workflow.compile()

creative_graph_app = build_creative_graph()

def score_creative_text_with_ai(text: str) -> dict:
    print(f"Evaluating creative text: {text[:100]}...")
    
    try:
        # Initialize with default values instead of 0/empty
        inputs = {"text": text, "score": 5, "sentiment": "Neutral"}
        result = creative_graph_app.invoke(inputs)
        score = result.get("score", 5)
        sentiment = result.get("sentiment", "Neutral")
        
        # Ensure we have valid values
        if score is None or score == 0:
            score = get_fallback_score(text)
        if not sentiment or sentiment.strip() == "":
            sentiment = "Neutral"
        
        print(f"AI evaluation result - Score: {score}, Sentiment: {sentiment}")
        return {"score": score, "sentiment": sentiment}
    except Exception as e:
        print(f"Creative LangGraph execution error: {e}")
        # Provide a more realistic fallback score based on text analysis
        fallback_score = get_fallback_score(text)
        print(f"Using fallback score: {fallback_score}")
        return {"score": fallback_score, "sentiment": "Neutral"}

def get_fallback_score(text: str) -> int:
    """Generate a fallback score based on simple text analysis"""
    if not text or len(text.strip()) < 10:
        return 3
    
    # Simple heuristics for scoring
    words = text.split()
    word_count = len(words)
    
    # Base score
    score = 5
    
    # Adjust based on word count (should be around 25 words)
    if 20 <= word_count <= 30:
        score += 1
    elif word_count < 20:
        score -= 1
    elif word_count > 30:
        score -= 1
    
    # Adjust based on content quality indicators (more conservative scoring)
    positive_words = ['innovation', 'growth', 'excellent', 'amazing', 'wonderful', 'great', 'fantastic', 'collaboration', 'learning', 'future']
    if any(word.lower() in text.lower() for word in positive_words):
        score += 1
    
    # Penalty for very long or very short text
    if word_count > 35:
        score -= 2
    elif word_count < 15:
        score -= 2
    
    # Bonus for good structure (contains common sentence patterns)
    if any(char in text for char in ['.', '!', '?']) and word_count >= 20:
        score += 1
    
    # Ensure score is within realistic bounds (1-8 range for most submissions)
    return max(1, min(8, score))

def get_fallback_sentiment(text: str) -> str:
    """Generate a fallback sentiment based on text analysis"""
    if not text or len(text.strip()) < 10:
        return "Neutral"
    
    text_lower = text.lower()
    
    # Strong positive indicators
    strong_positive = ['excellent', 'amazing', 'wonderful', 'fantastic', 'great', 'love', 'awesome', 'brilliant']
    if any(word in text_lower for word in strong_positive):
        return "Positive"
    
    # Moderate positive indicators
    moderate_positive = ['encouraging', 'innovation', 'growth', 'collaboration', 'learning', 'future', 'success', 'productive', 'strong']
    if any(word in text_lower for word in moderate_positive):
        return "Positive"
    
    # Neutral indicators
    neutral_indicators = ['process', 'system', 'technology', 'organization', 'workforce']
    if any(word in text_lower for word in neutral_indicators):
        return "Neutral"
    
    # Negative indicators
    negative_indicators = ['bad', 'poor', 'terrible', 'awful', 'hate', 'disappointed', 'frustrated']
    if any(word in text_lower for word in negative_indicators):
        return "Negative"
    
    # Default to neutral if no strong indicators
    return "Neutral"
