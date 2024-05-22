FROM node:lts AS base

RUN curl -fsSL https://bun.sh/install | bash
WORKDIR /app

COPY package.json bun.lockb ./

FROM base AS prod-deps
RUN bun install --production

FROM base AS build
COPY . .
RUN bun run build

FROM base AS runtime
COPY --from=prod-deps /app/node_modules ./node_modules
COPY --from=build /app/dist ./dist

ENV HOST=0.0.0.0
CMD ["node", "./dist/server.mjs"] 
