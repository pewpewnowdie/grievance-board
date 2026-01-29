from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List
from pydantic import BaseModel
from ..deps import get_current_user, manager_only, get_db
from ..models import Grievance, Report
from ..schemas import GrievanceCreate, GrievanceResponse
from ..serializers import serialize_grievance

router = APIRouter(prefix="/grievances", tags=["Grievances"])


class MergePayload(BaseModel):
    target_id: int

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
    return serialize_grievance(grievance)

@router.get("/", response_model=List[GrievanceResponse])
def list_grievances(db: Session = Depends(get_db)):
    grievances = db.query(Grievance).all()
    return [serialize_grievance(g) for g in grievances]

@router.get("/{grievance_id}", response_model=GrievanceResponse)
def get_grievance(grievance_id: int, db: Session = Depends(get_db)):
    grievance = db.get(Grievance, grievance_id)
    if not grievance:
        raise HTTPException(status_code=404, detail="Grievance not found")
    return serialize_grievance(grievance)

@router.post("/{grievance_id}/reopen", response_model=GrievanceResponse)
def reopen_grievance(grievance_id: int, user=Depends(manager_only), db: Session = Depends(get_db)):
    grievance = db.get(Grievance, grievance_id)
    if not grievance:
        raise HTTPException(status_code=404, detail="Grievance not found")
    grievance.status = "reopened"
    db.commit()
    db.refresh(grievance)
    return serialize_grievance(grievance)

@router.post("/{grievance_id}/close", response_model=GrievanceResponse)
def close_grievance(grievance_id: int, user=Depends(manager_only), db: Session = Depends(get_db)):
    grievance = db.get(Grievance, grievance_id)
    if not grievance:
        raise HTTPException(status_code=404, detail="Grievance not found")
    grievance.status = "closed"
    db.commit()
    db.refresh(grievance)
    return serialize_grievance(grievance)


@router.post("/{grievance_id}/merge", response_model=GrievanceResponse)
def merge_grievance(grievance_id: int, payload: MergePayload, user=Depends(manager_only), db: Session = Depends(get_db)):
    source = db.get(Grievance, grievance_id)
    if not source:
        raise HTTPException(status_code=404, detail="Source grievance not found")
    target = db.get(Grievance, payload.target_id)
    if not target:
        raise HTTPException(status_code=404, detail="Target grievance not found")

    # Move all reports from source to target
    for r in list(source.reports):
        r.grievance_id = target.id
    db.commit()

    # Optionally delete the source grievance
    db.delete(source)
    db.commit()

    db.refresh(target)
    return serialize_grievance(target)
