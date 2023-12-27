FROM node:lts AS runtime
RUN corepack enable
WORKDIR /app

COPY . .

RUN pnpm install --prod
RUN pnpm build

ENV HOST=0.0.0.0
ENV PORT=8100
EXPOSE 8100
CMD node ./dist/server/entry.mjs