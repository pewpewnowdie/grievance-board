from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker, declarative_base, Session

# ----------------------------
# Database URL
# ----------------------------
# SQLite local file database
SQLALCHEMY_DATABASE_URL = "sqlite:///./grievance.db"

# create engine
# check_same_thread=False is required for SQLite with FastAPI + multiple threads
engine = create_engine(
    SQLALCHEMY_DATABASE_URL, connect_args={"check_same_thread": False}
)

# create session local
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

# Base class for models
Base = declarative_base()

# ----------------------------
# Dependency for FastAPI
# ----------------------------
def get_db():
    """
    Yield a SQLAlchemy session for a request and close it automatically.
    Use in endpoints: db: Session = Depends(get_db)
    """
    db: Session = SessionLocal()
    try:
        yield db
    finally:
        db.close()
