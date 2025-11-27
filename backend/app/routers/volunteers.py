# app/routers/volunteers.py
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from app.database import get_db
from app import models, schemas
from app.dependencies import require_roles

router = APIRouter()

@router.get("/available", response_model=list[schemas.DonationOut])
async def available_to_collect(user = Depends(require_roles("volunteer")), db: AsyncSession = Depends(get_db)):
    q = select(models.Donation).where(models.Donation.status == "approved", models.Donation.assigned_volunteer_id == None)
    r = await db.execute(q)
    return r.scalars().all()

@router.post("/claim/{donation_id}", response_model=schemas.DonationOut)
async def claim_donation(donation_id: str, user = Depends(require_roles("volunteer")), db: AsyncSession = Depends(get_db)):
    q = select(models.Donation).where(models.Donation.id == donation_id)
    r = await db.execute(q)
    donation = r.scalars().first()
    if not donation:
        raise HTTPException(status_code=404, detail="Donation not found")
    if donation.status != "approved":
        raise HTTPException(status_code=400, detail="Donation not available for pickup")
    if donation.assigned_volunteer_id:
        raise HTTPException(status_code=400, detail="Donation already claimed")
    donation.assigned_volunteer_id = user.id
    donation.status = "in_transit"
    db.add(donation)
    await db.commit()
    await db.refresh(donation)
    return donation
