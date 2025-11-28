# app/main.py
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.config import settings
from app.database import engine, Base
from app.routers import auth, users, donations, orphanages, volunteers

app = FastAPI(title="Meal Link Connect - Backend")

app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.FRONTEND_ORIGINS,
    allow_origin_regex="https?://.*",
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include routers
app.include_router(auth.router, prefix="/auth", tags=["Auth"])
app.include_router(users.router, prefix="/users", tags=["Users"])
app.include_router(donations.router, prefix="/donations", tags=["Donations"])
app.include_router(orphanages.router, prefix="/orphanages", tags=["Orphanages"])
app.include_router(volunteers.router, prefix="/volunteers", tags=["Volunteers"])

@app.on_event("startup")
async def startup():
    # Create tables in dev if not using Alembic
    async with engine.begin() as conn:
        await conn.run_sync(Base.metadata.create_all)
