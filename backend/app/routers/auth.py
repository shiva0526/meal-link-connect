from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, insert
from datetime import datetime, timedelta, timezone # <--- Import timezone
import random
from app.database import get_db
from app import models, schemas, auth
from app.config import settings

router = APIRouter()

def _generate_otp():
    start = 10**(settings.OTP_LENGTH - 1)
    end = (10**settings.OTP_LENGTH) - 1
    return str(random.randint(start, end))

@router.post("/request-otp")
async def request_otp(payload: schemas.RequestOTPIn, db: AsyncSession = Depends(get_db)):
    phone = payload.phone.strip()
    code = _generate_otp()
    
    # --- DEBUG LOGGING ---
    print(f"\n{'='*20}")
    print(f" YOUR OTP IS: {code}")
    print(f"{'='*20}\n")
    # ---------------------

    hashed = auth.hash_secret(code)
    
    # FIX: Use timezone-aware datetime
    expires_at = datetime.now(timezone.utc) + timedelta(seconds=settings.OTP_EXPIRE_SECONDS)
    
    otp_obj = models.OTP(phone=phone, otp_hash=hashed, expires_at=expires_at)
    db.add(otp_obj)
    await db.commit()
    
    if settings.DEBUG_RETURN_OTP:
        return {"status": "ok", "debug_otp": code}
    return {"status": "ok"}

@router.post("/verify-otp", response_model=schemas.TokenOut)
async def verify_otp(payload: schemas.VerifyOTPIn, db: AsyncSession = Depends(get_db)):
    phone = payload.phone.strip()
    q = select(models.OTP).where(models.OTP.phone == phone, models.OTP.used == False).order_by(models.OTP.created_at.desc())
    r = await db.execute(q)
    otp_row = r.scalars().first()
    
    if not otp_row:
        raise HTTPException(status_code=400, detail="No OTP found")
        
    # FIX: Compare with timezone-aware current time
    if otp_row.expires_at < datetime.now(timezone.utc):
        raise HTTPException(status_code=400, detail="OTP expired")
        
    if not auth.verify_secret(payload.otp, otp_row.otp_hash):
        raise HTTPException(status_code=400, detail="Invalid OTP")
    
    otp_row.used = True
    db.add(otp_row)
    
    # Find or Create User Logic
    q2 = select(models.User).where(models.User.phone == phone)
    r2 = await db.execute(q2)
    user = r2.scalars().first()
    
    if not user:
        user = models.User(phone=phone, full_name=payload.full_name or None)
        db.add(user)
        await db.flush()
        role_to_assign = (payload.role.value if payload.role else "donor")
        ins = insert(models.user_roles_table).values(user_id=user.id, role=role_to_assign)
        await db.execute(ins)
    
    await db.commit()
    token = auth.create_access_token(user.id)
    return {"access_token": token, "token_type": "bearer"}