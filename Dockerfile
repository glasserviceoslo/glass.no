FROM node:lts AS base

RUN curl -fsSL https://bun.sh/install | bash 
ENV PATH="${PATH}:/root/.bun/bin"

WORKDIR /app

COPY package.json bun.lockb ./

FROM base AS prod-deps
RUN bun install --production

FROM base AS build
COPY . .
RUN bun run build

FROM base AS runtime

RUN curl -sf https://gobinaries.com/tj/node-prune | sh && \
    node-prune

COPY --from=prod-deps /app/node_modules ./node_modules
COPY --from=build /app/dist ./dist

ENV HOST=0.0.0.0
CMD ["node", "./dist/server.mjs"] 
