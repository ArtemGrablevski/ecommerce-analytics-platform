from dependency_injector.wiring import Provide, inject
from fastapi import APIRouter, Depends

from src.auth.dependencies import verify_jwt_token
from src.di import Container
from src.endpoints.models.dashboard.responses import DashboardResponse
from src.services.dashboard.dashboard_service import DashboardServiceInterface

router = APIRouter(prefix="/dashboard", tags=["dashboard"])


@router.get("", response_model=DashboardResponse)
@inject
async def get_dashboard_metrics(
    dashboard_service: DashboardServiceInterface = Depends(Provide[Container.dashboard_service]),
    partner_id: str = Depends(verify_jwt_token),
) -> DashboardResponse:
    metric_data = await dashboard_service.get_all_metrics(partner_id)
    return DashboardResponse(metrics=metric_data)
