from .models import User, Grievance, Report

def serialize_user(user: User):
    if not user:
        return None
    return {"id": user.id, "name": user.name, "email": user.email}

def serialize_report(report):
    return {
        "id": report.id,
        "grievance_id": report.grievance_id,
        "content": report.content,
        "is_anonymous": report.is_anonymous,
        "reporter_id": report.reporter_id,
        "created_at": report.created_at.isoformat() if report.created_at else None,
        "user": None if report.is_anonymous else serialize_user(report.reporter)
    }

def serialize_grievance(grievance):
    return {
        "id": grievance.id,
        "title": grievance.title,
        "description": grievance.description,
        "status": grievance.status,
        "is_anonymous": grievance.is_anonymous,
        "created_at": grievance.created_at.isoformat() if grievance.created_at else None,
        "user": None if grievance.is_anonymous else serialize_user(grievance.reporter),
        "reports": [serialize_report(r) for r in grievance.reports]
    }
