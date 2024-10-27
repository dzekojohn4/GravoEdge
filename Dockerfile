FROM python:3.12-slim

# Environment settings
ENV PYTHONUNBUFFERED 1
ENV PYTHONDONTWRITEBYTECODE 1

# Add system-level dependencies (including gcc and npm)
RUN apt-get update \
    && apt-get install -y --no-install-recommends \
       libpq-dev gcc g++ make libffi-dev build-essential \
       curl nodejs npm \
    && rm -rf /var/lib/apt/lists/*

# Install Poetry
RUN curl -sSL https://install.python-poetry.org | python3 -
ENV PATH="/root/.local/bin:$PATH"

# Create app directory
RUN mkdir /app
WORKDIR /app

# Copy the pyproject.toml file to install dependencies
COPY ./pyproject.toml /app/

# Install dependencies using Poetry, generating a new poetry.lock file
RUN poetry install --no-root --no-interaction --no-ansi

# Copy the rest of the application code
ADD . /app

# Install StarknetKit via npm with legacy-peer-deps flag
RUN npm install @argent/get-starknet --legacy-peer-deps --save

EXPOSE 8000

ENTRYPOINT ["bash", "/app/entrypoint.sh"]