from pydantic import BaseModel

from src.enums import MetricType


class DashboardRequest(BaseModel):
    metrics: list[MetricType]
