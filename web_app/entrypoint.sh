#!/bin/bash

echo "Starting the server ..."
exec "$@"

uvicorn api.form:app --host 0.0.0.0 --port 8000 --reload