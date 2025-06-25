from fastapi import FastAPI
from fastapi.staticfiles import StaticFiles
from app.api.routes import router as voice_router
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI(
    title="Voice Assistant API",
    version="0.1.0"
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"], 
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(voice_router, prefix="/api")

app.mount("/static", StaticFiles(directory="static"), name="static")
