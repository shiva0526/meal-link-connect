from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, insert
from datetime import datetime, timedelta, timezone
import random
import logging

from app.database import get_db
from app import models, schemas, auth
from app.config import settings

# Use the main uvicorn logger for maximum visibility in the server terminal
logger = logging.getLogger("uvicorn")

router = APIRouter()

def _generate_otp():
    start = 10**(settings.OTP_LENGTH - 1)
    end = (10**settings.OTP_LENGTH) - 1
    return str(random.randint(start, end))

@router.post("/request-otp")
async def request_otp(payload: schemas.RequestOTPIn, db: AsyncSession = Depends(get_db)):
    phone = payload.phone.strip()
    logger.error(f"request_otp called for phone={phone} is_login={payload.is_login}")
    print(f"request_otp called for phone={phone} is_login={payload.is_login}")

    # Check user existence
    q = select(models.User).where(models.User.phone == phone)
    r = await db.execute(q)
    user = r.scalars().first()

    if payload.is_login:
        if not user:
            raise HTTPException(status_code=400, detail="User not registered. Please sign up.")
    else:
        if user:
            raise HTTPException(status_code=400, detail="User already registered. Please login.")

    code = _generate_otp()
    
    # --- UPDATED LOGGING ---
    logger.warning(f"\n{'='*20}")
    logger.warning(f" YOUR OTP IS: {code}")
    logger.warning(f"{'='*20}\n")
    print(f"[DEBUG OTP] {code}")
    # -----------------------

    hashed = auth.hash_secret(code)
    
    expires_at = datetime.now(timezone.utc) + timedelta(seconds=settings.OTP_EXPIRE_SECONDS)
    
    otp_obj = models.OTP(phone=phone, otp_hash=hashed, expires_at=expires_at)
    db.add(otp_obj)
    await db.commit()
    print(f"OTP saved for phone={phone} (hash_len={len(hashed)}) expires_at={expires_at}")
    
    if settings.DEBUG_RETURN_OTP:
        return {"status": "ok", "debug_otp": code}
    return {"status": "ok"}

@router.post("/verify-otp", response_model=schemas.TokenOut)
async def verify_otp(payload: schemas.VerifyOTPIn, db: AsyncSession = Depends(get_db)):
    phone = payload.phone.strip()
    print(f"verify_otp called for phone={phone} otp_provided={payload.otp}")
    logger.error(f"verify_otp called for phone={phone}")
    q = select(models.OTP).where(models.OTP.phone == phone, models.OTP.used == False).order_by(models.OTP.created_at.desc())
    r = await db.execute(q)
    otp_row = r.scalars().first()
    
    if not otp_row:
        logger.warning(f"verify_otp: no otp row found for phone={phone}")
        raise HTTPException(status_code=400, detail="No OTP found")
        
    if otp_row.expires_at < datetime.now(timezone.utc):
        logger.warning(f"verify_otp: otp expired for phone={phone} created_at={otp_row.created_at} expires_at={otp_row.expires_at}")
        raise HTTPException(status_code=400, detail="OTP expired")
        
    try:
        verify_result = auth.verify_secret(payload.otp, otp_row.otp_hash)
    except Exception as e:
        logger.exception("verify_otp: error during verify_secret")
        raise HTTPException(status_code=400, detail="Invalid OTP")

    logger.debug(f"verify_otp: phone={phone} otp_provided={payload.otp} verify_result={verify_result}")
    if not verify_result:
        logger.warning(f"verify_otp: invalid otp for phone={phone}")
        raise HTTPException(status_code=400, detail="Invalid OTP")
    
    otp_row.used = True
    db.add(otp_row)
    
    q2 = select(models.User).where(models.User.phone == phone)
    r2 = await db.execute(q2)
    user = r2.scalars().first()
    
    if not user:
        if not payload.full_name:
            # This should theoretically be caught by request_otp is_login check, but double check here
            raise HTTPException(status_code=400, detail="User not registered. Please sign up.")
            
        user = models.User(phone=phone, full_name=payload.full_name)
        db.add(user)
        await db.flush()
        role_to_assign = (payload.role.value if payload.role else "donor")
        ins = insert(models.user_roles_table).values(user_id=user.id, role=role_to_assign)
        await db.execute(ins)

        # If role is orphanage, create the orphanage profile
        if role_to_assign == "orphanage" and payload.orphanage_details:
            # Extract details
            org_name = payload.orphanage_details.get("name")
            org_address = payload.orphanage_details.get("address")
            if org_name and org_address:
                new_org = models.Orphanage(
                    user_id=user.id,
                    name=org_name,
                    address=org_address,
                    contact_person=user.full_name,
                    phone=user.phone,
                    approved=False # Explicitly false
                )
                db.add(new_org)
                await db.commit() # Commit immediately
                raise HTTPException(status_code=403, detail="Account created. Please wait for admin approval.")
    
    await db.commit()

    # Login Check: If user is an orphanage, check approval status
    # We need to check the user's role and if it's orphanage, check the orphanage table
    q_role = select(models.user_roles_table.c.role).where(models.user_roles_table.c.user_id == user.id)
    r_role = await db.execute(q_role)
    roles = r_role.scalars().all()

    if "orphanage" in roles:
        q_org = select(models.Orphanage).where(models.Orphanage.user_id == user.id)
        r_org = await db.execute(q_org)
        org = r_org.scalars().first()
        if org and not org.approved:
             raise HTTPException(status_code=403, detail="Account pending admin approval.")

    token = auth.create_access_token(user.id)
    return {"access_token": token, "token_type": "bearer"}