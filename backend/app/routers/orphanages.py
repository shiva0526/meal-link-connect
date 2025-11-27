# app/routers/orphanages.py
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from app.database import get_db
from app import models, schemas
from app.dependencies import require_roles, get_current_user

router = APIRouter()

@router.post("/", response_model=schemas.OrphanageOut)
async def create_orphanage(payload: schemas.OrphanageCreateIn, user = Depends(require_roles("admin", "orphanage")), db: AsyncSession = Depends(get_db)):
    obj = models.Orphanage(**payload.dict())
    db.add(obj)
    await db.commit()
    await db.refresh(obj)
    return obj

@router.get("/{orphanage_id}/pending", response_model=list[schemas.DonationOut])
async def pending_for_orphanage(orphanage_id: str, user = Depends(require_roles("orphanage")), db: AsyncSession = Depends(get_db)):
    q = select(models.Donation).where(models.Donation.orphanage_id == orphanage_id, models.Donation.status == "pending")
    r = await db.execute(q)
    return r.scalars().all()

@router.get("/{orphanage_id}", response_model=schemas.OrphanageOut)
async def get_orphanage(orphanage_id: str, db: AsyncSession = Depends(get_db)):
    q = select(models.Orphanage).where(models.Orphanage.id == orphanage_id)
    r = await db.execute(q)
    obj = r.scalars().first()
    if not obj:
        raise HTTPException(404, "Orphanage not found")
    return obj
