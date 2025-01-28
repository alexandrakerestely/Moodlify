import uuid
from typing import Optional, List
from pydantic import BaseModel, Field

from src.models.EvaluationProbe import EvaluationProbe
from src.models.FileMaterial import FileMaterial

class SubjectDetailsResponse(BaseModel):
    id : str = Field(default_factory=uuid.uuid4, alias="_id")
    title : str = Field(...)
    subject_code : str = Field(...)
    evaluation_probes: List[EvaluationProbe]
    course_materials: Optional[List[FileMaterial]]
    lab_materials: Optional[List[FileMaterial]]
