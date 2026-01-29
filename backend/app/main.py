from fastapi.middleware.cors import CORSMiddleware
from fastapi import FastAPI
from .routers import auth, grievances, reports

app = FastAPI()

# CORS setup
origins = [
    "http://localhost:3000",  # React dev server
    "http://127.0.0.1:3000",
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],      # allow all HTTP methods (GET, POST, OPTIONS...)
    allow_headers=["*"],
)

# Include routers
app.include_router(auth.router)
app.include_router(grievances.router)
app.include_router(reports.router)
