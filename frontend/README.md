# Фронтенд социальных инициатив Росатома

Это [Next.js](https://nextjs.org) проект для платформы социальных инициатив Росатома, созданный с помощью [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Запуск в Docker

### Быстрый старт с Docker Compose

Самый простой способ запустить приложение - использовать Docker Compose:

```bash
# Из корневой директории проекта
docker-compose up -d
```

Приложение будет доступно по адресу [http://localhost:3000](http://localhost:3000).

### Остановка контейнера

```bash
docker-compose down
```

### Пересборка образа

```bash
docker-compose build --no-cache
```

### Просмотр логов

```bash
docker-compose logs frontend
```

## Локальная разработка

Для локальной разработки без Docker:

### Установка зависимостей

```bash
npm install
```

### Запуск сервера разработки

```bash
npm run dev
# или
yarn dev
# или
pnpm dev
# или
bun dev
```

Откройте [http://localhost:3000](http://localhost:3000) в браузере для просмотра результата.

### Сборка для продакшена

```bash
npm run build
npm start
```

## Структура Docker

Проект использует многоэтапную сборку Docker:

- **base**: Базовый образ с Node.js и зависимостями
- **deps**: Установка всех зависимостей для сборки
- **builder**: Сборка приложения с Next.js
- **runner**: Финальный образ для продакшена с оптимизированным размером

### Особенности конфигурации

- Используется Node.js 20 Alpine для соответствия требованиям Next.js 16
- Включен `output: 'standalone'` в `next.config.ts` для оптимизации Docker образа
- Создан пользователь с ограниченными правами для безопасности
- Настроены health checks для мониторинга состояния контейнера

## Разработка

Вы можете начать редактирование страницы, изменяя файл `app/page.tsx`. Страница автоматически обновляется при сохранении изменений.

Проект использует [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) для автоматической оптимизации и загрузки шрифтов.

## Дополнительная информация

### Переменные окружения

- `NODE_ENV`: Устанавливается в `production` в Docker
- `PORT`: Порт приложения (по умолчанию 3000)
- `HOSTNAME`: Хост для запуска (0.0.0.0 для Docker)

### Полезные команды

```bash
# Проверка статуса контейнера
docker-compose ps

# Вход в контейнер для отладки
docker-compose exec frontend sh

# Перезапуск контейнера
docker-compose restart frontend
```

## Изучение Next.js

Чтобы узнать больше о Next.js, ознакомьтесь со следующими ресурсами:

- [Документация Next.js](https://nextjs.org/docs) - изучите возможности и API Next.js
- [Изучение Next.js](https://nextjs.org/learn) - интерактивное руководство по Next.js

Вы можете посетить [GitHub репозиторий Next.js](https://github.com/vercel/next.js) - ваша обратная связь и вклад приветствуются!

## Развертывание

Простейший способ развернуть Next.js приложение - использовать [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) от создателей Next.js.

Изучите нашу [документацию по развертыванию Next.js](https://nextjs.org/docs/app/building-your-application/deploying) для получения более подробной информации.
