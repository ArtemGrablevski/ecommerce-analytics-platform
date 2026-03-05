# План разработки мультитенантности

## Цель
Добавить систему партнеров: регистрация через Swagger с Bearer токеном, аутентификация по secret_key в event эндпоинтах, изоляция данных по partner_id в ClickHouse, frontend логин и показ только своей аналитики.

## Backend

1. **PostgreSQL + SQLAlchemy + Alembic**
   - asyncpg, sqlalchemy[asyncio], alembic
   - src/database.py - async engine 
   - src/config.py - DB настройки
   - alembic init

2. **Partner модель**
   - src/models/partner.py: id (UUID), name (unique), password_hash, secret_key (24 символа)
   - alembic revision --autogenerate
   - src/repositories/partner_repository.py

3. **Bearer токен авторизация**
   - ADMIN_BEARER_TOKEN в config
   - verify_admin_token() dependency

4. **Эндпоинты**
   - POST /partners (Bearer auth) → возвращает secret_key (создание партнера админом)
   - POST /partners/login → возвращает JWT
   - src/endpoints/partners.py

5. **ClickHouse модификация**
   - partner_id String во все Kafka Engine таблицы
   - partner_id в ORDER BY всех MergeTree таблиц
   - обновить Materialized Views

6. **Event система**
   - partner_id в все DTOs (src/dto/events.py)
   - verify_partner_secret_key() middleware
   - X-Partner-Secret заголовок в event эндпоинтах

7. **Dashboard фильтрация**
   - partner_id в ClickHouse запросы
   - JWT auth для GET /dashboard

## Frontend

8. **Login экран**
   - src/components/Login.tsx
   - name + password форма
   - POST /partners/login
   - сохранение JWT в localStorage

9. **Dashboard auth**
   - JWT в axios headers
   - redirect на /login если не авторизован
   - показ только данных партнера

## Docker

10. **PostgreSQL сервис**
   добавить все необходимое в docker-compose.yml
