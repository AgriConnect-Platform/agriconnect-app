# ── Stage 1: install dependencies ─────────────────────────────────────────────
FROM node:20-alpine AS builder

WORKDIR /app

COPY shared/package*.json ./shared/
RUN cd shared && npm install --omit=dev

COPY shared/ ./shared/

COPY services/order-service/package*.json ./services/order-service/
WORKDIR /app/services/order-service
RUN npm install --omit=dev

COPY services/order-service/ .

# ── Stage 2: minimal runtime image ────────────────────────────────────────────
FROM node:20-alpine AS runtime

RUN addgroup -S appgroup && adduser -S appuser -G appgroup

ENV NODE_ENV=production

WORKDIR /app

COPY --from=builder --chown=appuser:appgroup /app/shared ./shared
COPY --from=builder --chown=appuser:appgroup /app/services/order-service ./services/order-service

USER appuser

WORKDIR /app/services/order-service

EXPOSE 3003
CMD ["node", "index.js"]
