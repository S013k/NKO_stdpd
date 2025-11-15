# Backend - Добрые дела Росатома

## Обзор

Бэкенд API для портала «Добрые дела Росатома» обеспечивает управление данными НКО, новостей, событий и пользователей. Разработан с учетом масштабируемости и безопасности.

## Технологический стек

- **Runtime**: Node.js 18+
- **Framework**: Express.js
- **Language**: TypeScript
- **Database**: PostgreSQL
- **ORM**: Prisma
- **Authentication**: JWT + bcrypt
- **Validation**: Joi / Zod
- **Documentation**: Swagger/OpenAPI
- **Testing**: Jest + Supertest

## Структура проекта

```
backend/
├── src/
│   ├── controllers/            # Контроллеры API
│   │   ├── auth.controller.ts
│   │   ├── nko.controller.ts
│   │   ├── news.controller.ts
│   │   ├── events.controller.ts
│   │   └── users.controller.ts
│   ├── models/                 # Модели данных (Prisma)
│   │   └── index.ts
│   ├── routes/                 # Маршруты API
│   │   ├── auth.routes.ts
│   │   ├── nko.routes.ts
│   │   ├── news.routes.ts
│   │   ├── events.routes.ts
│   │   └── index.ts
│   ├── middleware/             # Middleware
│   │   ├── auth.middleware.ts
│   │   ├── validation.middleware.ts
│   │   ├── error.middleware.ts
│   │   └── cors.middleware.ts
│   ├── services/               # Бизнес-логика
│   │   ├── auth.service.ts
│   │   ├── nko.service.ts
│   │   ├── news.service.ts
│   │   └── email.service.ts
│   ├── utils/                  # Утилиты
│   │   ├── jwt.util.ts
│   │   ├── validation.util.ts
│   │   └── upload.util.ts
│   ├── config/                 # Конфигурация
│   │   ├── database.ts
│   │   ├── jwt.ts
│   │   └── app.ts
│   └── app.ts                  # Главный файл приложения
├── prisma/
│   ├── schema.prisma           # Схема базы данных
│   ├── migrations/             # Миграции
│   └── seed.ts                 # Начальные данные
├── tests/                      # Тесты
│   ├── unit/
│   ├── integration/
│   └── e2e/
├── docs/                       # Документация API
│   └── swagger.yaml
├── uploads/                    # Загруженные файлы
├── .env.example               # Пример переменных окружения
├── package.json
├── tsconfig.json
└── Dockerfile
```

## Модели данных

### Пользователи (Users)
```typescript
interface User {
  id: string
  email: string
  password: string
  firstName: string
  lastName: string
  role: 'admin' | 'moderator' | 'user'
  city: string
  phone?: string
  avatar?: string
  createdAt: Date
  updatedAt: Date
}
```

### НКО (Organizations)
```typescript
interface Organization {
  id: string
  name: string
  category: string
  description: string
  fullDescription: string
  address?: string
  phone?: string
  email?: string
  website?: string
  social?: {
    vk?: string
    telegram?: string
    ok?: string
  }
  logo?: string
  volunteerFunction: string
  city: string
  status: 'pending' | 'approved' | 'rejected'
  createdBy: string
  createdAt: Date
  updatedAt: Date
}
```

### Новости (News)
```typescript
interface News {
  id: string
  title: string
  excerpt: string
  content: string
  image?: string
  category?: string
  city?: string
  status: 'draft' | 'published'
  authorId: string
  createdAt: Date
  updatedAt: Date
}
```

### События (Events)
```typescript
interface Event {
  id: string
  title: string
  description: string
  date: Date
  location?: string
  image?: string
  category: string
  city: string
  organizationId?: string
  status: 'draft' | 'published'
  createdBy: string
  createdAt: Date
  updatedAt: Date
}
```

## API эндпоинты

### Аутентификация
- `POST /api/auth/register` - Регистрация
- `POST /api/auth/login` - Вход
- `POST /api/auth/logout` - Выход
- `POST /api/auth/refresh` - Обновление токена
- `POST /api/auth/forgot-password` - Восстановление пароля

### НКО
- `GET /api/nko` - Список НКО (с фильтрацией)
- `GET /api/nko/:id` - Детальная информация
- `POST /api/nko` - Создание НКО
- `PUT /api/nko/:id` - Обновление НКО
- `DELETE /api/nko/:id` - Удаление НКО
- `PUT /api/nko/:id/status` - Изменение статуса

### Новости
- `GET /api/news` - Список новостей
- `GET /api/news/:id` - Детальная информация
- `POST /api/news` - Создание новости
- `PUT /api/news/:id` - Обновление новости
- `DELETE /api/news/:id` - Удаление новости

### События
- `GET /api/events` - Список событий
- `GET /api/events/:id` - Детальная информация
- `POST /api/events` - Создание события
- `PUT /api/events/:id` - Обновление события
- `DELETE /api/events/:id` - Удаление события

## Установка и запуск

### Требования
- Node.js 18+
- PostgreSQL 14+
- Redis (для кеширования)

### Установка
```bash
cd backend
npm install
```

### Настройка переменных окружения
```bash
cp .env.example .env
# Отредактировать .env файл
```

### Миграции базы данных
```bash
npx prisma migrate dev
npx prisma generate
```

### Заполнение начальными данными
```bash
npx prisma db seed
```

### Запуск разработки
```bash
npm run dev
```

### Сборка для продакшена
```bash
npm run build
npm start
```

## Безопасность

### Аутентификация
- JWT токены с refresh токенами
- Хеширование паролей bcrypt
- Защита от brute-force атак

### Валидация
- Валидация входных данных
- Sanitизация данных
- Protection against SQL injection

### CORS и безопасность
- Настройка CORS
- Rate limiting
- Helmet.js для security headers

## Тестирование

### Unit тесты
```bash
npm run test:unit
```

### Интеграционные тесты
```bash
npm run test:integration
```

### E2E тесты
```bash
npm run test:e2e
```

### Покрытие кода
```bash
npm run test:coverage
```

## Документация

### Swagger UI
Запустите приложение и перейдите на: http://localhost:3001/api-docs

### Генерация документации
```bash
npm run docs:generate
```

## Деплоймент

### Docker
```bash
docker build -t nko-backend .
docker run -p 3001:3001 nko-backend
```

### Environment variables
```bash
NODE_ENV=production
DATABASE_URL=postgresql://...
JWT_SECRET=your-secret-key
REDIS_URL=redis://...
```

## Мониторинг и логирование

### Логирование
- Winston для структурированных логов
- Уровни логирования: error, warn, info, debug
- Запись в файлы и консоль

### Мониторинг
- Health check эндпоинт: `/api/health`
- Метрики производительности
- Error tracking (планируется)

## Производительность

### Оптимизация
- Connection pooling для PostgreSQL
- Redis кеширование
- Pagination для больших списков
- Индексы в базе данных

### Scaling
- Horizontal scaling с load balancer
- Database replication
- CDN для статических файлов

## Будущее развитие

### Фичи
- Real-time уведомления (WebSocket)
- Email уведомления
- File upload с облачным хранением
- Analytics и отчеты
- Multi-language поддержка

### Интеграции
- Внешние API для геолокации
- Платежные системы
- Социальные сети
- Email сервисы

## Архитектурные решения

1. **RESTful API** - стандартные HTTP методы и статусы
2. **Prisma ORM** - типобезопасная работа с базой
3. **JWT аутентификация** - stateless аутентификация
4. **Модульная архитектура** - разделение ответственности
5. **TypeScript** - типобезопасность
6. **Docker** - контейнеризация

## Полезные команды

```bash
npm run dev          # Запуск разработки
npm run build        # Сборка проекта
npm run start        # Запуск продакшн версии
npm run test         # Запуск всех тестов
npm run lint         # Проверка линтинга
npm run migrate      # Миграции базы данных
npm run seed         # Заполнение данными
npm run docs         # Генерация документации