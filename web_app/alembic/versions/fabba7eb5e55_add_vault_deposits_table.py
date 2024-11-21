"""add vault deposits table

Revision ID: fabba7eb5e55
Revises: b1fdf24eae4f
Create Date: 2024-11-21 10:58:50.354381

"""
from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision = 'fabba7eb5e55'
down_revision = 'b1fdf24eae4f'
branch_labels = None
depends_on = None


def upgrade() -> None:
    """
    Creates the vault_deposits table with necessary columns and indexes.
    
    Columns:
        - id: Primary key
        - wallet_id: User's wallet address
        - amount: Deposit amount with high precision
        - symbol: Token symbol
        - status: Current deposit status
        - created_at: Timestamp of creation
        - updated_at: Timestamp of last update
    """
    op.create_table('vault_deposits',
    sa.Column('id', sa.Integer(), nullable=False),
    sa.Column('wallet_id', sa.String(), nullable=False),
    sa.Column('amount', sa.Numeric(precision=36, scale=18), nullable=False),
    sa.Column('symbol', sa.String(), nullable=False),
    sa.Column('status', sa.String(), nullable=False),
    sa.Column('created_at', sa.DateTime(), nullable=True),
    sa.Column('updated_at', sa.DateTime(), nullable=True),
    sa.PrimaryKeyConstraint('id')
    )
    op.create_index(op.f('ix_vault_deposits_id'), 'vault_deposits', ['id'], unique=False)


def downgrade() -> None:
    """
    Removes the vault_deposits table and its associated indexes.
    This function is called when rolling back the migration.
    """
    op.drop_index(op.f('ix_vault_deposits_id'), table_name='vault_deposits')
    op.drop_table('vault_deposits')
