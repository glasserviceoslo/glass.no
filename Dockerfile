# Use the official Bun image
FROM oven/bun:slim AS base
WORKDIR /usr/src/app

# Install dependencies into temp directory
FROM base AS install
RUN mkdir -p /temp/dev
COPY package.json bun.lockb /temp/dev/
RUN cd /temp/dev && bun install --frozen-lockfile

# Install production dependencies
RUN mkdir -p /temp/prod
COPY package.json bun.lockb /temp/prod/
RUN cd /temp/prod && bun install --frozen-lockfile --production

# Build the application
FROM base AS build
COPY --from=install /temp/dev/node_modules node_modules
COPY . .
RUN bun run build

# Create the production image
FROM base AS release
RUN apt-get update && apt-get install -y curl
COPY --from=install /temp/prod/node_modules node_modules
COPY --from=build /usr/src/app/dist ./dist

# Set environment variables and run the app
ENV HOST=0.0.0.0
ENV NODE_ENV=production
USER bun
EXPOSE 3000/tcp
ENTRYPOINT ["bun", "run", "./dist/server/entry.mjs"]