from fastapi import APIRouter, UploadFile, File
from app.models.voice_query import VoiceQueryResponse
from app.models.text_query import TextQueryRequest
from app.services import asr_service, tts_service, llm_service

router = APIRouter()

# @router.post("/voice-query", response_model=VoiceQueryResponse)
# async def voice_query(file: UploadFile = File(...)):
#     text = await asr_service.transcribe_audio(file)

#     answer = await llm_service.generate_response(text)

#     audio_url = tts_service.generate_speech(answer)

#     return VoiceQueryResponse(
#         query=text,
#         answer=answer,
#         audio_url=audio_url
#     )

@router.post("/text-query", response_model=VoiceQueryResponse)
async def text_query(request: TextQueryRequest):
    answer = await llm_service.generate_response(request.query)
    audio_url = tts_service.generate_speech(answer)
    return VoiceQueryResponse(
        query=request.query,
        answer=answer,
        audio_url=audio_url
    )