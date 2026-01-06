# Аналитическая платформа - Контекст проекта

## Архитектура
**Поток данных:** `Событие -> FastAPI Backend -> Kafka -> ClickHouse -> React Dashboard`

**Компоненты:**
- FastAPI Backend (Python 3.13 + asyncio)
- Apache Kafka (очереди событий)  
- ClickHouse (аналитическая БД)
- React Frontend (заменил Grafana)
- Docker Compose

## Структура кода

### Backend (src/)
```
src/
├── config.py
├── enums.py - EventType, KafkaTopic, MetricType (26 метрик)
├── di.py - DI контейнер
├── main.py - FastAPI app с lifespan
├── endpoints/
│   ├── events.py
│   ├── dashboard.py - GET /dashboard без параметров
│   └── models/dashboard/ - Pydantic модели
├── services/
│   ├── event_service.py
│   ├── kafka_producer.py, kafka_admin.py
│   └── dashboard/dashboard_service.py
├── dto/dashboard/metric_data.py - MetricData base class + специфичные dataclass для каждой метрики
└── repositories/clickhouse_repository.py - async с asynch
```

### Frontend (frontend/)
```
frontend/src/
├── types/metrics.ts
├── services/api.ts - GET запрос без параметров
├── components/
│   ├── MetricCard.tsx
│   ├── ChartCard.tsx - line/bar/multiLine
│   ├── DataTable.tsx - @mui/x-data-grid
│   ├── PieChartCard.tsx
│   └── ComprehensiveDashboard.tsx
└── App.tsx - Material-UI
```

## Kafka топики
- `user_events` - регистрация, авторизация
- `transaction_events` - финансовые транзакции
- `interaction_events` - клики, поиск, просмотры, корзина

## ClickHouse схема
Каждый топик: Kafka Engine таблица → Materialized View → MergeTree Storage
- `user_events_storage`
- `transaction_events_storage` 
- `interaction_events_storage`

## Метрики (26 штук)

**Enum MetricType в src/enums.py:**
```python
DAU, WAU, MAU, NEW_REGISTRATIONS_TODAY, DAILY_REVENUE, AVERAGE_ORDER_VALUE,
ARPU_7_DAYS, TOTAL_TRANSACTIONS_TODAY, REVENUE_TREND_30_DAYS,
USER_ACTIVITY_TREND_30_DAYS, TOP_PAGES_BY_VIEWS, CART_ABANDONMENT_RATE,
SEARCH_QUERIES, USER_JOURNEY_FUNNEL, TRANSACTION_VOLUME_BY_CURRENCY,
MOST_CLICKED_ELEMENTS, USER_REGISTRATION_TREND, FILTER_USAGE,
CONVERSION_RATE_CART_TO_PURCHASE, USER_ENGAGEMENT_SCORE,
MOST_ACTIVE_EVENT_TYPE, TOTAL_PAGE_VIEWS, TOP_PERFORMING_PRODUCTS,
ACTIVITY_BY_HOUR, EVENT_TYPE_DISTRIBUTION, DAILY_ACTIVITY_TREND
```

**Специфичные dataclass в src/dto/dashboard/metric_data.py:**
- `MetricData(ABC)` - базовый класс для всех метрик
- `DauData(value: int)`, `WauData(value: int)`, `MauData(value: int)`
- `RevenueTrendThirtyDaysData(points: list[RevenuePoint])`
- `TopPagesByViewsData(rows: list[PageViewRow])`
- И т.д. для каждой метрики (все наследуются от MetricData)

## API

### Dashboard
- `GET /dashboard` - возвращает все 26 метрик
- Формат ответа: `{MetricType: MetricData, ...}` для каждой метрики

### Events  
- `POST /events` - отправка событий

## Технологии

### Backend
- fastapi==0.104.1, uvicorn, pydantic==2.5.2
- aiokafka==0.10.0, kafka-python==2.0.2  
- **asynch==0.2.3** - async ClickHouse клиент
- dependency-injector==4.41.0

### Frontend
- React 18 + TypeScript
- Material-UI + @mui/x-data-grid
- Recharts для графиков
- axios для HTTP

### Инфраструктура
- ClickHouse 23.8, Kafka 7.4.0 + Zookeeper
- Docker Compose

## Требования к коду
- ❌ Никаких комментариев/docstrings
- ✅ Type hints (современные: list[T], dict[K,V], A | B), избегать Any, использовать object
- ✅ Избегать глобальных переменных  
- ✅ DI для тестируемости
- ✅ Слоистая архитектура
- ✅ match-case вместо длинных if-elif цепочек

## ClickHouse запросы
- Temporal: `toDate()`, `toHour()`, `today()`, `INTERVAL N DAY`
- Агрегации: `uniq()`, `count()`, `sum()`, `avg()`
- CTE для сложных метрик
- Async выполнение через asynch

## Async архитектура
```python
# Repository
async def get_metric_data(self, metric_type: MetricType) -> MetricData
    connection = await self._get_connection()
    async with connection.cursor() as cursor:
        await cursor.execute(query)
        result = await cursor.fetchall()

# Service  
async def get_all_metrics(self) -> dict[MetricType, MetricData]

# Endpoint
async def get_dashboard_metrics() -> DashboardResponse
```

## Docker services
- **app** (порт 8000) - FastAPI backend
- **frontend** (порт 3000) - React app  
- **clickhouse** (8123, 9001) - аналитическая БД
- **kafka + zookeeper** (9092) - брокер сообщений
- **clickhouse-migrate** - init схемы