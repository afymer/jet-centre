COMPOSE := docker compose
EXEC := docker exec

APP_CONTAINER_NAME := jc-app
DB_CONTAINER_NAME := jc-postgres
CACHE_CONTAINER_NAME := jc-redis

PACKAGE_MANAGER := npm
PREFIX := bun # npm

DEV_COMPOSE := compose.dev.yml
PROD_COMPOSE := compose.prod.yml

docker-start:
	docker start $(APP_CONTAINER_NAME) $(DB_CONTAINER_NAME) $(CACHE_CONTAINER_NAME)
dev:
	$(COMPOSE) -f $(DEV_COMPOSE) up --watch

build:
	$(COMPOSE) -f $(DEV_COMPOSE) build

fmt:
	$(EXEC) $(APP_CONTAINER_NAME) $(PACKAGE_MANAGER) run fmt

studio:
	$(EXEC) $(APP_CONTAINER_NAME) $(PREFIX)x prisma studio

seed: reset_db
	$(EXEC) $(CONTAINER_NAME) $(PREFIX)x prisma db seed -- --environment dev

seed-prod: reset_db
	$(EXEC) $(APP_CONTAINER_NAME) $(PREFIX)x prisma db seed -- --environment prod

reset_db:
	$(EXEC) $(APP_CONTAINER_NAME) $(PREFIX)x prisma db push --force-reset

migrate:
	$(EXEC) $(APP_CONTAINER_NAME) $(PREFIX)x prisma migrate deploy

stop:
	$(COMPOSE) down

build-prod:
	$(COMPOSE) -f $(PROD_COMPOSE) build

run-prod:
	$(COMPOSE) -f $(PROD_COMPOSE) up -d

stop-prod:
	$(COMPOSE) -f $(PROD_COMPOSE) down

.PHONY: build dev studio seed reset_db stop build-prod run-prod stop-prod
