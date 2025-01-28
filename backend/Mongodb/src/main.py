from contextlib import asynccontextmanager

from fastapi import FastAPI
from pymongo import MongoClient
from fastapi.middleware.cors import CORSMiddleware

from src.routes.routes import router as subject_details_router
import os

@asynccontextmanager
async def lifespan(app: FastAPI):
    CONNECTION_STRING = "mongodb://subjects-manager:manager123@subjects-db:27017/subjects?authSource=subjects"
    app.mongodb_client =  MongoClient(CONNECTION_STRING)
    app.database = app.mongodb_client["subjects"]
    print(f'Connected to the MongoDB {app.database} database!')
    yield
    app.mongodb_client.close()

app = FastAPI(lifespan=lifespan)

origins = ["http://localhost:5173"]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allow_headers=["*"],
)

app.include_router(subject_details_router, tags=["subjects"], prefix="/subjects")