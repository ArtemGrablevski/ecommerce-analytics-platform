"""Initial tables

Revision ID: 001
Revises:
Create Date: 2025-12-09 00:00:00.000000

"""
from alembic import op

revision = "001"
down_revision = None
branch_labels = None
depends_on = None


def upgrade() -> None:
    op.execute("""CREATE DATABASE IF NOT EXISTS analytics""")

    op.execute(
        """
        CREATE TABLE IF NOT EXISTS analytics.user_events (
            event_type String,
            user_id String,
            timestamp DateTime64(3)
        ) ENGINE = Kafka()
        SETTINGS
            kafka_broker_list = 'kafka:9092',
            kafka_topic_list = 'user_events',
            kafka_group_name = 'clickhouse_user_consumer',
            kafka_format = 'JSONEachRow',
            kafka_max_block_size = 1048576
    """
    )

    op.execute(
        """
        CREATE TABLE IF NOT EXISTS analytics.transaction_events (
            event_type String,
            user_id String,
            transaction_id String,
            amount Decimal64(2),
            currency String,
            timestamp DateTime64(3)
        ) ENGINE = Kafka()
        SETTINGS
            kafka_broker_list = 'kafka:9092',
            kafka_topic_list = 'transaction_events',
            kafka_group_name = 'clickhouse_transaction_consumer',
            kafka_format = 'JSONEachRow',
            kafka_max_block_size = 1048576
    """
    )

    op.execute(
        """
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
            timestamp DateTime64(3)
        ) ENGINE = Kafka()
        SETTINGS
            kafka_broker_list = 'kafka:9092',
            kafka_topic_list = 'interaction_events',
            kafka_group_name = 'clickhouse_interaction_consumer',
            kafka_format = 'JSONEachRow',
            kafka_max_block_size = 1048576
    """
    )

    op.execute(
        """
        CREATE TABLE IF NOT EXISTS analytics.user_events_mv (
            event_type String,
            user_id String,
            timestamp DateTime64(3)
        ) ENGINE = MergeTree()
        ORDER BY (timestamp, user_id)
    """
    )

    op.execute(
        """
        CREATE TABLE IF NOT EXISTS analytics.transaction_events_mv (
            event_type String,
            user_id String,
            transaction_id String,
            amount Decimal64(2),
            currency String,
            timestamp DateTime64(3)
        ) ENGINE = MergeTree()
        ORDER BY (timestamp, user_id)
    """
    )

    op.execute(
        """
        CREATE TABLE IF NOT EXISTS analytics.interaction_events_mv (
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
        ORDER BY (timestamp, user_id, event_type)
    """
    )

    op.execute(
        """
        CREATE MATERIALIZED VIEW IF NOT EXISTS analytics.user_events_consumer TO analytics.user_events_mv AS
        SELECT event_type, user_id, timestamp FROM analytics.user_events
    """
    )

    op.execute(
        """
        CREATE MATERIALIZED VIEW IF NOT EXISTS analytics.transaction_events_consumer TO analytics.transaction_events_mv AS
        SELECT event_type, user_id, transaction_id, amount, currency, timestamp FROM analytics.transaction_events
    """
    )

    op.execute(
        """
        CREATE MATERIALIZED VIEW IF NOT EXISTS analytics.interaction_events_consumer TO analytics.interaction_events_mv AS
        SELECT event_type, user_id, element_name, page, query, form_name, item_id, filter_name, filter_value, timestamp FROM analytics.interaction_events
    """
    )


def downgrade() -> None:
    op.execute("DROP VIEW IF EXISTS analytics.interaction_events_consumer")
    op.execute("DROP VIEW IF EXISTS analytics.transaction_events_consumer")
    op.execute("DROP VIEW IF EXISTS analytics.user_events_consumer")
    op.execute("DROP TABLE IF EXISTS analytics.interaction_events_mv")
    op.execute("DROP TABLE IF EXISTS analytics.transaction_events_mv")
    op.execute("DROP TABLE IF EXISTS analytics.user_events_mv")
    op.execute("DROP TABLE IF EXISTS analytics.interaction_events")
    op.execute("DROP TABLE IF EXISTS analytics.transaction_events")
    op.execute("DROP TABLE IF EXISTS analytics.user_events")
