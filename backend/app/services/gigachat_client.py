from gigachat import GigaChat
from gigachat.models import Chat, Messages, MessagesRole
from loguru import logger
from app.core.config import settings


class GigaChatClient:

    def __init__(self):
        self.auth_key = settings.GIGACHAT_AUTH_KEY
        self.scope = settings.GIGACHAT_SCOPE

    async def chat(
        self,
        messages: list,
        character_name: str = "Баба Яга",
        character_personality: str = "добрая, мудрая, любит загадывать загадки",
        child_name: str = "друг"
    ) -> str:
        system_prompt = (
            f"Ты {character_name}, сказочный персонаж. "
            f"Твой характер: {character_personality}. "
            f"Ты разговариваешь с ребёнком по имени {child_name}. "
            "Отвечай кратко (1-2 предложения), дружелюбно, по-русски. "
            "Используй сказочный стиль речи, но будь понятен современным детям."
        )

        try:
            with GigaChat(
                credentials=self.auth_key,
                scope=self.scope,
                verify_ssl_certs=False
            ) as giga:
                payload = Chat(
                    messages=[
                        Messages(role=MessagesRole.SYSTEM, content=system_prompt),
                        *[
                            Messages(
                                role=MessagesRole.USER if m["role"] == "user" else MessagesRole.ASSISTANT,
                                content=m["content"]
                            )
                            for m in messages
                        ]
                    ],
                    temperature=0.7,
                    max_tokens=200,
                )
                response = giga.chat(payload)
                result = response.choices[0].message.content
                logger.info(f"GigaChat response: {result}")
                return result

        except Exception as e:
            logger.error(f"GigaChat error: {e}")
            return "Извини, я немного задумалась... Попробуй ещё раз!"


gigachat_client = GigaChatClient()
