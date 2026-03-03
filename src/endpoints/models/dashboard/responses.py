from typing import Any

from pydantic import BaseModel, ConfigDict

from src.enums import MetricType


class DashboardResponse(BaseModel):
    model_config = ConfigDict(arbitrary_types_allowed=True)

    metrics: dict[MetricType, Any]
