# app/routers/donations.py
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from app.database import get_db
from app import models, schemas
from app.dependencies import require_roles, get_current_user

router = APIRouter()

@router.post("/", response_model=schemas.DonationOut)
async def create_donation(payload: schemas.DonationCreateIn, user = Depends(require_roles("donor")), db: AsyncSession = Depends(get_db)):
    if payload.donor_id != user.id:
        raise HTTPException(status_code=403, detail="donor_id must match authenticated user")
    obj = models.Donation(
        donor_id=payload.donor_id,
        donation_type=payload.donation_type,
        details=payload.details,
        delivery_method=payload.delivery_method,
        orphanage_id=payload.orphanage_id
    )
    db.add(obj)
    await db.commit()
    await db.refresh(obj)
    return obj

@router.get("/me", response_model=list[schemas.DonationOut])
async def my_donations(user = Depends(require_roles("donor")), db: AsyncSession = Depends(get_db)):
    q = select(models.Donation).where(models.Donation.donor_id == user.id).order_by(models.Donation.created_at.desc())
    r = await db.execute(q)
    return r.scalars().all()

@router.get("/pending", response_model=list[schemas.DonationOut])
async def all_pending_donations(user = Depends(require_roles("admin")), db: AsyncSession = Depends(get_db)):
    q = select(models.Donation).where(models.Donation.status == "pending")
    r = await db.execute(q)
    return r.scalars().all()

@router.patch("/{donation_id}/decision", response_model=schemas.DonationOut)
async def orphan_decision(donation_id: str, payload: schemas.DonationDecisionIn, user = Depends(require_roles("orphanage", "admin")), db: AsyncSession = Depends(get_db)):
    q = select(models.Donation).where(models.Donation.id == donation_id)
    r = await db.execute(q)
    donation = r.scalars().first()
    if not donation:
        raise HTTPException(status_code=404, detail="Donation not found")
    
    # If donation is assigned to a specific orphanage, only that orphanage can approve
    if donation.orphanage_id:
        # Check if current user is the owner of this orphanage
        q_org = select(models.Orphanage).where(models.Orphanage.id == donation.orphanage_id)
        r_org = await db.execute(q_org)
        target_org = r_org.scalars().first()
        
        if not target_org or target_org.user_id != user.id:
             raise HTTPException(status_code=403, detail="Only the selected orphanage can approve this donation")
    
    donation.status = "approved" if payload.approve else "rejected"
    db.add(donation)
    await db.commit()
    await db.refresh(donation)
    return donation
