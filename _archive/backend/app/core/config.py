from pydantic_settings import BaseSettings
from typing import List


class Settings(BaseSettings):
    # GigaChat
    GIGACHAT_CLIENT_ID: str = ""
    GIGACHAT_AUTH_KEY: str = ""  # Authorization key из личного кабинета
    GIGACHAT_SCOPE: str = "GIGACHAT_API_PERS"
    GIGACHAT_AUTH_URL: str = "https://ngw.devices.sberbank.ru:9443/api/v2/oauth"
    
    # Silero
    SILERO_MODEL_PATH: str = "./models/silero"
    SILERO_SAMPLE_RATE: int = 16000
    
    # Database
    DATABASE_URL: str = "sqlite+aiosqlite:///./babayaga.db"
    
    # JWT
    SECRET_KEY: str = "super_secret_key_change_in_production_baba_yaga_2026"
    ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 1440
    
    # Server
    HOST: str = "0.0.0.0"
    PORT: int = 8000
    DEBUG: bool = True
    
    # CORS
    CORS_ORIGINS: List[str] = [
        "http://localhost:19006",
        "http://localhost:8081",
        "http://192.168.0.102:8081",
        "exp://192.168.0.102:8081",
        "exp://192.168.0.102:19000",
    ]
    
    class Config:
        env_file = ".env"
        case_sensitive = True


settings = Settings()
