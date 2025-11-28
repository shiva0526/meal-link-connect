# app/schemas.py
from pydantic import BaseModel, Field
from typing import Optional, List, Dict, Any
from datetime import datetime
from app.models import RoleEnum, DonationType, DonationStatus

# Auth
class RequestOTPIn(BaseModel):
    phone: str
    is_login: bool = True

class VerifyOTPIn(BaseModel):
    phone: str
    otp: str
    full_name: Optional[str] = None
    role: Optional[RoleEnum] = None  # allow role selection at onboarding
    orphanage_details: Optional[Dict[str, Any]] = None

class TokenOut(BaseModel):
    access_token: str
    token_type: str = "bearer"

class MeOut(BaseModel):
    id: str
    phone: str
    full_name: Optional[str] = None
    roles: List[RoleEnum] = []

# Roles
class AssignRoleIn(BaseModel):
    user_id: str
    role: RoleEnum

# Orphanage
class OrphanageCreateIn(BaseModel):
    user_id: Optional[str]
    name: str
    address: str
    phone: Optional[str] = None
    contact_person: Optional[str] = None

class OrphanageOut(OrphanageCreateIn):
    id: str
    approved: bool
    created_at: Optional[datetime]

# Donation
class DonationCreateIn(BaseModel):
    donor_id: str
    donation_type: DonationType
    details: Optional[Dict[str, Any]] = None
    delivery_method: Optional[str] = None
    orphanage_id: Optional[str] = None

class DonationOut(BaseModel):
    id: str
    donor_id: str
    donation_type: DonationType
    details: Optional[Dict[str, Any]] = None
    delivery_method: Optional[str] = None
    orphanage_id: Optional[str] = None
    assigned_volunteer_id: Optional[str] = None
    status: DonationStatus
    created_at: Optional[datetime]
    updated_at: Optional[datetime]

class DonationDecisionIn(BaseModel):
    approve: bool
    note: Optional[str] = None

class VolunteerClaimIn(BaseModel):
    volunteer_id: str
