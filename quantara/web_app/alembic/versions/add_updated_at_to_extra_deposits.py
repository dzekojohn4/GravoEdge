"""Add updated_at column to extra_deposits

Revision ID: 0001_add_updated_at_ed
Revises: c045e432555c
Create Date: 2026-06-11

"""
from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision = "a10b2c3d4e5f"
down_revision = "c045e432555c"
branch_labels = None
depends_on = None


def upgrade() -> None:
    """Adds updated_at column to extra_deposits table"""
    op.add_column(
        "extra_deposits",
        sa.Column(
            "updated_at",
            sa.DateTime(),
            nullable=False,
            server_default=sa.func.now(),
        ),
    )


def downgrade() -> None:
    """Removes updated_at column from extra_deposits table"""
    op.drop_column("extra_deposits", "updated_at")
