from fastapi import APIRouter, HTTPException
from typing import List
from loguru import logger

from app.models.schemas import CharacterResponse

router = APIRouter()

# Временные данные для MVP
CHARACTERS_DB = [
    {
        "id": 1,
        "name": "Баба Яга",
        "name_en": "Baba Yaga",
        "description": "Волшебница из сказок",
        "description_en": "The magic witch from fairy tales",
        "is_free": True,
        "voice_model": "baba_yaga_v1",
        "personality": "добрая, мудрая, любит загадывать загадки",
        "personality_en": "kind, wise, loves to ask riddles",
        "avatar_url": None,
        "created_at": "2026-03-25T00:00:00"
    }
]


@router.get("/", response_model=List[CharacterResponse])
async def get_all_characters():
    """Получить всех доступных персонажей"""
    logger.info("Getting all characters")
    return CHARACTERS_DB


@router.get("/{character_id}", response_model=CharacterResponse)
async def get_character(character_id: int):
    """Получить персонажа по ID"""
    logger.info(f"Getting character: {character_id}")
    
    for character in CHARACTERS_DB:
        if character["id"] == character_id:
            return character
    
    raise HTTPException(status_code=404, detail="Character not found")


@router.post("/")
async def create_character(character: dict):
    """Создать нового персонажа (для админки)"""
    logger.info(f"Creating character: {character.get('name')}")
    
    # TODO: Реализовать сохранение в БД
    new_id = max([c["id"] for c in CHARACTERS_DB]) + 1
    new_character = {
        "id": new_id,
        **character,
        "created_at": "2026-03-25T00:00:00"
    }
    CHARACTERS_DB.append(new_character)
    
    return new_character
