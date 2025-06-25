from pydantic import BaseModel

class TextQueryRequest(BaseModel):
    query: str