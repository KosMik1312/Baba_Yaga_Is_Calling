from fastapi import APIRouter, HTTPException, Depends
from typing import List
from loguru import logger

from app.models.schemas import UserCreate, UserResponse, UserUpdate
# from app.db.repositories import UserRepository

router = APIRouter()

# repository = UserRepository()


@router.post("/", response_model=UserResponse)
async def create_user(user: UserCreate):
    """Создать нового пользователя (ребёнка)"""
    logger.info(f"Creating user: {user.child_name}, age {user.child_age}")
    
    # TODO: Реализовать сохранение в БД
    # user_data = await repository.create(user)
    
    # Заглушка для MVP
    return UserResponse(
        id=1,
        child_name=user.child_name,
        child_age=user.child_age,
        parent_email=user.parent_email,
        created_at="2026-03-25T00:00:00",
        updated_at="2026-03-25T00:00:00"
    )


@router.get("/{user_id}", response_model=UserResponse)
async def get_user(user_id: int):
    """Получить пользователя по ID"""
    logger.info(f"Getting user: {user_id}")
    
    # TODO: Реализовать получение из БД
    # user = await repository.get_by_id(user_id)
    
    # Заглушка для MVP
    if user_id == 1:
        return UserResponse(
            id=1,
            child_name="Саша",
            child_age=7,
            parent_email=None,
            created_at="2026-03-25T00:00:00",
            updated_at="2026-03-25T00:00:00"
        )
    
    raise HTTPException(status_code=404, detail="User not found")


@router.put("/{user_id}", response_model=UserResponse)
async def update_user(user_id: int, user_update: UserUpdate):
    """Обновить данные пользователя"""
    logger.info(f"Updating user: {user_id}")
    
    # TODO: Реализовать обновление в БД
    # updated_user = await repository.update(user_id, user_update)
    
    raise HTTPException(status_code=501, detail="Not implemented yet")


@router.delete("/{user_id}")
async def delete_user(user_id: int):
    """Удалить пользователя"""
    logger.info(f"Deleting user: {user_id}")
    
    # TODO: Реализовать удаление из БД
    # await repository.delete(user_id)
    
    raise HTTPException(status_code=501, detail="Not implemented yet")
