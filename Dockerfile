FROM node:22-slim AS builder

RUN apt update -y && apt install -y openssl

WORKDIR /app

COPY package*.json ./

RUN npm install --omit=dev

COPY . .

RUN npx prisma generate

EXPOSE 5005
