from app.database import Base, engine
from app.models import User, Grievance, Report  # import all models

# Create all tables in the database
Base.metadata.create_all(bind=engine)

print("✅ Tables created successfully!")
