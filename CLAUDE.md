# Аналитическая платформа

Платформа для сбора, обработки и визуализации пользовательских событий в реальном времени.

## Архитектура

**Поток данных:** `Событие -> FastAPI Backend -> Kafka -> ClickHouse -> React Dashboard`

**Компоненты:**
- FastAPI Backend (Python 3.13 + asyncio)
- Apache Kafka (очереди событий)
- ClickHouse (аналитическая БД)
- React Frontend (React + TypeScript + Material-UI)
- Docker Compose (развертывание)

## Структура проекта

```
src/
├── config.py - настройки приложения
├── enums.py - EventType, KafkaTopic, MetricType
├── di.py - DI контейнер (dependency-injector)
├── main.py - FastAPI app с lifespan
├── endpoints/
│   ├── events.py - 10 эндпоинтов для отправки событий
│   └── dashboard.py - GET /dashboard (все 26 метрик)
├── services/
│   ├── event_service.py - обработка событий
│   ├── kafka_producer.py, kafka_admin.py
│   └── dashboard/dashboard_service.py
├── dto/
│   ├── events.py - DTO для событий
│   └── dashboard/metric_data.py - MetricData + 26 dataclass
└── repositories/
    └── clickhouse_repository.py - async через asynch
```

## API Эндпоинты

### События (POST /events/)
- `/user-registered` - регистрация пользователя
- `/user-login` - авторизация пользователя
- `/transaction` - финансовая транзакция
- `/element-click` - клик по элементу
- `/search` - поисковый запрос
- `/page-view` - просмотр страницы
- `/form-submit` - отправка формы
- `/item-added-to-cart` - добавление в корзину
- `/item-removed-from-cart` - удаление из корзины
- `/filter-applied` - применение фильтра

### Дашборд
- `GET /dashboard` - возвращает все 26 метрик в формате `{MetricType: MetricData}`

## Kafka Топики

- `user_events` - события пользователей (регистрация, авторизация)
- `transaction_events` - финансовые транзакции
- `interaction_events` - взаимодействия (клики, поиск, просмотры, корзина, фильтры)

## ClickHouse Схема

**Архитектура:** События из Kafka попадают **напрямую в ClickHouse** без консьюмера. 

**Поток:** Kafka Engine таблица → Materialized View → MergeTree Storage

### Структура БД (scripts/setup-clickhouse.sh)

**1. Kafka Engine таблицы (получение данных из Kafka):**
```sql
-- user_events: event_type, user_id, timestamp
ENGINE = Kafka, kafka_topic_list = 'user_events'

-- transaction_events: event_type, user_id, transaction_id, amount, currency, timestamp  
ENGINE = Kafka, kafka_topic_list = 'transaction_events'

-- interaction_events: event_type, user_id, element_name, page, query, form_name, item_id, filter_name, filter_value, timestamp
ENGINE = Kafka, kafka_topic_list = 'interaction_events'
```

**2. MergeTree таблицы (хранение данных):**
- `user_events_storage` - ORDER BY (timestamp, user_id)
- `transaction_events_storage` - ORDER BY (timestamp, user_id)  
- `interaction_events_storage` - ORDER BY (timestamp, user_id, event_type)

**3. Materialized Views (автоматическая передача данных):**
- `user_events_consumer` - parseDateTimeBestEffort(timestamp) из String → DateTime64(3)
- `transaction_events_consumer` - преобразование + передача в storage
- `interaction_events_consumer` - обработка всех interaction полей

**Поля по типам событий:**
- **user_events:** event_type, user_id, timestamp
- **transaction_events:** + transaction_id, amount (Decimal64), currency  
- **interaction_events:** + element_name, page, query, form_name, item_id, filter_name, filter_value (все Nullable)

## Метрики (26 штук)

**Типы метрик (src/enums.py MetricType):**
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

**MetricData классы (src/dto/dashboard/metric_data.py):**
- `MetricData(ABC)` - базовый абстрактный класс
- Простые метрики: `DauData(value: int)`, `WauData(value: int)`, `DailyRevenueData(value: float)`
- Тренды: `RevenueTrendThirtyDaysData(points: list[RevenuePoint])`
- Таблицы: `TopPagesByViewsData(rows: list[PageViewRow])`
- Воронки: `UserJourneyFunnelData(points: list[FunnelPoint])`

Все классы наследуются от MetricData и используются в ClickHouseRepository._parse_metric_result().

## Основные классы и сервисы

### EventService (src/services/event_service.py)
- `process_event(event: BaseEvent)` - обработка событий через match-case
- Отправляет события в соответствующий Kafka топик

### ClickHouseRepository (src/repositories/clickhouse_repository.py)
- `get_metric_data(metric_type: MetricType) -> MetricData` - получение метрики
- `_get_query_for_metric()` - SQL запросы для каждой метрики
- `_parse_metric_result()` - парсинг результатов в MetricData классы

### DashboardService (src/services/dashboard/dashboard_service.py)
- `get_all_metrics() -> dict[MetricType, MetricData]` - получение всех метрик

### Container (src/di.py)
- DI контейнер с Singleton и Factory провайдерами
- Управляет зависимостями: kafka_producer, clickhouse_repository, event_service, dashboard_service

## Технологии

### Backend
- fastapi==0.104.1, uvicorn, pydantic==2.5.2
- aiokafka==0.10.0, kafka-python==2.0.2
- asynch==0.2.3 - async ClickHouse клиент
- dependency-injector==4.41.0

### Frontend
- React 18 + TypeScript
- Material-UI + @mui/x-data-grid
- Recharts для графиков
- axios для HTTP

### Инфраструктура
- ClickHouse 23.8, Kafka 7.4.0 + Zookeeper
- PostgreSQL 16 (партнеры и аутентификация)
- Docker Compose (app:8000, frontend:3000, clickhouse:8123,9000, kafka:9092, postgres:5432)

## Требования к коду

- ❌ Никаких комментариев и docstrings
- ✅ Type hints: современные (list[T], dict[K,V], A | B), избегать Any
- ✅ Избегать глобальных переменных
- ✅ Dependency Injection для тестируемости
- ✅ Слоистая архитектура: endpoints -> services -> repositories
- ✅ match-case вместо длинных if-elif
- ✅ Async/await в Python

## Мультитенантность

Платформа поддерживает изоляцию данных по партнерам через систему аутентификации.

### Партнеры и аутентификация
- PostgreSQL для хранения партнеров (Partner модель)
- JWT токены для фронтенда (срок действия 30 минут)
- Secret keys для API событий
- Bcrypt хэширование паролей

### API эндпоинты партнеров
- `POST /partners` - создание партнера (admin token required)
- `POST /partners/login` - авторизация партнера

### Аутентификация событий
- Все `/events/*` требуют заголовок `X-Partner-Secret`
- События автоматически привязываются к партнеру

### Аутентификация дашборда  
- `GET /dashboard` требует JWT Bearer токен
- Возвращает метрики только для авторизованного партнера

### ClickHouse изоляция данных
- Все таблицы содержат поле `partner_id`
- SQL запросы фильтруют по `partner_id`

### Frontend
- React компонент авторизации партнеров
- JWT токен в localStorage
- Автоматическое добавление Bearer токена в запросы

### Флоу взаимодействия
```
1. Партнер авторизуется: POST /partners/login → получает JWT
2. Frontend сохраняет JWT → добавляет в заголовки запросов
3. Dashboard запросы фильтруются по partner_id из JWT
4. API события требуют X-Partner-Secret заголовок
5. События привязываются к партнеру автоматически
```
