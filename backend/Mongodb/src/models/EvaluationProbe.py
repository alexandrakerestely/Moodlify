from pydantic import BaseModel, Field

class EvaluationProbe(BaseModel):
    name: str = Field(...)
    percentage: int = Field(...)