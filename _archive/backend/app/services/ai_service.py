from loguru import logger
from app.services.gigachat_client import gigachat_client
from app.services.silero_tts import silero_tts
from app.services.silero_stt import whisper_stt


class AIService:

    async def process_speech(
        self,
        audio_data: bytes,
        character_id: int,
        child_name: str,
        character_context: dict,
        conversation_history: list = None
    ) -> dict:
        """
        Полный пайплайн: аудио → текст → GigaChat → голос
        """
        logger.info(f"AI pipeline start | character={character_id} | child={child_name}")

        # 1. STT
        recognized_text = await whisper_stt.recognize(audio_data)
        logger.info(f"STT: {recognized_text}")

        if not recognized_text.strip():
            return {"success": False, "error": "Речь не распознана"}

        # 2. GigaChat
        messages = (conversation_history or []) + [
            {"role": "user", "content": recognized_text}
        ]
        response_text = await gigachat_client.chat(
            messages=messages,
            character_name=character_context.get("name", "Баба Яга"),
            character_personality=character_context.get("personality", "добрая, мудрая"),
            child_name=child_name,
        )
        logger.info(f"GigaChat: {response_text}")

        # 3. TTS
        audio_response = await silero_tts.synthesize(response_text)
        logger.info(f"TTS: {len(audio_response)} байт")

        return {
            "success": True,
            "recognized_text": recognized_text,
            "response_text": response_text,
            "audio_response": audio_response,
        }


ai_service = AIService()
