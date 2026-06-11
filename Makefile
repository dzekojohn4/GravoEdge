prod:
	@echo "Setting up production environment..."
	@docker compose -f devops/docker-compose.gravoedge.yaml up --build
	@echo "Production environment is ready."

dev:
	@echo "Setting up development environment..."
	@docker compose -f devops/docker-compose.gravoedge.dev.yaml up --build

windows:
	@echo "Setting up for Windows..."
	@docker compose -f devops/docker-compose.gravoedge.dev-windows.yaml up --build
	@echo "Windows setup completed."

back:
	@echo "Starting backend services..."
	@docker compose -f devops/docker-compose.gravoedge.back.yaml up --build
	@echo "Backend services are running."

test:
	@echo "Running backend tests..."
	@docker compose -f devops/docker-compose.gravoedge.back.yaml up -d --build
	@docker compose -f devops/docker-compose.gravoedge.back.yaml exec -T backend poetry run pytest web_app/tests -v

lint:
	@echo "Running pylint..."
	@pip install "pylint>=3.0,<4.0"
	@git ls-files '*.py' | xargs pylint --disable=all --enable=C0114,C0115,C0116,C0301 --output-format=colorized

frontend-test:
	@echo "Running frontend tests..."
	@cd gravoedge/frontend && yarn test:run

frontend-lint:
	@echo "Running frontend lint..."
	@cd gravoedge/frontend && yarn lint

ci: lint test frontend-test
	@echo "CI checks passed!"

all:
	@echo "Available targets: prod, dev, windows, back, test, lint, frontend-test, frontend-lint, ci"
