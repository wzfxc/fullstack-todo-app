FROM node:20-alpine AS builder

WORKDIR /app

RUN apk add --no-cache python3 make g++

COPY package*.json ./
RUN npm install

COPY tsconfig.json ./
COPY src ./src

RUN npm run build
RUN npm prune --omit=dev

FROM node:20-alpine AS runner

WORKDIR /app

ENV NODE_ENV=production
ENV PORT=5000

COPY package*.json ./
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/dist ./dist

EXPOSE 5000

CMD ["node", "dist/index.js"]

