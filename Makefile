COMPOSE := docker compose
EXEC := docker exec

CONTAINER_NAME := jet-centre
PACKAGE_MANAGER := npm
PREFIX := bun # npm

docker-start:
	docker start $(CONTAINER_NAME) jet-centre-postgres-1 jet-centre-cache-1
dev:
	$(COMPOSE) -f docker-compose.dev.yml up --build

build:
	$(COMPOSE) -f docker-compose.dev.yml build

fmt:
	$(EXEC) $(CONTAINER_NAME) $(PACKAGE_MANAGER) run fmt

studio:
	$(EXEC) $(CONTAINER_NAME) $(PREFIX)x prisma studio

seed: reset_db
	$(EXEC) $(CONTAINER_NAME) $(PREFIX)x prisma db seed -- --environment dev

seed-prod: reset_db
	$(EXEC) $(CONTAINER_NAME) $(PREFIX)x prisma db seed -- --environment prod

reset_db:
	$(EXEC) $(CONTAINER_NAME) $(PREFIX)x prisma db push --force-reset

migrate:
	$(EXEC) $(CONTAINER_NAME) $(PREFIX)x prisma migrate deploy

stop:
	$(COMPOSE) down

build-prod:
	$(COMPOSE) -f docker-compose.yml build

run-prod:
	$(COMPOSE) -f docker-compose.yml up -d

stop-prod:
	$(COMPOSE) -f docker-compose.yml down

.PHONY: build dev studio seed reset_db stop build-prod run-prod stop-prod
