from pydantic import BaseModel

class VoiceQueryResponse(BaseModel):
    query: str
    answer: str
    audio_url: str
