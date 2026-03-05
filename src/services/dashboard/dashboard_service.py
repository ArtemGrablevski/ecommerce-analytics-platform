from abc import ABC, abstractmethod

from src.dto.dashboard.metric_data import MetricData
from src.enums import MetricType
from src.repositories.clickhouse_repository import ClickHouseRepositoryInterface


class DashboardServiceInterface(ABC):
    @abstractmethod
    async def get_all_metrics(self, partner_id: str) -> dict[MetricType, MetricData]:
        ...


class DashboardService(DashboardServiceInterface):
    def __init__(self, clickhouse_repository: ClickHouseRepositoryInterface):
        self._clickhouse_repository = clickhouse_repository

    async def get_all_metrics(self, partner_id: str) -> dict[MetricType, MetricData]:
        results: dict[MetricType, MetricData] = {}

        for metric_type in MetricType:
            data = await self._clickhouse_repository.get_metric_data(metric_type, partner_id)
            results[metric_type] = data

        return results
