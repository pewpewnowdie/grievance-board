from app.database import SessionLocal
from app.models import User
from app.routers.auth import hash_password

db = SessionLocal()

manager = User(
    name="Manager",
    email="manager@test.com",
    role="MANAGER",
    password_hash=hash_password("manager123")
)

qc = User(
    name="QC User",
    email="qc@test.com",
    role="QC",
    password_hash=hash_password("qc123")
)

db.add_all([manager, qc])
db.commit()
