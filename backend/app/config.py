# app/config.py
from pydantic_settings import BaseSettings
from functools import lru_cache
from typing import List
import os

class Settings(BaseSettings):
    DATABASE_URL: str
    SECRET_KEY: str
    ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 60 * 24 * 7
    OTP_EXPIRE_SECONDS: int = 300
    OTP_LENGTH: int = 6
    DEBUG_RETURN_OTP: bool = True
    FRONTEND_ORIGINS: List[str] = ["http://localhost:3000"]

    class Config:
        env_file = ".env"
        case_sensitive = True

@lru_cache()
def get_settings():
    s = Settings()
    # allow comma-separated env override for FRONTEND_ORIGINS
    if isinstance(os.getenv("FRONTEND_ORIGINS"), str):
        s.FRONTEND_ORIGINS = [u.strip() for u in os.getenv("FRONTEND_ORIGINS").split(",") if u.strip()]
    return s

settings = get_settings()
