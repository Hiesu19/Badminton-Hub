FROM node:20-alpine AS builder

WORKDIR /usr/src/app

# Prepare pnpm via corepack and copy workspace declarations.
RUN corepack enable && corepack prepare pnpm@10.26.2 --activate

COPY package.json pnpm-lock.yaml pnpm-workspace.yaml ./
COPY apps ./apps
COPY packages ./packages
COPY .env .env

# Install dependencies and build all workspace apps.
RUN pnpm install --frozen-lockfile
RUN pnpm run build:all

FROM node:20-alpine AS runtime

WORKDIR /usr/src/app

RUN corepack enable && corepack prepare pnpm@10.26.2 --activate

COPY --from=builder /usr/src/app/package.json ./package.json
COPY --from=builder /usr/src/app/pnpm-lock.yaml ./pnpm-lock.yaml
COPY --from=builder /usr/src/app/pnpm-workspace.yaml ./pnpm-workspace.yaml
COPY --from=builder /usr/src/app/node_modules ./node_modules
COPY --from=builder /usr/src/app/apps ./apps
COPY --from=builder /usr/src/app/packages ./packages
COPY --from=builder /usr/src/app/.env .env

COPY docker-entrypoint.sh .
RUN chmod +x docker-entrypoint.sh

EXPOSE 4173 4174 4175

ENTRYPOINT ["./docker-entrypoint.sh"]

