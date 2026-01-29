from fastapi import Depends, HTTPException, status
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from sqlalchemy.orm import Session
from .database import get_db
from .routers.auth import decode_token
from .models import User

# ----------------------------
# Security schemes
# ----------------------------
bearer_scheme = HTTPBearer()  # Simple Bearer token for Swagger

# ----------------------------
# Get current user
# ----------------------------
def get_current_user(
    credentials: HTTPAuthorizationCredentials = Depends(bearer_scheme),
    db: Session = Depends(get_db)
):
    token = credentials.credentials  # JWT string
    try:
        payload = decode_token(token)
    except Exception:
        raise HTTPException(status_code=401, detail="Invalid token")

    # use 'sub' from JWT
    user_id = payload.get("sub")
    if not user_id:
        raise HTTPException(status_code=401, detail="Invalid token payload")

    user = db.get(User, int(user_id))  # convert to int for SQLAlchemy
    if not user:
        raise HTTPException(status_code=401, detail="User not found")

    return user


# ----------------------------
# Manager-only dependency
# ----------------------------
def manager_only(user=Depends(get_current_user)):
    """
    Only allows access if the user is a manager.
    Raises 403 Forbidden for non-manager users.
    """
    if user.role.lower() != "manager":
        raise HTTPException(status_code=403, detail="Manager access required")
    return user
