FROM node:20-alpine AS builder

WORKDIR /usr/src/app

COPY package*.json ./
RUN npm ci

COPY . .
RUN npm run build

FROM node:20-alpine

WORKDIR /usr/src/app

COPY package*.json ./
RUN npm ci --omit=dev

COPY --from=builder /usr/src/app/dist ./dist
COPY --from=builder /usr/src/app/src ./src
COPY --from=builder /usr/src/app/.env.example .env.example
COPY --from=builder /usr/src/app/.env .env


ENV NODE_ENV=production
EXPOSE 5000
CMD ["node", "dist/main"]

