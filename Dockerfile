FROM node:18 AS builder
WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .

RUN npm run build

FROM node:18 AS production

WORKDIR /app

COPY --from=builder /app/dist ./dist
COPY --from=builder /app/package*.json ./

RUN npm install --production

# Экспонируем порт и запускаем приложение
EXPOSE 3000
CMD ["node", "dist/index.js"]