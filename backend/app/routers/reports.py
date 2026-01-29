from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List
from ..deps import get_current_user, get_db
from ..models import Report, Grievance
from ..schemas import ReportCreate, ReportResponse
from ..serializers import serialize_report

router = APIRouter(prefix="/reports", tags=["Reports"])

@router.post("/", response_model=ReportResponse)
def create_report(payload: ReportCreate, user=Depends(get_current_user), db: Session = Depends(get_db)):
    grievance = db.get(Grievance, payload.grievance_id)
    if not grievance:
        raise HTTPException(status_code=404, detail="Grievance not found")

    report = Report(
        grievance_id=payload.grievance_id,
        content=payload.content,
        reporter_id=None if payload.is_anonymous else user.id,
        is_anonymous=payload.is_anonymous
    )
    db.add(report)
    db.commit()
    db.refresh(report)
    return serialize_report(report)

@router.get("/", response_model=List[ReportResponse])
def list_reports(db: Session = Depends(get_db)):
    reports = db.query(Report).all()
    return [serialize_report(r) for r in reports]

@router.get("/{report_id}", response_model=ReportResponse)
def get_report(report_id: int, db: Session = Depends(get_db)):
    report = db.get(Report, report_id)
    if not report:
        raise HTTPException(status_code=404, detail="Report not found")
    return serialize_report(report)

@router.get("/by-grievance/{grievance_id}", response_model=List[ReportResponse])
def reports_by_grievance(grievance_id: int, db: Session = Depends(get_db)):
    grievance = db.get(Grievance, grievance_id)
    if not grievance:
        raise HTTPException(status_code=404, detail="Grievance not found")
    return [serialize_report(r) for r in grievance.reports]
