# Multi-stage Dockerfile for Strapi 5 backend

# -----------------------------------------------------------------------------
# Stage 1: Builder
# -----------------------------------------------------------------------------
FROM node:20-alpine AS builder

# install build tools for native modules
RUN apk add --no-cache python3 make g++

WORKDIR /app

# copy package manifests and lockfiles first to leverage caching
COPY package*.json ./

# copy all relevant source/configuration for build
COPY config/ config/
COPY src/ src/
COPY public/ public/
COPY scripts/ scripts/
COPY database/ database/
COPY data/ data/
COPY types/ types/
COPY tsconfig.json .
COPY favicon.png .

# install dependencies and build the app
RUN npm ci
RUN npm run build

# -----------------------------------------------------------------------------
# Stage 2: Production image
# -----------------------------------------------------------------------------
FROM node:20-alpine AS production

# install runtime dependencies in case native modules are required at start
RUN apk add --no-cache python3 make g++

# create non‑root user for security
RUN addgroup -S strapi && adduser -S -G strapi strapi

WORKDIR /app

# copy package metadata so we can install only production deps
COPY --from=builder /app/package*.json ./

# copy the rest of the application (including build output)
COPY --from=builder /app .

# install production dependencies only
RUN npm ci --omit=dev

# ensure upload directory exists and is owned by the non‑root user
RUN mkdir -p /app/public/uploads \
    && chown -R strapi:strapi /app/public/uploads

# Copy and make executable the startup script
COPY scripts/start-with-seed.sh /usr/local/bin/

USER root
RUN chmod +x /usr/local/bin/start-with-seed.sh && \
    chmod +x /app/scripts/start-with-seed.sh

USER strapi

EXPOSE 1337

ENTRYPOINT ["start-with-seed.sh"]
CMD ["npm", "run", "start"]
