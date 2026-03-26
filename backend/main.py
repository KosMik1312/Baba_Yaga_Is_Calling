import io
import numpy as np
import scipy.io.wavfile as wav
import scipy.signal as signal
import imageio_ffmpeg
import subprocess

from fastapi import FastAPI, UploadFile, File, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from faster_whisper import WhisperModel
from loguru import logger

app = FastAPI(title="Baba Yaga Backend", version="0.2.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

# Загружаем модель один раз при старте
whisper_model: WhisperModel | None = None

@app.on_event("startup")
async def startup_event():
    global whisper_model
    logger.info("Загружаем Whisper small при старте...")
    whisper_model = WhisperModel("small", device="cpu", compute_type="int8")
    logger.info("Whisper загружен и готов")

def get_model() -> WhisperModel:
    global whisper_model
    if whisper_model is None:
        raise RuntimeError("Модель не загружена")
    return whisper_model

def to_wav_16k_mono(audio_bytes: bytes) -> bytes:
    # Проверяем что это валидный WAV с правильным форматом
    is_valid_wav = (
        len(audio_bytes) > 44 and
        audio_bytes[:4] in (b'RIFF', b'RIFX', b'RF64') and
        audio_bytes[8:12] == b'WAVE'
    )
    
    if is_valid_wav:
        logger.info("Файл уже в формате WAV, пропускаем конвертацию")
        return audio_bytes
    
    logger.info("Конвертируем аудио в WAV 16kHz mono через ffmpeg")
    ffmpeg_path = imageio_ffmpeg.get_ffmpeg_exe()
    process = subprocess.run(
        [ffmpeg_path, '-i', 'pipe:0', '-ar', '16000', '-ac', '1', '-f', 'wav', 'pipe:1'],
        input=audio_bytes,
        capture_output=True,
    )
    if process.returncode != 0:
        logger.error(f"ffmpeg stderr: {process.stderr.decode()}")
        raise RuntimeError(f"ffmpeg error: {process.stderr.decode()}")
    logger.info(f"Конвертация завершена, размер: {len(process.stdout)} байт")
    return process.stdout

@app.get("/health")
async def health():
    return {"status": "ok"}

@app.post("/api/v1/stt")
async def speech_to_text(audio: UploadFile = File(...)):
    try:
        audio_bytes = await audio.read()
        logger.info(f"STT запрос: {len(audio_bytes)} байт, формат: {audio.content_type}")
        
        # Проверяем WAV заголовок
        if len(audio_bytes) < 44:
            raise HTTPException(status_code=400, detail="Файл слишком маленький")
        
        logger.info(f"WAV header: {audio_bytes[:12].hex()}")

        audio_bytes = to_wav_16k_mono(audio_bytes)

        buffer = io.BytesIO(audio_bytes)
        sample_rate, audio_data = wav.read(buffer)

        if audio_data.dtype != np.float32:
            audio_data = audio_data.astype(np.float32) / 32768.0
        if len(audio_data.shape) > 1:
            audio_data = audio_data.mean(axis=1)
        if sample_rate != 16000:
            num_samples = int(len(audio_data) * 16000 / sample_rate)
            audio_data = signal.resample(audio_data, num_samples)

        model = get_model()
        segments, info = model.transcribe(audio_data, language="ru", beam_size=5)
        text = " ".join(seg.text.strip() for seg in segments)

        logger.info(f"Распознано: {text}")
        return {"text": text}

    except Exception as e:
        logger.error(f"STT error: {e}")
        raise HTTPException(status_code=500, detail=str(e))

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=False)
