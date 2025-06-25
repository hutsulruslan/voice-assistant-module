from app.services.rag_service import query_rag

async def generate_response(question: str) -> str:
    return await query_rag(question)
