from sqlalchemy import Column, Integer, String, Boolean, ForeignKey, DateTime
from sqlalchemy.orm import relationship
from datetime import datetime
from .database import Base

class User(Base):
    __tablename__ = "users"
    id = Column(Integer, primary_key=True)
    name = Column(String)
    email = Column(String, unique=True)
    password_hash = Column(String)
    role = Column(String)

    # backrefs
    grievances = relationship("Grievance", back_populates="reporter")
    reports = relationship("Report", back_populates="reporter")


class Grievance(Base):
    __tablename__ = "grievances"
    id = Column(Integer, primary_key=True)
    title = Column(String)
    description = Column(String)
    status = Column(String, default="open")
    reporter_id = Column(Integer, ForeignKey("users.id"), nullable=True)
    is_anonymous = Column(Boolean, default=False)
    created_at = Column(DateTime, default=datetime.utcnow)

    reporter = relationship("User", back_populates="grievances")  # <-- must match back_populates
    reports = relationship("Report", back_populates="grievance")


class Report(Base):
    __tablename__ = "reports"
    id = Column(Integer, primary_key=True)
    grievance_id = Column(Integer, ForeignKey("grievances.id"))
    content = Column(String)
    reporter_id = Column(Integer, ForeignKey("users.id"), nullable=True)
    is_anonymous = Column(Boolean, default=False)
    created_at = Column(DateTime, default=datetime.utcnow)

    grievance = relationship("Grievance", back_populates="reports")
    reporter = relationship("User", back_populates="reports")
