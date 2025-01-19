FROM oven/bun:latest

WORKDIR /app

COPY package.json bun.lockb ./

RUN bun install

COPY . .

EXPOSE 3000

USER bun

CMD ["bun", "dev"]