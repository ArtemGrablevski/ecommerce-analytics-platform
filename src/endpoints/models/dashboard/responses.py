from pydantic import BaseModel, ConfigDict
from typing import Any

from src.enums import MetricType


class DashboardResponse(BaseModel):
    model_config = ConfigDict(arbitrary_types_allowed=True)
    
    metrics: dict[MetricType, Any]
