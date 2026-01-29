from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List
from ..deps import get_current_user, manager_only, get_db
from ..models import Grievance
from ..schemas import GrievanceCreate, GrievanceResponse

router = APIRouter(prefix="/grievances", tags=["Grievances"])

@router.post("/", response_model=GrievanceResponse)
def create_grievance(payload: GrievanceCreate, user=Depends(get_current_user), db: Session = Depends(get_db)):
    grievance = Grievance(
        title=payload.title,
        description=payload.description,
        reporter_id=None if payload.is_anonymous else user.id,
        is_anonymous=payload.is_anonymous
    )
    db.add(grievance)
    db.commit()
    db.refresh(grievance)
    return grievance

@router.get("/", response_model=List[GrievanceResponse])
def list_grievances(user=Depends(get_current_user), db: Session = Depends(get_db)):
    return db.query(Grievance).all()

@router.get("/{grievance_id}", response_model=GrievanceResponse)
def get_grievance(grievance_id: int, user=Depends(get_current_user), db: Session = Depends(get_db)):
    grievance = db.get(Grievance, grievance_id)
    if not grievance:
        raise HTTPException(status_code=404, detail="Grievance not found")
    return grievance

@router.post("/{grievance_id}/reopen", response_model=GrievanceResponse)
def reopen_grievance(grievance_id: int, user=Depends(manager_only), db: Session = Depends(get_db)):
    grievance = db.get(Grievance, grievance_id)
    if not grievance:
        raise HTTPException(status_code=404, detail="Grievance not found")
    grievance.status = "reopened"
    db.commit()
    db.refresh(grievance)
    return grievance
