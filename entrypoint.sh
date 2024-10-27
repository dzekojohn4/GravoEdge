#!/bin/bash

echo "Run migration with alembic"
poetry run alembic -c web_app/alembic.ini upgrade head

echo "Starting the server ..."
poetry run uvicorn web_app.api.main:app --host 0.0.0.0 --port 8000