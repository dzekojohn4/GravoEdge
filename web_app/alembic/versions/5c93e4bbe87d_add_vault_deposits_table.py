"""add vault deposits table

Revision ID: 5c93e4bbe87d
Revises: fabba7eb5e55
Create Date: 2024-11-21 11:06:22.525552

"""
from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision = '5c93e4bbe87d'
down_revision = 'fabba7eb5e55'
branch_labels = None
depends_on = None


def upgrade() -> None:
    """
    Empty upgrade function as the changes were made in the previous migration.
    """
    pass


def downgrade() -> None:
    """
    Empty downgrade function as there are no changes to revert.
    """
    pass
