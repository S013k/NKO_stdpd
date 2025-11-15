# Используем многоэтапную сборку для оптимизации размера образа
FROM node:20-alpine AS base

# Устанавливаем рабочую директорию
WORKDIR /app

# Копируем файлы управления зависимостями
COPY package*.json ./

# Устанавливаем зависимости
RUN npm ci --only=production && npm cache clean --force

# Этап разработки
FROM base AS deps
RUN npm ci

# Этап сборки
FROM base AS builder
COPY --from=deps /app/node_modules ./node_modules
COPY . .

# Собираем приложение
RUN npm run build

# Этап производства
FROM node:20-alpine AS runner
WORKDIR /app

ENV NODE_ENV production

# Создаем пользователя с ограниченными правами
RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

# Копируем собранное приложение
COPY --from=builder /app/public ./public
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static

USER nextjs

EXPOSE 3000

ENV PORT 3000
ENV HOSTNAME "0.0.0.0"

# Запускаем приложение
CMD ["node", "server.js"]