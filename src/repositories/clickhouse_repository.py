from abc import ABC, abstractmethod

from src.dto.dashboard.metric_data import (
    ActivityByHourData,
    ActivityPoint,
    ArpuSevenDaysData,
    AverageOrderValueData,
    CartAbandonmentRateData,
    ClickedElementRow,
    ConversionRateCartToPurchaseData,
    CurrencyVolumeRow,
    DailyActivityTrendData,
    DailyRevenueData,
    DauData,
    EventDistributionRow,
    EventTypeDistributionData,
    FilterUsageData,
    FilterUsageRow,
    FunnelPoint,
    HourlyActivityRow,
    MauData,
    MetricData,
    MostActiveEventTypeData,
    MostClickedElementsData,
    NewRegistrationsTodayData,
    PageViewRow,
    ProductRow,
    RegistrationPoint,
    RevenuePoint,
    RevenueTrendThirtyDaysData,
    SearchQueriesData,
    SearchQueryRow,
    TopPagesByViewsData,
    TopPerformingProductsData,
    TotalPageViewsData,
    TotalTransactionsTodayData,
    TransactionVolumeByCurrencyData,
    UserActivityPoint,
    UserActivityTrendThirtyDaysData,
    UserEngagementScoreData,
    UserJourneyFunnelData,
    UserRegistrationTrendData,
    WauData,
)
from src.enums import MetricType


class ClickHouseRepositoryInterface(ABC):
    @abstractmethod
    async def get_metric_data(self, metric_type: MetricType) -> MetricData:
        pass


class ClickHouseRepository(ClickHouseRepositoryInterface):
    def __init__(self, connection):
        self._connection = connection

    async def get_metric_data(self, metric_type: MetricType) -> MetricData:
        query = self._get_query_for_metric(metric_type)

        async with self._connection.cursor() as cursor:
            await cursor.execute(query)
            result = await cursor.fetchall()

        return self._parse_metric_result(metric_type, result)

    def _parse_metric_result(
        self, metric_type: MetricType, rows: list[tuple]
    ) -> (
        DauData
        | WauData
        | MauData
        | NewRegistrationsTodayData
        | DailyRevenueData
        | AverageOrderValueData
        | ArpuSevenDaysData
        | TotalTransactionsTodayData
        | RevenueTrendThirtyDaysData
        | UserActivityTrendThirtyDaysData
        | TopPagesByViewsData
        | CartAbandonmentRateData
        | SearchQueriesData
        | UserJourneyFunnelData
        | TransactionVolumeByCurrencyData
        | MostClickedElementsData
        | UserRegistrationTrendData
        | FilterUsageData
        | ConversionRateCartToPurchaseData
        | UserEngagementScoreData
        | MostActiveEventTypeData
        | TotalPageViewsData
        | TopPerformingProductsData
        | ActivityByHourData
        | EventTypeDistributionData
        | DailyActivityTrendData
    ):
        match metric_type:
            case MetricType.DAU:
                value = rows[0][0] if rows else 0
                return DauData(value=value)

            case MetricType.WAU:
                value = rows[0][0] if rows else 0
                return WauData(value=value)

            case MetricType.MAU:
                value = rows[0][0] if rows else 0
                return MauData(value=value)

            case MetricType.NEW_REGISTRATIONS_TODAY:
                value = rows[0][0] if rows else 0
                return NewRegistrationsTodayData(value=value)

            case MetricType.DAILY_REVENUE:
                value = rows[0][0] if rows else 0.0
                return DailyRevenueData(value=value)

            case MetricType.AVERAGE_ORDER_VALUE:
                value = rows[0][0] if rows else 0.0
                return AverageOrderValueData(value=value)

            case MetricType.ARPU_7_DAYS:
                value = rows[0][0] if rows else 0.0
                return ArpuSevenDaysData(value=value)

            case MetricType.TOTAL_TRANSACTIONS_TODAY:
                value = rows[0][0] if rows else 0
                return TotalTransactionsTodayData(value=value)

            case MetricType.CART_ABANDONMENT_RATE:
                value = rows[0][0] if rows else 0.0
                return CartAbandonmentRateData(value=value)

            case MetricType.CONVERSION_RATE_CART_TO_PURCHASE:
                value = rows[0][0] if rows else 0.0
                return ConversionRateCartToPurchaseData(value=value)

            case MetricType.USER_ENGAGEMENT_SCORE:
                value = rows[0][0] if rows else 0.0
                return UserEngagementScoreData(value=value)

            case MetricType.MOST_ACTIVE_EVENT_TYPE:
                value = rows[0][0] if rows else ""
                return MostActiveEventTypeData(value=value)

            case MetricType.TOTAL_PAGE_VIEWS:
                value = rows[0][0] if rows else 0
                return TotalPageViewsData(value=value)

            case MetricType.REVENUE_TREND_30_DAYS:
                points = [RevenuePoint(date=row[0], revenue=row[1]) for row in rows]
                return RevenueTrendThirtyDaysData(points=points)

            case MetricType.USER_ACTIVITY_TREND_30_DAYS:
                points = [UserActivityPoint(date=row[0], active_users=row[1]) for row in rows]
                return UserActivityTrendThirtyDaysData(points=points)

            case MetricType.USER_REGISTRATION_TREND:
                points = [RegistrationPoint(date=row[0], registrations=row[1]) for row in rows]
                return UserRegistrationTrendData(points=points)

            case MetricType.DAILY_ACTIVITY_TREND:
                points = [ActivityPoint(time=row[0], events=row[1]) for row in rows]
                return DailyActivityTrendData(points=points)

            case MetricType.TOP_PAGES_BY_VIEWS:
                page_rows = [PageViewRow(page=row[0], views=row[1]) for row in rows]
                return TopPagesByViewsData(rows=page_rows)

            case MetricType.SEARCH_QUERIES:
                search_rows = [SearchQueryRow(query=row[0], search_count=row[1]) for row in rows]
                return SearchQueriesData(rows=search_rows)

            case MetricType.MOST_CLICKED_ELEMENTS:
                element_rows = [ClickedElementRow(element_name=row[0], clicks=row[1]) for row in rows]
                return MostClickedElementsData(rows=element_rows)

            case MetricType.FILTER_USAGE:
                filter_rows = [
                    FilterUsageRow(filter_name=row[0], filter_value=row[1], usage_count=row[2]) for row in rows
                ]
                return FilterUsageData(rows=filter_rows)

            case MetricType.TOP_PERFORMING_PRODUCTS:
                product_rows = [
                    ProductRow(product_id=row[0], cart_additions=row[1], unique_users=row[2]) for row in rows
                ]
                return TopPerformingProductsData(rows=product_rows)

            case MetricType.ACTIVITY_BY_HOUR:
                activity_rows = [HourlyActivityRow(hour=row[0], events=row[1]) for row in rows]
                return ActivityByHourData(rows=activity_rows)

            case MetricType.EVENT_TYPE_DISTRIBUTION:
                event_rows = [EventDistributionRow(event_type=row[0], value=row[1]) for row in rows]
                return EventTypeDistributionData(rows=event_rows)

            case MetricType.USER_JOURNEY_FUNNEL:
                funnel_points = [
                    FunnelPoint(time=row[0], page_views=row[1] or 0, cart_additions=row[2] or 0, searches=row[3] or 0)
                    for row in rows
                ]
                return UserJourneyFunnelData(points=funnel_points)

            case MetricType.TRANSACTION_VOLUME_BY_CURRENCY:
                currency_rows = [
                    CurrencyVolumeRow(currency=row[0], transactions=row[1], total_amount=row[2]) for row in rows
                ]
                return TransactionVolumeByCurrencyData(rows=currency_rows)

            case _:
                raise ValueError

    def _get_query_for_metric(self, metric_type: MetricType) -> str:
        queries = {
            MetricType.DAU: """
                SELECT uniq(user_id)
                FROM user_events_storage
                WHERE toDate(timestamp) = today() AND event_type = 'user_login'
            """,
            MetricType.WAU: """
                SELECT uniq(user_id)
                FROM user_events_storage
                WHERE timestamp >= now() - INTERVAL 7 DAY AND event_type = 'user_login'
            """,
            MetricType.MAU: """
                SELECT uniq(user_id)
                FROM user_events_storage
                WHERE timestamp >= now() - INTERVAL 30 DAY AND event_type = 'user_login'
            """,
            MetricType.NEW_REGISTRATIONS_TODAY: """
                SELECT count()
                FROM user_events_storage
                WHERE toDate(timestamp) = today() AND event_type = 'user_registered'
            """,
            MetricType.DAILY_REVENUE: """
                SELECT sum(amount)
                FROM transaction_events_storage
                WHERE toDate(timestamp) = today()
            """,
            MetricType.AVERAGE_ORDER_VALUE: """
                SELECT CASE WHEN count() > 0 THEN avg(amount) ELSE 0 END
                FROM transaction_events_storage
                WHERE timestamp >= now() - INTERVAL 7 DAY
            """,
            MetricType.ARPU_7_DAYS: """
                SELECT CASE WHEN uniq(user_id) > 0 THEN sum(amount) / uniq(user_id) ELSE 0 END
                FROM transaction_events_storage
                WHERE timestamp >= now() - INTERVAL 7 DAY
            """,
            MetricType.TOTAL_TRANSACTIONS_TODAY: """
                SELECT count()
                FROM transaction_events_storage
                WHERE toDate(timestamp) = today()
            """,
            MetricType.REVENUE_TREND_30_DAYS: """
                SELECT toDate(timestamp), sum(amount)
                FROM transaction_events_storage
                WHERE timestamp >= now() - INTERVAL 30 DAY
                GROUP BY toDate(timestamp) ORDER BY toDate(timestamp)
            """,
            MetricType.USER_ACTIVITY_TREND_30_DAYS: """
                SELECT toDate(timestamp), uniq(user_id)
                FROM user_events_storage
                WHERE timestamp >= now() - INTERVAL 30 DAY AND event_type = 'user_login'
                GROUP BY toDate(timestamp) ORDER BY toDate(timestamp)
            """,
            MetricType.TOP_PAGES_BY_VIEWS: """
                SELECT page, count()
                FROM interaction_events_storage
                WHERE event_type = 'page_view' AND timestamp >= now() - INTERVAL 7 DAY
                AND page IS NOT NULL
                GROUP BY page ORDER BY count() DESC LIMIT 10
            """,
            MetricType.CART_ABANDONMENT_RATE: """
                WITH
                    cart_users AS (SELECT uniq(user_id) as users FROM interaction_events_storage WHERE event_type = 'item_added_to_cart' AND timestamp >= now() - INTERVAL 7 DAY),
                    purchase_users AS (SELECT uniq(user_id) as users FROM transaction_events_storage WHERE timestamp >= now() - INTERVAL 7 DAY)
                SELECT CASE WHEN cart_users.users > 0 THEN round((1 - purchase_users.users / cart_users.users) * 100, 2) ELSE 0 END
                FROM cart_users, purchase_users
            """,
            MetricType.SEARCH_QUERIES: """
                SELECT query, count()
                FROM interaction_events_storage
                WHERE event_type = 'search' AND timestamp >= now() - INTERVAL 7 DAY
                AND query IS NOT NULL
                GROUP BY query ORDER BY count() DESC LIMIT 10
            """,
            MetricType.USER_JOURNEY_FUNNEL: """
                SELECT toDate(timestamp),
                       uniq(case when event_type = 'page_view' then user_id end),
                       uniq(case when event_type = 'item_added_to_cart' then user_id end),
                       uniq(case when event_type = 'search' then user_id end)
                FROM interaction_events_storage
                WHERE timestamp >= now() - INTERVAL 7 DAY
                GROUP BY toDate(timestamp) ORDER BY toDate(timestamp)
            """,
            MetricType.TRANSACTION_VOLUME_BY_CURRENCY: """
                SELECT currency, count(), sum(amount)
                FROM transaction_events_storage
                WHERE timestamp >= now() - INTERVAL 7 DAY
                GROUP BY currency ORDER BY count() DESC
            """,
            MetricType.MOST_CLICKED_ELEMENTS: """
                SELECT element_name, count()
                FROM interaction_events_storage
                WHERE event_type = 'element_click' AND timestamp >= now() - INTERVAL 7 DAY
                AND element_name IS NOT NULL
                GROUP BY element_name ORDER BY count() DESC LIMIT 10
            """,
            MetricType.USER_REGISTRATION_TREND: """
                SELECT toDate(timestamp), count()
                FROM user_events_storage
                WHERE event_type = 'user_registered' AND timestamp >= now() - INTERVAL 30 DAY
                GROUP BY toDate(timestamp) ORDER BY toDate(timestamp)
            """,
            MetricType.FILTER_USAGE: """
                SELECT filter_name, filter_value, count()
                FROM interaction_events_storage
                WHERE event_type = 'filter_applied' AND timestamp >= now() - INTERVAL 7 DAY
                AND filter_name IS NOT NULL
                GROUP BY filter_name, filter_value ORDER BY count() DESC LIMIT 15
            """,
            MetricType.CONVERSION_RATE_CART_TO_PURCHASE: """
                WITH
                    transactions_count AS (SELECT count() as cnt FROM transaction_events_storage WHERE timestamp >= now() - INTERVAL 7 DAY),
                    cart_users_count AS (SELECT uniq(user_id) as cnt FROM interaction_events_storage WHERE event_type = 'item_added_to_cart' AND timestamp >= now() - INTERVAL 7 DAY)
                SELECT CASE WHEN cart_users_count.cnt > 0 THEN round(transactions_count.cnt * 100.0 / cart_users_count.cnt, 2) ELSE 0 END
                FROM transactions_count, cart_users_count
            """,
            MetricType.USER_ENGAGEMENT_SCORE: """
                SELECT CASE WHEN uniq(user_id) > 0 THEN round(count() * 1.0 / uniq(user_id), 2) ELSE 0 END
                FROM interaction_events_storage
                WHERE timestamp >= now() - INTERVAL 7 DAY
            """,
            MetricType.MOST_ACTIVE_EVENT_TYPE: """
                SELECT event_type
                FROM interaction_events_storage
                WHERE timestamp >= now() - INTERVAL 7 DAY
                GROUP BY event_type ORDER BY count() DESC LIMIT 1
            """,
            MetricType.TOTAL_PAGE_VIEWS: """
                SELECT count()
                FROM interaction_events_storage
                WHERE event_type = 'page_view' AND timestamp >= now() - INTERVAL 7 DAY
            """,
            MetricType.TOP_PERFORMING_PRODUCTS: """
                SELECT item_id, count(), uniq(user_id)
                FROM interaction_events_storage
                WHERE event_type = 'item_added_to_cart' AND timestamp >= now() - INTERVAL 7 DAY
                GROUP BY item_id ORDER BY count() DESC LIMIT 10
            """,
            MetricType.ACTIVITY_BY_HOUR: """
                SELECT toHour(timestamp), count()
                FROM interaction_events_storage
                WHERE timestamp >= now() - INTERVAL 7 DAY
                GROUP BY toHour(timestamp) ORDER BY toHour(timestamp)
            """,
            MetricType.EVENT_TYPE_DISTRIBUTION: """
                SELECT event_type, count()
                FROM interaction_events_storage
                WHERE timestamp >= now() - INTERVAL 7 DAY
                GROUP BY event_type ORDER BY count() DESC
            """,
            MetricType.DAILY_ACTIVITY_TREND: """
                SELECT toDate(timestamp), count()
                FROM interaction_events_storage
                WHERE timestamp >= now() - INTERVAL 7 DAY
                GROUP BY toDate(timestamp) ORDER BY toDate(timestamp)
            """
        }
        return queries[metric_type]
