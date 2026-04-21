"""add user profiles

Revision ID: 61d3cf757898
Revises: 71c10fd6bca5
Create Date: 2026-04-10 18:55:46.900929

"""
from typing import Sequence, Union

import sqlalchemy as sa

from alembic import op

# revision identifiers, used by Alembic.
revision: str = "61d3cf757898"
down_revision: Union[str, Sequence[str], None] = "71c10fd6bca5"
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    op.add_column("partners", sa.Column("is_banned", sa.Boolean(), server_default=sa.text("false"), nullable=False))
    op.add_column("partners", sa.Column("active_until", sa.DateTime(), nullable=True))


def downgrade() -> None:
    op.drop_column("partners", "active_until")
    op.drop_column("partners", "is_banned")
