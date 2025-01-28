from pydantic import BaseModel, Field


class FileMaterial(BaseModel):
    file : str = Field(...)
    week : int = Field(...)