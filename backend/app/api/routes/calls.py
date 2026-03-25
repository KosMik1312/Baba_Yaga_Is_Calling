from fastapi import APIRouter, HTTPException, WebSocket, WebSocketDisconnect
from loguru import logger
import json
import base64

from app.models.schemas import CallRequest, CallResponse
from app.services.ai_service import ai_service
from app.api.routes.characters import CHARACTERS_DB
from datetime import datetime

router = APIRouter()

# Контекст персонажей (id → данные)
CHARACTERS_MAP = {c["id"]: c for c in CHARACTERS_DB}


@router.post("/")
async def start_call(call_request: CallRequest):
    logger.info(f"Starting call with character {call_request.character_id}")
    return CallResponse(
        character_id=call_request.character_id,
        response_text=f"Привет, {call_request.child_name}! Чем могу помочь?",
        audio_url=None,
        timestamp=datetime.now()
    )


@router.post("/end")
async def end_call(call_id: str):
    return {"status": "call_ended", "call_id": call_id}


@router.websocket("/ws/{character_id}")
async def websocket_call_endpoint(websocket: WebSocket, character_id: int):
    await websocket.accept()
    logger.info(f"WebSocket connected | character={character_id}")

    character = CHARACTERS_MAP.get(character_id)
    if not character:
        await websocket.send_json({"type": "error", "message": "Персонаж не найден"})
        await websocket.close()
        return

    child_name = "друг"
    conversation_history = []

    try:
        while True:
            data = await websocket.receive_text()
            message = json.loads(data)
            msg_type = message.get("type")

            if msg_type == "start_call":
                child_name = message.get("child_name", "друг")
                logger.info(f"Call started | child={child_name}")
                await websocket.send_json({
                    "type": "call_started",
                    "character_id": character_id,
                    "status": "connected"
                })

            elif msg_type == "audio_chunk":
                # Аудио приходит как base64
                audio_b64 = message.get("data", "")
                audio_bytes = base64.b64decode(audio_b64)

                await websocket.send_json({"type": "processing"})

                result = await ai_service.process_speech(
                    audio_data=audio_bytes,
                    character_id=character_id,
                    child_name=child_name,
                    character_context=character,
                    conversation_history=conversation_history,
                )

                if result["success"]:
                    # Сохраняем историю диалога (последние 10 сообщений)
                    conversation_history.append({"role": "user", "content": result["recognized_text"]})
                    conversation_history.append({"role": "assistant", "content": result["response_text"]})
                    conversation_history = conversation_history[-10:]

                    audio_b64_response = base64.b64encode(result["audio_response"]).decode()
                    await websocket.send_json({
                        "type": "response",
                        "recognized_text": result["recognized_text"],
                        "response_text": result["response_text"],
                        "audio": audio_b64_response,
                    })
                else:
                    await websocket.send_json({
                        "type": "error",
                        "message": result.get("error", "Ошибка обработки")
                    })

            elif msg_type == "end_call":
                await websocket.send_json({"type": "call_ended"})
                await websocket.close()
                break

    except WebSocketDisconnect:
        logger.info(f"WebSocket disconnected | character={character_id}")
    except Exception as e:
        logger.error(f"WebSocket error: {e}")
        try:
            await websocket.send_json({"type": "error", "message": str(e)})
            await websocket.close()
        except:
            pass
