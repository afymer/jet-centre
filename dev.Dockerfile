# syntax=docker.io/docker/dockerfile:1

FROM oven/bun:1 AS openssl
RUN apt-get update -y && apt-get install -y openssl
RUN apt-get update -y && apt-get install -y git

FROM openssl AS packages
WORKDIR /app

COPY package.json bun.lock* ./

# RUN --mount=type=cache,target=/root/.bun bun install --frozen-lockfile
# RUN bun install --frozen-lockfile

FROM packages AS base

COPY . /app

# Next.js collects completely anonymous telemetry data about general usage. Learn more here: https://nextjs.org/telemetry
# Uncomment the following line to disable telemetry at run time
ENV NEXT_TELEMETRY_DISABLED 1

# RUN bunx prisma generate

CMD bun install --frozen-lockfile --verbose && bunx prisma generate && bun run dev

