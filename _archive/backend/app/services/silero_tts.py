import torch
import io
import numpy as np
import scipy.io.wavfile as wav
from loguru import logger
from app.core.config import settings


class SileroTTS:

    def __init__(self):
        self.model = None
        self.sample_rate = 24000
        self.speaker = "xenia"  # женский голос

    def _load_model(self):
        if self.model is not None:
            return

        logger.info("Загружаем Silero TTS модель (кэш: ~/.cache/torch/hub)...")
        self.model, _ = torch.hub.load(
            repo_or_dir="snakers4/silero-models",
            model="silero_tts",
            language="ru",
            speaker="v3_1_ru",
            trust_repo=True
        )
        self.model.to(torch.device("cpu"))
        logger.info("Silero TTS модель загружена")

    async def synthesize(self, text: str) -> bytes:
        try:
            self._load_model()

            audio = self.model.apply_tts(
                text=text,
                speaker=self.speaker,
                sample_rate=self.sample_rate,
            )

            buffer = io.BytesIO()
            wav.write(buffer, self.sample_rate, (audio.numpy() * 32767).astype(np.int16))
            buffer.seek(0)

            logger.info(f"TTS синтез выполнен: {len(text)} символов")
            return buffer.read()

        except Exception as e:
            logger.error(f"Silero TTS error: {e}")
            raise


silero_tts = SileroTTS()
