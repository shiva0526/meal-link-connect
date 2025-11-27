# app/routers/users.py
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, insert
from app.database import get_db
from app import models, schemas
from app.dependencies import require_roles, get_current_user

router = APIRouter()

@router.get("/me", response_model=schemas.MeOut)
async def me(user = Depends(get_current_user), db: AsyncSession = Depends(get_db)):
    q = select(models.user_roles_table.c.role).where(models.user_roles_table.c.user_id == user.id)
    r = await db.execute(q)
    roles = [row[0] for row in r.fetchall()]
    return {"id": user.id, "phone": user.phone, "full_name": user.full_name, "roles": roles}

@router.get("/all", response_model=list[schemas.MeOut])
async def list_users(admin = Depends(require_roles("admin")), db: AsyncSession = Depends(get_db)):
    q = select(models.User)
    r = await db.execute(q)
    users = r.scalars().all()
    out = []
    for u in users:
        q2 = select(models.user_roles_table.c.role).where(models.user_roles_table.c.user_id == u.id)
        r2 = await db.execute(q2)
        roles = [row[0] for row in r2.fetchall()]
        out.append({"id": u.id, "phone": u.phone, "full_name": u.full_name, "roles": roles})
    return out

@router.post("/assign-role")
async def assign_role(payload: schemas.AssignRoleIn, admin = Depends(require_roles("admin")), db: AsyncSession = Depends(get_db)):
    ins = insert(models.user_roles_table).values(user_id=payload.user_id, role=payload.role.value)
    await db.execute(ins)
    await db.commit()
    return {"ok": True}
