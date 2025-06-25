from gtts import gTTS
import os
import uuid
import glob

AUDIO_DIR = "static/audio"

def generate_speech(text: str) -> str:
    os.makedirs(AUDIO_DIR, exist_ok=True)
    clear_old_audio_files()

    filename = "output.mp3"
    audio_path = os.path.join(AUDIO_DIR, filename)

    tts = gTTS(text=text, lang="uk")
    tts.save(audio_path)

    return f"/static/audio/{filename}"

def clear_old_audio_files():
    for file in glob.glob(f"{AUDIO_DIR}/*.mp3"):
        os.remove(file)