# import tempfile
# from faster_whisper import WhisperModel
# from fastapi import UploadFile
# import shutil
# import os

# model = WhisperModel("medium", compute_type="float16")

# async def transcribe_audio(file: UploadFile) -> str:
#     with tempfile.NamedTemporaryFile(delete=False, suffix=".wav") as tmp:
#         tmp_path = tmp.name
#         with open(tmp_path, "wb") as buffer:
#             contents = await file.read()
#             buffer.write(contents)

#     try:
#         segments, _ = model.transcribe(tmp_path, language="uk")
#         text = "".join(segment.text for segment in segments).strip()
#         return text
#     finally:
#         if os.path.exists(tmp_path):
#             os.remove(tmp_path)
