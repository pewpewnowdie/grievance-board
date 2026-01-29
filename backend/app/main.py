from fastapi import FastAPI
from .database import engine
from .models import Base
from .routers import grievances, reports, auth

Base.metadata.create_all(bind=engine)

app = FastAPI(title="QC Grievance Board")

app.include_router(auth.router)
app.include_router(grievances.router)
app.include_router(reports.router)
