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
