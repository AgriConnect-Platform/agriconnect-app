# ── Stage 1: install dependencies ─────────────────────────────────────────────
FROM node:20-alpine AS builder

WORKDIR /app

COPY shared/package*.json ./shared/
RUN cd shared && npm install --omit=dev

COPY shared/ ./shared/

COPY services/marketplace-service/package*.json ./services/marketplace-service/
WORKDIR /app/services/marketplace-service
RUN npm install --omit=dev

COPY services/marketplace-service/ .

# ── Stage 2: minimal runtime image ────────────────────────────────────────────
FROM node:20-alpine AS runtime

RUN addgroup -S appgroup && adduser -S appuser -G appgroup

ENV NODE_ENV=production

WORKDIR /app

COPY --from=builder --chown=appuser:appgroup /app/shared ./shared
COPY --from=builder --chown=appuser:appgroup /app/services/marketplace-service ./services/marketplace-service

USER appuser

WORKDIR /app/services/marketplace-service

EXPOSE 3002
CMD ["node", "index.js"]
