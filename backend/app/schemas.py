from pydantic import BaseModel
from typing import List, Optional
from datetime import datetime

# ----------------------------
# User
# ----------------------------
class UserInfo(BaseModel):
    id: int
    name: str
    email: str

# ----------------------------
# Reports
# ----------------------------
class ReportOut(BaseModel):
    id: int
    content: str
    is_anonymous: bool
    created_at: Optional[datetime] = None
    user: Optional[UserInfo] = None

# ----------------------------
# Grievances
# ----------------------------
class GrievanceCreate(BaseModel):
    title: str
    description: str
    is_anonymous: Optional[bool] = False

class GrievanceResponse(BaseModel):
    id: int
    title: str
    description: str
    status: str
    is_anonymous: bool
    created_at: Optional[datetime] = None
    user: Optional[UserInfo] = None
    reports: List[ReportOut] = []

    class Config:
        from_attributes = True

# ----------------------------
# Report create
# ----------------------------
class ReportCreate(BaseModel):
    grievance_id: int
    content: str
    is_anonymous: Optional[bool] = False

class ReportResponse(BaseModel):
    id: int
    grievance_id: int
    content: str
    is_anonymous: bool
    created_at: Optional[datetime] = None
    reporter_id: Optional[int] = None
    user: Optional[UserInfo] = None

    class Config:
        from_attributes = True

# ----------------------------
# Auth
# ----------------------------
class LoginRequest(BaseModel):
    email: str
    password: str

class Token(BaseModel):
    access_token: str
    token_type: str
