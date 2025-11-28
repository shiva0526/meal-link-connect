import asyncio
from app.database import AsyncSessionLocal
from app.models import Orphanage, User, RoleEnum, user_roles_table
from sqlalchemy import select, insert
import uuid

async def check_and_seed():
    async with AsyncSessionLocal() as db:
        # Check for orphanages
        q = select(Orphanage)
        r = await db.execute(q)
        orphanages = r.scalars().all()
        print(f"Found {len(orphanages)} orphanages.")
        
        if len(orphanages) == 0:
            print("Seeding a test orphanage...")
            # Create a user for the orphanage
            user = User(phone="8888888888", full_name="Test Orphanage Admin")
            db.add(user)
            await db.flush()
            
            # Assign role
            await db.execute(insert(user_roles_table).values(user_id=user.id, role="orphanage"))
            
            # Create orphanage
            org = Orphanage(
                user_id=user.id,
                name="Sunshine Orphanage",
                address="123 Sunshine St, Happy City",
                phone="8888888888",
                contact_person="Mr. Sunshine",
                approved=True
            )
            db.add(org)
            await db.commit()
            print("Seeded 'Sunshine Orphanage' (Phone: 8888888888, OTP: Any valid OTP)")
        else:
            for org in orphanages:
                print(f" - {org.name} (Approved: {org.approved})")

if __name__ == "__main__":
    asyncio.run(check_and_seed())
