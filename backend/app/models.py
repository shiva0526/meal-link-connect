# app/models.py
import enum, uuid
from sqlalchemy import (
    Column, String, DateTime, Boolean, ForeignKey, Enum, JSON, Table
)
from sqlalchemy.sql import func
from sqlalchemy.orm import relationship
from app.database import Base

def gen_uuid():
    return str(uuid.uuid4())

class RoleEnum(str, enum.Enum):
    admin = "admin"
    donor = "donor"
    orphanage = "orphanage"
    volunteer = "volunteer"

class DonationType(str, enum.Enum):
    food = "food"
    money = "money"
    clothes = "clothes"
    furniture = "furniture"

class DonationStatus(str, enum.Enum):
    pending = "pending"
    approved = "approved"
    rejected = "rejected"
    in_transit = "in_transit"
    delivered = "delivered"

user_roles_table = Table(
    "user_roles",
    Base.metadata,
    Column("id", String, primary_key=True, default=gen_uuid),
    Column("user_id", String, ForeignKey("users.id", ondelete="CASCADE"), index=True),
    Column("role", Enum(RoleEnum, name="role_enum")),
    Column("created_at", DateTime(timezone=True), server_default=func.now())
)

class User(Base):
    __tablename__ = "users"
    id = Column(String, primary_key=True, default=gen_uuid)
    phone = Column(String, unique=True, index=True, nullable=False)
    full_name = Column(String, nullable=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now())

class OTP(Base):
    __tablename__ = "otps"
    id = Column(String, primary_key=True, default=gen_uuid)
    phone = Column(String, index=True, nullable=False)
    otp_hash = Column(String, nullable=False)
    expires_at = Column(DateTime(timezone=True), nullable=False)
    used = Column(Boolean, default=False)
    created_at = Column(DateTime(timezone=True), server_default=func.now())

class Orphanage(Base):
    __tablename__ = "orphanages"
    id = Column(String, primary_key=True, default=gen_uuid)
    user_id = Column(String, ForeignKey("users.id", ondelete="SET NULL"), nullable=True)
    name = Column(String, nullable=False)
    address = Column(String, nullable=False)
    phone = Column(String)
    contact_person = Column(String)
    approved = Column(Boolean, default=False)
    created_at = Column(DateTime(timezone=True), server_default=func.now())

class Donation(Base):
    __tablename__ = "donations"
    id = Column(String, primary_key=True, default=gen_uuid)
    donor_id = Column(String, ForeignKey("users.id", ondelete="SET NULL"), nullable=False, index=True)
    orphanage_id = Column(String, ForeignKey("orphanages.id", ondelete="SET NULL"), nullable=True, index=True)
    donation_type = Column(Enum(DonationType, name="donation_type"), nullable=False)
    details = Column(JSON, nullable=True)
    delivery_method = Column(String, nullable=True)
    assigned_volunteer_id = Column(String, ForeignKey("users.id", ondelete="SET NULL"), nullable=True)
    status = Column(Enum(DonationStatus, name="donation_status"), nullable=False, default=DonationStatus.pending)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), server_default=func.now(), onupdate=func.now())

    donor = relationship("User", foreign_keys=[donor_id])
    orphanage = relationship("Orphanage", foreign_keys=[orphanage_id])
    assigned_volunteer = relationship("User", foreign_keys=[assigned_volunteer_id])
