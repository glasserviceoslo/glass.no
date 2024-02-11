FROM node:lts AS runtime

RUN corepack enable
WORKDIR /app

COPY . .

RUN pnpm install --prod
RUN pnpm build

ENV HOST=0.0.0.0
EXPOSE 5001
CMD ["node", "server.mjs"] 