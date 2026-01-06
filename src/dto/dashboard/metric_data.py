from dataclasses import dataclass
from datetime import date


class MetricData:
    pass


@dataclass
class DauData(MetricData):
    value: int


@dataclass
class WauData(MetricData):
    value: int


@dataclass
class MauData(MetricData):
    value: int


@dataclass
class NewRegistrationsTodayData(MetricData):
    value: int


@dataclass
class DailyRevenueData(MetricData):
    value: float


@dataclass
class AverageOrderValueData(MetricData):
    value: float


@dataclass
class ArpuSevenDaysData(MetricData):
    value: float


@dataclass
class TotalTransactionsTodayData(MetricData):
    value: int


@dataclass
class RevenuePoint:
    date: date
    revenue: float


@dataclass
class RevenueTrendThirtyDaysData(MetricData):
    points: list[RevenuePoint]


@dataclass
class UserActivityPoint:
    date: date
    active_users: int


@dataclass
class UserActivityTrendThirtyDaysData(MetricData):
    points: list[UserActivityPoint]


@dataclass
class PageViewRow:
    page: str
    views: int


@dataclass
class TopPagesByViewsData(MetricData):
    rows: list[PageViewRow]


@dataclass
class CartAbandonmentRateData(MetricData):
    value: float


@dataclass
class SearchQueryRow:
    query: str
    search_count: int


@dataclass
class SearchQueriesData(MetricData):
    rows: list[SearchQueryRow]


@dataclass
class FunnelPoint:
    time: date
    page_views: int
    cart_additions: int
    searches: int


@dataclass
class UserJourneyFunnelData(MetricData):
    points: list[FunnelPoint]


@dataclass
class CurrencyVolumeRow:
    currency: str
    transactions: int
    total_amount: float


@dataclass
class TransactionVolumeByCurrencyData(MetricData):
    rows: list[CurrencyVolumeRow]


@dataclass
class ClickedElementRow:
    element_name: str
    clicks: int


@dataclass
class MostClickedElementsData(MetricData):
    rows: list[ClickedElementRow]


@dataclass
class RegistrationPoint:
    date: date
    registrations: int


@dataclass
class UserRegistrationTrendData(MetricData):
    points: list[RegistrationPoint]


@dataclass
class FilterUsageRow:
    filter_name: str
    filter_value: str
    usage_count: int


@dataclass
class FilterUsageData(MetricData):
    rows: list[FilterUsageRow]


@dataclass
class ConversionRateCartToPurchaseData(MetricData):
    value: float


@dataclass
class UserEngagementScoreData(MetricData):
    value: float


@dataclass
class MostActiveEventTypeData(MetricData):
    value: str


@dataclass
class TotalPageViewsData(MetricData):
    value: int


@dataclass
class ProductRow:
    product_id: str
    cart_additions: int
    unique_users: int


@dataclass
class TopPerformingProductsData(MetricData):
    rows: list[ProductRow]


@dataclass
class HourlyActivityRow:
    hour: int
    events: int


@dataclass
class ActivityByHourData(MetricData):
    rows: list[HourlyActivityRow]


@dataclass
class EventDistributionRow:
    event_type: str
    value: int


@dataclass
class EventTypeDistributionData(MetricData):
    rows: list[EventDistributionRow]


@dataclass
class ActivityPoint:
    time: date
    events: int


@dataclass
class DailyActivityTrendData(MetricData):
    points: list[ActivityPoint]
