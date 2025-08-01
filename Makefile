# OrgR Monorepo Management
.PHONY: help dev dev-all dev-no-finclamp build build-all build-no-finclamp test docker-* clean

# Default target
help:
	@echo "🚀 OrgR Monorepo Commands"
	@echo ""
	@echo "Development:"
	@echo "  dev                 - Start finclamp only"
	@echo "  dev-all             - Start all apps including finclamp"
	@echo "  dev-no-finclamp     - Start all apps except finclamp (GitHub Pages)"
	@echo ""
	@echo "Building:"
	@echo "  build               - Build all apps"
	@echo "  build-no-finclamp   - Build apps except finclamp"
	@echo "  build-finclamp      - Build finclamp only"
	@echo ""
	@echo "Testing:"
	@echo "  test                - Run all tests"
	@echo "  test-no-finclamp    - Run tests except finclamp"
	@echo ""
	@echo "Docker (Production):"
	@echo "  docker-build        - Build all Docker images"
	@echo "  docker-up           - Start all containers"
	@echo "  docker-down         - Stop all containers"
	@echo "  docker-logs         - View container logs"
	@echo "  docker-restart      - Restart all containers"
	@echo "  docker-clean        - Clean up containers and images"
	@echo ""
	@echo "Docker (Development):"
	@echo "  docker-dev-up       - Start development containers"
	@echo "  docker-dev-down     - Stop development containers"
	@echo "  docker-dev-logs     - View development container logs"
	@echo ""
	@echo "Utilities:"
	@echo "  clean               - Clean all node_modules and dist folders"
	@echo "  install             - Install all dependencies"

# Development commands
dev:
	npm run dev

dev-all:
	npm run dev:all

dev-no-finclamp:
	npm run dev:all-no-finclamp

# Build commands
build:
	npm run build

build-no-finclamp:
	npm run build:all-no-finclamp

build-finclamp:
	npm run build:finclamp

# Test commands
test:
	npm run test

test-no-finclamp:
	npm run test:all-no-finclamp

# Docker production commands
docker-build:
	docker-compose build

docker-up:
	docker-compose up -d

docker-down:
	docker-compose down

docker-logs:
	docker-compose logs -f

docker-restart:
	docker-compose restart

docker-clean:
	docker-compose down -v --rmi all

# Docker development commands
docker-dev-up:
	docker-compose -f docker-compose.dev.yml up -d

docker-dev-down:
	docker-compose -f docker-compose.dev.yml down

docker-dev-logs:
	docker-compose -f docker-compose.dev.yml logs -f

# Utility commands
clean:
	npm run clean

install:
	npm run install:all

# Status check
status:
	@echo "📊 Container Status:"
	@docker ps --format "table {{.Names}}\t{{.Status}}\t{{.Ports}}"
	@echo ""
	@echo "🌐 Available Services:"
	@echo "  FinClamp (GitHub Pages): https://yourusername.github.io/prime/"
	@echo "  Arcade Games: http://localhost:3001"
	@echo "  Engaged: http://localhost:3002"
	@echo "  Skips: http://localhost:3003"
	@echo "  Proxy Dashboard: http://localhost:80"
