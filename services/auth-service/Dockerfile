# ── Stage 1: install dependencies ─────────────────────────────────────────────
FROM node:20-alpine AS builder

WORKDIR /app

COPY shared/package*.json ./shared/
RUN cd shared && npm install --omit=dev

COPY shared/ ./shared/

COPY services/auth-service/package*.json ./services/auth-service/
WORKDIR /app/services/auth-service
RUN npm install --omit=dev

COPY services/auth-service/ .

# ── Stage 2: minimal runtime image ────────────────────────────────────────────
FROM node:20-alpine AS runtime

RUN addgroup -S appgroup && adduser -S appuser -G appgroup

ENV NODE_ENV=production

WORKDIR /app

COPY --from=builder --chown=appuser:appgroup /app/shared ./shared
COPY --from=builder --chown=appuser:appgroup /app/services/auth-service ./services/auth-service

USER appuser

WORKDIR /app/services/auth-service

EXPOSE 3001
CMD ["node", "index.js"]
