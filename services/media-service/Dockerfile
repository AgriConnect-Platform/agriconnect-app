# ── Stage 1: install dependencies ─────────────────────────────────────────────
FROM node:20-alpine AS builder

WORKDIR /app

COPY shared/package*.json ./shared/
RUN cd shared && npm install --omit=dev

COPY shared/ ./shared/

COPY services/media-service/package*.json ./services/media-service/
WORKDIR /app/services/media-service
RUN npm install --omit=dev

COPY services/media-service/ .

# ── Stage 2: minimal runtime image ────────────────────────────────────────────
FROM node:20-alpine AS runtime

RUN addgroup -S appgroup && adduser -S appuser -G appgroup

ENV NODE_ENV=production

WORKDIR /app

COPY --from=builder --chown=appuser:appgroup /app/shared ./shared
COPY --from=builder --chown=appuser:appgroup /app/services/media-service ./services/media-service

USER appuser

WORKDIR /app/services/media-service

EXPOSE 3004
CMD ["node", "index.js"]
