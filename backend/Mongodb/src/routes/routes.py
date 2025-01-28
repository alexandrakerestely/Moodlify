from typing import List

from bson import ObjectId
from fastapi import APIRouter, Body, Request, Response, HTTPException, status, requests, Depends
from fastapi.encoders import jsonable_encoder

from src.models.SubjectDetailsResponse import SubjectDetailsResponse
from src.models.SubjectDetailsRequest import SubjectDetailsRequest
from src.models.SubjectUpdate import SubjectUpdate
from fastapi.responses import JSONResponse
import re
from src.hateoas_utils import *
import requests

from src.security.GRPCServiceClient import GRPCServiceClient
from src.security.security_utils import check_token

router = APIRouter()

auth_client = GRPCServiceClient()

@router.post("", response_model=SubjectDetailsResponse, status_code=status.HTTP_201_CREATED)
async def create_subjects(request: Request, subject: SubjectDetailsRequest = Body(...), auth=Depends(check_token)):

    if sum([probe.percentage for probe in subject.evaluation_probes]) != 100:
        raise HTTPException(status_code=status.HTTP_422_UNPROCESSABLE_ENTITY, detail="Sum of evaluation probes should be 100%.")

    if (bool(re.search(r"\d+", subject.subject_code[:3])) or
            bool(re.match(r"^[A-Za-z]+$", subject.subject_code[3:6]))):
        raise HTTPException(status_code=status.HTTP_422_UNPROCESSABLE_ENTITY, detail="Incorrect formatting of subject code.")

    try:
        headers = {"Authorization": request.headers.get("Authorization")}
        subject_exists = requests.get(f"http://academia-service:8080/api/academia/subjects/{subject.subject_code}", headers=headers)
        if subject_exists.status_code == 404:
            raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Subject code does not exist in subjects database")
    except requests.exceptions.RequestException as e:
        raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail=f"Error: {str(e)}")

    if(request.app.database["subjects"].find_one(
        {"title": subject.title}
    )):
        raise HTTPException(status_code=status.HTTP_409_CONFLICT, detail="Subject with similar data already exists.")

    subject = jsonable_encoder(subject)
    new_subject = request.app.database["subjects"].insert_one(subject)
    created_subject = request.app.database["subjects"].find_one(
        {"_id": new_subject.inserted_id}
    )

    if created_subject:
        created_subject["_id"] = str(created_subject["_id"])
        created_subject["_links"] = generate_hateoas_links(created_subject["_id"],created_subject["subject_code"])

    return JSONResponse(status_code=status.HTTP_201_CREATED, content=created_subject)

@router.get("", response_model=List[SubjectDetailsResponse])
async def get_subjects(request: Request,  auth=Depends(check_token)):

    subjects = list(request.app.database["subjects"].find(limit=100))

    for subject in subjects:
        subject["_id"] = str(subject["_id"])
        subject["_links"] = generate_hateoas_links(subject["_id"], subject["subject_code"])

    return JSONResponse(status_code=status.HTTP_200_OK, content=subjects)

@router.get("/{id}", response_model=SubjectDetailsResponse, status_code=status.HTTP_200_OK)
async def get_subject(id: str, request: Request,  auth=Depends(check_token)):

    try:
        id = ObjectId(id)
    except Exception:
        raise HTTPException(status_code=status.HTTP_422_UNPROCESSABLE_ENTITY, detail="Invalid ID parameter format")

    if (subject := request.app.database["subjects"].find_one({"_id": id})) is not None:
        subject["_id"] = str(subject["_id"])
        subject["_links"] = generate_hateoas_links(subject["_id"], subject["subject_code"])
        return JSONResponse(status_code=status.HTTP_200_OK, content=subject)
    raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail=f"Subject with code {id} not found")

@router.delete("/{id}", status_code=status.HTTP_200_OK)
async def delete_subject(id: str, request: Request, auth=Depends(check_token)):

    try:
        id = ObjectId(id)
    except Exception:
        raise HTTPException(status_code=status.HTTP_422_UNPROCESSABLE_ENTITY, detail="Invalid ID parameter format")

    result = request.app.database["subjects"].find_one({"_id": id})
    delete_result = request.app.database["subjects"].delete_one({"_id": id})

    if delete_result.deleted_count == 1:
        return JSONResponse(status_code=status.HTTP_200_OK,
                            content={"status": "Subject successfully deleted",
                                     "_links": generate_hateoas_links_for_delete(str(id), result["subject_code"])})

    raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail=f"Subject with code {id} not found")


@router.put("/{id}", response_model=SubjectDetailsResponse, status_code=status.HTTP_200_OK)
def update_subject(id: str, request: Request, subject: SubjectUpdate = Body(...), auth=Depends(check_token)):

    if sum([probe.percentage for probe in subject.evaluation_probes]) != 100:
        raise HTTPException(status_code=status.HTTP_422_UNPROCESSABLE_ENTITY,
                            detail="Sum of evaluation probes should be 100%.")

    if (bool(re.search(r"\d+", subject.subject_code[:3])) or
            bool(re.match(r"^[A-Za-z]+$", subject.subject_code[3:6]))):
        raise HTTPException(status_code=status.HTTP_422_UNPROCESSABLE_ENTITY,
                            detail="Incorrect formatting of subject code.")

    try:
        id = ObjectId(id)
    except Exception:
        raise HTTPException(status_code=status.HTTP_422_UNPROCESSABLE_ENTITY, detail="Invalid ID parameter format")

    try:
        headers = {"Authorization": request.headers.get("Authorization")}
        subject_exists = requests.get(f"http://academia-service:8080/api/academia/subjects/{subject.subject_code}", headers=headers)
        if subject_exists.status_code == 404:
            raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Subject code does not exist in subjects database")
    except requests.exceptions.RequestException as e:
        raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail=f"Error: {str(e)}")


    subject = {k: v for k, v in subject.dict().items() if v is not None}
    if len(subject) >= 1:
        update_result = request.app.database["subjects"].update_one(
                {"_id": id}, {"$set": subject}
            )

        if update_result.modified_count == 0:
            raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail=f"Subjects with code {id} not found")

    if(
        existing_subject := request.app.database["subjects"].find_one({"_id": id})
    ) is not None:
        existing_subject["_id"] = str(existing_subject["_id"])
        existing_subject["_links"] = generate_hateoas_links(existing_subject["_id"], existing_subject["subject_code"])
        return JSONResponse(status_code=200, content=existing_subject)

    raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail=f"Subject with code {id} not found")

@router.get("/getByCode/{code}", status_code=status.HTTP_200_OK)
async def get_subject_code(code : str, request: Request, auth=Depends(check_token)):

    if (subject := request.app.database["subjects"].find_one({"subject_code": code})) is not None:
        subject["_id"] = str(subject["_id"])
        return JSONResponse(status_code=status.HTTP_200_OK,
                            content={"subject": subject, "_links": generate_hateoas_links(subject["_id"], subject["subject_code"])})

    raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail=f"Subject with code {id} not found")

