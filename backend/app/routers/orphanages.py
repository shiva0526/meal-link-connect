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
    return obj

@router.get("/all", response_model=list[schemas.OrphanageOut])
async def list_all_orphanages(db: AsyncSession = Depends(get_db)):
    q = select(models.Orphanage).where(models.Orphanage.approved == True)
    r = await db.execute(q)
    return r.scalars().all()

@router.get("/pending-approval", response_model=list[schemas.OrphanageOut])
async def list_pending_orphanages(user = Depends(require_roles("admin")), db: AsyncSession = Depends(get_db)):
    q = select(models.Orphanage).where(models.Orphanage.approved == False)
    r = await db.execute(q)
    return r.scalars().all()

@router.patch("/{orphanage_id}/approve", response_model=schemas.OrphanageOut)
async def approve_orphanage(orphanage_id: str, user = Depends(require_roles("admin")), db: AsyncSession = Depends(get_db)):
    q = select(models.Orphanage).where(models.Orphanage.id == orphanage_id)
    r = await db.execute(q)
    obj = r.scalars().first()
    if not obj:
        raise HTTPException(404, "Orphanage not found")
    obj.approved = True
    db.add(obj)
    await db.commit()
    await db.refresh(obj)
    return obj

@router.get("/my-pending", response_model=list[schemas.DonationOut])
async def my_pending_donations(user = Depends(require_roles("orphanage")), db: AsyncSession = Depends(get_db)):
    # Find the orphanage associated with this user
    q_org = select(models.Orphanage).where(models.Orphanage.user_id == user.id)
    r_org = await db.execute(q_org)
    org = r_org.scalars().first()
    if not org:
        raise HTTPException(404, "No orphanage associated with this user")
    
    q = select(models.Donation).where(models.Donation.orphanage_id == org.id, models.Donation.status == "pending")
    r = await db.execute(q)
    return r.scalars().all()
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
