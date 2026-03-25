from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from loguru import logger
import uvicorn

from app.core.config import settings
from app.api.routes import calls, users, characters
from app.api.websocket import call_handler

# Инициализация приложения
app = FastAPI(
    title="Baba Yaga Is Calling API",
    description="API для детского приложения с виртуальными персонажами",
    version="0.1.0-mvp"
)

# CORS настройки
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.CORS_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Подключение роутов
app.include_router(calls.router, prefix="/api/v1/calls", tags=["Calls"])
app.include_router(users.router, prefix="/api/v1/users", tags=["Users"])
app.include_router(characters.router, prefix="/api/v1/characters", tags=["Characters"])

# WebSocket endpoint
app.websocket("/ws/call/{character_id}")

@app.on_event("startup")
async def startup_event():
    logger.info("🚀 Baba Yaga API is starting...")
    logger.info(f"Debug mode: {settings.DEBUG}")
    
@app.on_event("shutdown")
async def shutdown_event():
    logger.info("👋 Baba Yaga API is shutting down...")

@app.get("/")
async def root():
    return {
        "message": "Baba Yaga Is Calling API",
        "version": "0.1.0-mvp",
        "status": "running"
    }

@app.get("/health")
async def health_check():
    return {"status": "healthy"}

if __name__ == "__main__":
    uvicorn.run(
        "main:app",
        host=settings.HOST,
        port=settings.PORT,
        reload=settings.DEBUG
    )
