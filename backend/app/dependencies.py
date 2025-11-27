# app/dependencies.py
from fastapi import Depends, Header, HTTPException
from app.auth import decode_access_token
from app.database import get_db
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession
from app import models

async def get_current_user(authorization: str = Header(None), db: AsyncSession = Depends(get_db)):
    if not authorization:
        raise HTTPException(status_code=401, detail="Missing authorization header")
    if not authorization.lower().startswith("bearer "):
        raise HTTPException(status_code=401, detail="Invalid auth scheme")
    token = authorization.split(" ", 1)[1].strip()
    sub = decode_access_token(token)
    if not sub:
        raise HTTPException(status_code=401, detail="Invalid or expired token")
    q = select(models.User).where(models.User.id == sub)
    r = await db.execute(q)
    user = r.scalars().first()
    if not user:
        raise HTTPException(status_code=401, detail="User not found")
    q2 = select(models.user_roles_table.c.role).where(models.user_roles_table.c.user_id == user.id)
    r2 = await db.execute(q2)
    roles = [row[0] for row in r2.fetchall()]
    user._roles = roles
    return user

def require_roles(*allowed_roles: str):
    async def role_checker(user = Depends(get_current_user)):
        user_roles = getattr(user, "_roles", [])
        if not any(r in allowed_roles for r in user_roles):
            raise HTTPException(status_code=403, detail="Insufficient role")
        return user
    return role_checker
