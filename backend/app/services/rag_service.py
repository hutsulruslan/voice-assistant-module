from langchain_ollama import OllamaLLM
from langchain.prompts import ChatPromptTemplate
from langchain_chroma import Chroma
from app.services.get_embedding_function import get_embedding_function
import os

OLLAMA_URL = "http://localhost:11434"
MODEL_NAME = "mistral"

BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
CHROMA_PATH = os.path.join(BASE_DIR, "chroma")

PROMPT_TEMPLATE = """
Використай тільки контекст нижче, щоб відповісти на питання. Відповідай коротко та точно.

{context}

---

Питання: {question}
Відповідь:
"""

async def query_rag(question: str) -> str:
    embedding_function = get_embedding_function()
    db = Chroma(persist_directory=CHROMA_PATH, embedding_function=embedding_function)

    results = db.similarity_search_with_score(question, k=5)
    context_chunks = [doc.page_content for doc, _ in results]

    context_text = "\n\n---\n\n".join(context_chunks)
    prompt = ChatPromptTemplate.from_template(PROMPT_TEMPLATE).format(
        context=context_text,
        question=question
    )

    llm = OllamaLLM(model=MODEL_NAME, base_url=OLLAMA_URL)
    response = llm.invoke(prompt)
    return response.strip()