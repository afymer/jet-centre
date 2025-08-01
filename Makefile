COMPOSE := docker compose
EXEC := docker exec

APP_CONTAINER_NAME := jc-app
DB_CONTAINER_NAME := jc-postgres
CACHE_CONTAINER_NAME := jc-redis

PACKAGE_MANAGER := npm
PREFIX := bun # npm

DEV_COMPOSE := compose.dev.yml
PROD_COMPOSE := compose.prod.yml

dev:
	$(COMPOSE) -f $(DEV_COMPOSE) up

build:
	$(COMPOSE) -f $(DEV_COMPOSE) build

seed: reset-db
	$(EXEC) $(CONTAINER_NAME) $(PREFIX)x prisma db seed -- --environment dev

seed-prod: reset-db
	$(EXEC) $(APP_CONTAINER_NAME) $(PREFIX)x prisma db seed -- --environment prod

reset-db:
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

.PHONY: dev build seed seed-prod reset-db migrate stop build-prod run-prod stop-prod
