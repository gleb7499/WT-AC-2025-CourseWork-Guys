# Волонтёры «Помощь рядом» - Volunteer Help System

Production-ready full-stack приложение для организации волонтёрской помощи. Система позволяет людям создавать запросы на помощь, а волонтёрам откликаться на них.

## 🚀 Быстрый старт

### Требования

- Docker и Docker Compose
- Node.js 20+ (опционально, для разработки)
- pnpm (опционально, для разработки)

### Запуск с Docker (рекомендуется)

```bash
# Клонировать репозиторий
git clone <repository-url>
cd BurakIlya

# Запустить все сервисы
docker-compose up --build
```

После запуска:
- **Frontend**: http://localhost:5173
- **Backend API**: http://localhost:3000
- **API Health Check**: http://localhost:3000/health
- **Database**: localhost:5432

### Тестовые пользователи

После seed базы данных доступны следующие пользователи:

| Username | Password | Role | Описание |
|----------|----------|------|----------|
| admin | Admin123! | admin | Администратор системы |
| user | User123! | user | Обычный пользователь |
| volunteer1 | Volunteer123! | volunteer | Волонтёр 1 |
| volunteer2 | Volunteer123! | volunteer | Волонтёр 2 |

## 📋 Функционал

### MVP Features

- ✅ Регистрация и аутентификация (JWT)
- ✅ Три роли: admin, user, volunteer
- ✅ Создание запросов помощи
- ✅ Просмотр и фильтрация запросов
- ✅ Назначение волонтёров на запросы
- ✅ Изменение статусов заданий
- ✅ Система отзывов
- ✅ Категории помощи
- ✅ Профили волонтёров с рейтингом
- ✅ Защищённые маршруты и эндпоинты
- ✅ Валидация данных (клиент и сервер)
- ✅ Пагинация списков
- ✅ Обработка ошибок

### Возможности по ролям

**Администратор (admin):**
- Управление пользователями
- Управление категориями
- Модерация запросов и отзывов
- Назначение волонтёров
- Создание профилей волонтёров

**Пользователь (user):**
- Создание запросов помощи
- Просмотр своих запросов
- Оставление отзывов после завершения

**Волонтёр (volunteer):**
- Просмотр доступных запросов
- Отклик на запросы
- Управление своими заданиями
- Просмотр своего рейтинга

## 🏗️ Архитектура

### Структура проекта

```
BurakIlya/
├── apps/
│   ├── server/                 # Backend (Node.js + Express + Prisma)
│   │   ├── src/
│   │   │   ├── controllers/    # HTTP обработчики
│   │   │   ├── services/       # Бизнес-логика
│   │   │   ├── routes/         # Определение маршрутов
│   │   │   ├── middleware/     # Auth, validation, errors
│   │   │   ├── schemas/        # Zod валидация
│   │   │   ├── lib/            # Утилиты (JWT, Prisma, Logger)
│   │   │   └── types/          # TypeScript типы
│   │   ├── prisma/
│   │   │   ├── schema.prisma   # Схема БД
│   │   │   └── seed.ts         # Тестовые данные
│   │   └── Dockerfile
│   │
│   └── web/                    # Frontend (React + TypeScript + Vite)
│       ├── src/
│       │   ├── pages/          # Страницы приложения
│       │   ├── components/     # Переиспользуемые компоненты
│       │   ├── features/       # Модули (auth store)
│       │   ├── api/            # API клиент и методы
│       │   └── shared/         # Общие типы и утилиты
│       └── Dockerfile
│
├── task_01/                    # Документация R1
├── docker-compose.yml          # Docker orchestration
├── pnpm-workspace.yaml         # Monorepo config
└── .env.example                # Пример переменных окружения
```

### Технологический стек

**Backend:**
- Node.js 20 + Express
- TypeScript (strict mode)
- Prisma ORM + PostgreSQL 16
- JWT (access + refresh tokens)
- Zod (валидация)
- bcrypt (12 rounds)
- Pino (логирование)
- Helmet + CORS (безопасность)
- Rate limiting (auth endpoints)

**Frontend:**
- React 18 + TypeScript
- Vite (build tool)
- React Router v6
- Zustand (state management)
- Axios (HTTP client with interceptors)

**DevOps:**
- Docker + Docker Compose
- Multi-stage builds
- Health checks
- pnpm workspace (monorepo)

## 🔒 Безопасность

- JWT секреты без fallback значений
- Пароли хешируются bcrypt с 12 раундами
- Rate limiting на auth endpoints (5 попыток / 15 минут)
- CORS настроен для CLIENT_URL
- Helmet для защиты HTTP заголовков
- Валидация данных Zod на всех эндпоинтах
- Protected routes на клиенте
- Middleware авторизации на сервере

## 📡 API Endpoints

### Authentication
- `POST /api/auth/register` - Регистрация
- `POST /api/auth/login` - Вход
- `POST /api/auth/refresh` - Обновление токена

### Users
- `GET /api/users` - Список пользователей (admin)
- `GET /api/users/:id` - Получить пользователя
- `PUT /api/users/:id` - Обновить пользователя
- `DELETE /api/users/:id` - Удалить пользователя (admin)

### Categories
- `GET /api/categories` - Список категорий
- `POST /api/categories` - Создать категорию (admin)
- `GET /api/categories/:id` - Получить категорию
- `PUT /api/categories/:id` - Обновить категорию (admin)
- `DELETE /api/categories/:id` - Удалить категорию (admin)

### Help Requests
- `GET /api/requests` - Список запросов (с фильтрами)
- `POST /api/requests` - Создать запрос (user)
- `GET /api/requests/:id` - Получить запрос
- `PUT /api/requests/:id` - Обновить запрос
- `DELETE /api/requests/:id` - Удалить запрос

### Volunteers
- `GET /api/volunteers` - Список волонтёров
- `POST /api/volunteers` - Создать профиль (admin)
- `GET /api/volunteers/:id` - Получить профиль
- `GET /api/volunteers/:id/stats` - Статистика волонтёра
- `PUT /api/volunteers/:id` - Обновить профиль
- `DELETE /api/volunteers/:id` - Удалить профиль (admin)

### Assignments
- `GET /api/assignments` - Список назначений
- `POST /api/assignments` - Создать назначение (volunteer)
- `GET /api/assignments/:id` - Получить назначение
- `PUT /api/assignments/:id` - Обновить статус
- `DELETE /api/assignments/:id` - Удалить назначение (admin)

### Reviews
- `GET /api/reviews` - Список отзывов
- `POST /api/reviews` - Создать отзыв (user)
- `GET /api/reviews/:id` - Получить отзыв
- `PUT /api/reviews/:id` - Обновить отзыв
- `DELETE /api/reviews/:id` - Удалить отзыв (admin)

## 🛠️ Разработка

### Установка зависимостей

```bash
# Установить все зависимости
pnpm install
```

### Локальная разработка

```bash
# Запустить PostgreSQL
docker-compose up postgres

# В другом терминале: Запустить backend
cd apps/server
pnpm db:push
pnpm db:seed
pnpm dev

# В третьем терминале: Запустить frontend
cd apps/web
pnpm dev
```

### Prisma команды

```bash
cd apps/server

# Сгенерировать Prisma Client
pnpm db:generate

# Применить схему к БД
pnpm db:push

# Заполнить БД тестовыми данными
pnpm db:seed

# Открыть Prisma Studio
pnpm db:studio
```

## 🔍 Критерии приёмки (MVP)

- ✅ AC1: POST /requests создаёт запрос со статусом "new"
- ✅ AC2: GET /requests?status=new возвращает активные запросы
- ✅ AC3: POST /assignments назначает волонтёра и меняет статус на "assigned"
- ✅ AC4: PUT /assignments/:id меняет статус на "completed"
- ✅ AC5: POST /reviews создаёт отзыв и обновляет рейтинг волонтёра

## 📝 Переменные окружения

См. `.env.example` для полного списка переменных окружения.

## 📄 Документация

Полная документация проекта находится в папке `task_01/`:
- `R1_DataModel_and_API.md` - Модели данных и API
- `R1_ERD.md` - ER-диаграмма
- `R1_Routes.md` - User flows и маршруты
- `R1_Roles_and_Actions.md` - Роли и действия
- `R1_Matrix_of_Rights.md` - Матрица прав доступа
- `R1_Cards.md` - Валидации и карточки

## 📜 Лицензия

MIT

## 👥 Авторы

Курсовой проект по дисциплине «Веб-Технологии»
