from pydantic import BaseModel
from typing import List, Optional

class UserBase(BaseModel):
    name: str
    email: str
    role: str

class UserCreate(UserBase):
    password: str

class UserResponse(UserBase):
    id: int

    class Config:
        from_attributes = True

# Grievances
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
    reporter_id: Optional[int]

    class Config:
        from_attributes = True

# Reports
class ReportCreate(BaseModel):
    grievance_id: int
    content: str
    is_anonymous: Optional[bool] = False

class ReportResponse(BaseModel):
    id: int
    grievance_id: int
    content: str
    is_anonymous: bool
    reporter_id: Optional[int]

    class Config:
        from_attributes = True

# Auth
class LoginRequest(BaseModel):
    email: str
    password: str

class Token(BaseModel):
    access_token: str
    token_type: str
