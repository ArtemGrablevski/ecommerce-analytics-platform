from enum import Enum


class KafkaTopic(str, Enum):
    USER_EVENTS = "user_events"
    TRANSACTION_EVENTS = "transaction_events"
    INTERACTION_EVENTS = "interaction_events"


class EventType(str, Enum):
    USER_REGISTERED = "user_registered"
    USER_LOGIN = "user_login"
    TRANSACTION = "transaction"
    ELEMENT_CLICK = "element_click"
    SEARCH = "search"
    PAGE_VIEW = "page_view"
    FORM_SUBMIT = "form_submit"
    ITEM_ADDED_TO_CART = "item_added_to_cart"
    ITEM_REMOVED_FROM_CART = "item_removed_from_cart"
    FILTER_APPLIED = "filter_applied"


class MetricType(str, Enum):
    DAU = "daily_active_users"
    WAU = "weekly_active_users"
    MAU = "monthly_active_users"
    NEW_REGISTRATIONS_TODAY = "new_registrations_today"
    DAILY_REVENUE = "daily_revenue"
    AVERAGE_ORDER_VALUE = "average_order_value"
    ARPU_7_DAYS = "arpu_7_days"
    TOTAL_TRANSACTIONS_TODAY = "total_transactions_today"
    REVENUE_TREND_30_DAYS = "revenue_trend_30_days"
    USER_ACTIVITY_TREND_30_DAYS = "user_activity_trend_30_days"
    TOP_PAGES_BY_VIEWS = "top_pages_by_views"
    CART_ABANDONMENT_RATE = "cart_abandonment_rate"
    SEARCH_QUERIES = "search_queries"
    USER_JOURNEY_FUNNEL = "user_journey_funnel"
    TRANSACTION_VOLUME_BY_CURRENCY = "transaction_volume_by_currency"
    MOST_CLICKED_ELEMENTS = "most_clicked_elements"
    USER_REGISTRATION_TREND = "user_registration_trend"
    FILTER_USAGE = "filter_usage"
    CONVERSION_RATE_CART_TO_PURCHASE = "conversion_rate_cart_to_purchase"
    USER_ENGAGEMENT_SCORE = "user_engagement_score"
    MOST_ACTIVE_EVENT_TYPE = "most_active_event_type"
    TOTAL_PAGE_VIEWS = "total_page_views"
    TOP_PERFORMING_PRODUCTS = "top_performing_products"
    ACTIVITY_BY_HOUR = "activity_by_hour"
    EVENT_TYPE_DISTRIBUTION = "event_type_distribution"
    DAILY_ACTIVITY_TREND = "daily_activity_trend"
