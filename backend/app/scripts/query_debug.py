from backend.app.services.get_embedding_function import get_embedding_function
from langchain_community.vectorstores import Chroma

db = Chroma(persist_directory="chroma", embedding_function=get_embedding_function())

results = db.similarity_search("Іван Франко", k=5)
for doc in results:
    print(doc.page_content[:300])
