import io
import numpy as np
import scipy.io.wavfile as wav
import scipy.signal as signal
from faster_whisper import WhisperModel
from loguru import logger
import imageio_ffmpeg
import subprocess


class WhisperSTT:

    def __init__(self):
        self.model = None
        self.target_sample_rate = 16000

    def _load_model(self):
        if self.model is not None:
            return
        logger.info("Загружаем Whisper small (первый запуск скачает ~244MB)...")
        self.model = WhisperModel("small", device="cpu", compute_type="int8")
        logger.info("Whisper модель загружена")

    def _to_wav(self, audio_bytes: bytes) -> bytes:
        """Конвертируем любой формат (WebM, OGG, MP4...) в WAV через ffmpeg"""
        # Проверяем — если уже WAV, возвращаем как есть
        if audio_bytes[:4] in (b'RIFF', b'RIFX', b'RF64'):
            return audio_bytes

        ffmpeg_path = imageio_ffmpeg.get_ffmpeg_exe()
        process = subprocess.run(
            [
                ffmpeg_path, '-i', 'pipe:0',
                '-ar', '16000', '-ac', '1', '-f', 'wav', 'pipe:1'
            ],
            input=audio_bytes,
            capture_output=True,
        )
        if process.returncode != 0:
            raise RuntimeError(f"ffmpeg error: {process.stderr.decode()}")
        return process.stdout

    async def recognize(self, audio_bytes: bytes) -> str:
        try:
            self._load_model()
            audio_bytes = self._to_wav(audio_bytes)

            buffer = io.BytesIO(audio_bytes)
            sample_rate, audio_data = wav.read(buffer)

            if audio_data.dtype != np.float32:
                audio_data = audio_data.astype(np.float32) / 32768.0

            # Стерео → моно
            if len(audio_data.shape) > 1:
                audio_data = audio_data.mean(axis=1)

            # Ресэмплинг до 16000 Hz
            if sample_rate != self.target_sample_rate:
                num_samples = int(len(audio_data) * self.target_sample_rate / sample_rate)
                audio_data = signal.resample(audio_data, num_samples)

            segments, info = self.model.transcribe(
                audio_data,
                language="ru",
                beam_size=5,
            )

            text = " ".join(seg.text.strip() for seg in segments)
            logger.info(f"STT распознано ({info.language}): {text}")
            return text

        except Exception as e:
            logger.error(f"Whisper STT error: {e}")
            raise


whisper_stt = WhisperSTT()
