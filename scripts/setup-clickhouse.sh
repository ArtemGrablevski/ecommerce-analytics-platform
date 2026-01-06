#!/bin/bash

CLICKHOUSE_URL="http://clickhouse:8123"

echo "Waiting for ClickHouse to be ready..."
until curl -s -f "$CLICKHOUSE_URL/ping" >/dev/null 2>&1; do
    echo "ClickHouse not ready, waiting..."
    sleep 1
done
echo "ClickHouse is ready!"

echo "Creating database and tables..."

curl -X POST "$CLICKHOUSE_URL" -d "CREATE DATABASE IF NOT EXISTS analytics"

echo "Creating Kafka Engine tables..."

curl -X POST "$CLICKHOUSE_URL"  -d "
CREATE TABLE IF NOT EXISTS analytics.user_events (
    event_type String,
    user_id String,
    timestamp String
) ENGINE = Kafka
SETTINGS
    kafka_broker_list = 'kafka:9092',
    kafka_topic_list = 'user_events',
    kafka_group_name = 'clickhouse_user_consumer',
    kafka_format = 'JSONEachRow',
    kafka_num_consumers = 1"

curl -X POST "$CLICKHOUSE_URL"  -d "
CREATE TABLE IF NOT EXISTS analytics.transaction_events (
    event_type String,
    user_id String,
    transaction_id String,
    amount Decimal64(2),
    currency String,
    timestamp String
) ENGINE = Kafka
SETTINGS
    kafka_broker_list = 'kafka:9092',
    kafka_topic_list = 'transaction_events',
    kafka_group_name = 'clickhouse_transaction_consumer',
    kafka_format = 'JSONEachRow',
    kafka_num_consumers = 1"

curl -X POST "$CLICKHOUSE_URL"  -d "
CREATE TABLE IF NOT EXISTS analytics.interaction_events (
    event_type String,
    user_id String,
    element_name Nullable(String),
    page Nullable(String),
    query Nullable(String),
    form_name Nullable(String),
    item_id Nullable(String),
    filter_name Nullable(String),
    filter_value Nullable(String),
    timestamp String
) ENGINE = Kafka
SETTINGS
    kafka_broker_list = 'kafka:9092',
    kafka_topic_list = 'interaction_events',
    kafka_group_name = 'clickhouse_interaction_consumer',
    kafka_format = 'JSONEachRow',
    kafka_num_consumers = 1"

echo "Creating MergeTree storage tables..."

curl -X POST "$CLICKHOUSE_URL"  -d "
CREATE TABLE IF NOT EXISTS analytics.user_events_storage (
    event_type String,
    user_id String,
    timestamp DateTime64(3)
) ENGINE = MergeTree()
ORDER BY (timestamp, user_id)"

curl -X POST "$CLICKHOUSE_URL"  -d "
CREATE TABLE IF NOT EXISTS analytics.transaction_events_storage (
    event_type String,
    user_id String,
    transaction_id String,
    amount Decimal64(2),
    currency String,
    timestamp DateTime64(3)
) ENGINE = MergeTree()
ORDER BY (timestamp, user_id)"

curl -X POST "$CLICKHOUSE_URL"  -d "
CREATE TABLE IF NOT EXISTS analytics.interaction_events_storage (
    event_type String,
    user_id String,
    element_name Nullable(String),
    page Nullable(String),
    query Nullable(String),
    form_name Nullable(String),
    item_id Nullable(String),
    filter_name Nullable(String),
    filter_value Nullable(String),
    timestamp DateTime64(3)
) ENGINE = MergeTree()
ORDER BY (timestamp, user_id, event_type)"

echo "Creating materialized views from Kafka to Storage tables..."

curl -X POST "$CLICKHOUSE_URL"  -d "
CREATE MATERIALIZED VIEW IF NOT EXISTS analytics.user_events_consumer TO analytics.user_events_storage AS
SELECT event_type, user_id, parseDateTimeBestEffort(timestamp) as timestamp FROM analytics.user_events"

curl -X POST "$CLICKHOUSE_URL"  -d "
CREATE MATERIALIZED VIEW IF NOT EXISTS analytics.transaction_events_consumer TO analytics.transaction_events_storage AS
SELECT event_type, user_id, transaction_id, amount, currency, parseDateTimeBestEffort(timestamp) as timestamp FROM analytics.transaction_events"

curl -X POST "$CLICKHOUSE_URL"  -d "
CREATE MATERIALIZED VIEW IF NOT EXISTS analytics.interaction_events_consumer TO analytics.interaction_events_storage AS
SELECT event_type, user_id, element_name, page, query, form_name, item_id, filter_name, filter_value, parseDateTimeBestEffort(timestamp) as timestamp FROM analytics.interaction_events"

echo "ClickHouse setup completed!"