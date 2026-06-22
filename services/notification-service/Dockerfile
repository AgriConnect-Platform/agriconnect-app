# ── Stage 1: install dependencies ─────────────────────────────────────────────
FROM node:20-alpine AS builder

WORKDIR /app

COPY shared/package*.json ./shared/
RUN cd shared && npm install --omit=dev

COPY shared/ ./shared/

COPY services/notification-service/package*.json ./services/notification-service/
WORKDIR /app/services/notification-service
RUN npm install --omit=dev

COPY services/notification-service/ .

# ── Stage 2: minimal runtime image ────────────────────────────────────────────
FROM node:20-alpine AS runtime

RUN addgroup -S appgroup && adduser -S appuser -G appgroup

ENV NODE_ENV=production

WORKDIR /app

COPY --from=builder --chown=appuser:appgroup /app/shared ./shared
COPY --from=builder --chown=appuser:appgroup /app/services/notification-service ./services/notification-service

USER appuser

WORKDIR /app/services/notification-service

EXPOSE 3005
CMD ["node", "index.js"]
