FROM node:22-slim

# Set shell to bash
SHELL ["/bin/bash", "-c"]

# Dependencies install
RUN apt-get update && apt-get install -y --no-install-recommends \
  curl \
  && rm -rf /var/lib/apt/lists/*

# App part
ENV PATH="/app/node_modules/.bin:${PATH}"

WORKDIR /app

# Install dependencies
COPY yarn.lock package.json package-lock.json ./
RUN yarn install --prod && yarn add serve && yarn cache clean

# Copy app files
COPY public/ public/
COPY src/ src/
COPY tsconfig.json ./
COPY config-overrides.js ./

# Build
RUN yarn build

USER nobody