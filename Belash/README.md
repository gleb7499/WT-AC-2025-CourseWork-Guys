# News Aggregator "Без фейков"

Агрегатор новостей с системой модерации жалоб. Курсовой проект по дисциплине «Веб-Технологии».

## Технологический стек

### Backend
- Node.js + Express
- TypeScript
- Prisma ORM
- PostgreSQL
- JWT (jsonwebtoken)
- Zod (валидация)
- bcrypt (хеширование паролей)
- Winston (логирование)

### Frontend
- React 18
- TypeScript
- React Router
- Zustand (state management)
- Axios
- Vite

### DevOps
- Docker + Docker Compose
- pnpm (package manager)

## Структура проекта

```
Belash/
├── apps/
│   ├── server/          # Backend API
│   │   ├── src/
│   │   │   ├── controllers/
│   │   │   ├── routes/
│   │   │   ├── middleware/
│   │   │   ├── lib/
│   │   │   └── types/
│   │   └── prisma/      # Схема БД и миграции
│   └── web/             # Frontend SPA
│       └── src/
│           ├── pages/
│           ├── components/
│           ├── features/
│           ├── api/
│           └── shared/
├── task_01/             # Документация проекта
├── docker-compose.yml
└── .env.example
```

## Требования

- Node.js >= 18
- pnpm >= 8
- Docker и Docker Compose (для запуска с контейнерами)

## Быстрый старт

### Вариант 1: С Docker Compose (рекомендуется)

1. Скопируйте `.env.example` в `.env`:
```bash
cp .env.example .env
```

2. Запустите проект:
```bash
docker-compose up
```

Приложение будет доступно по адресам:
- Frontend: http://localhost:5173
- Backend API: http://localhost:3000

### Вариант 2: Локальная разработка

1. Установите зависимости:
```bash
pnpm install
```

2. Настройте переменные окружения:
```bash
cp .env.example .env
# Отредактируйте .env файл
```

3. Запустите PostgreSQL (или используйте Docker):
```bash
docker run -d \
  --name postgres \
  -e POSTGRES_PASSWORD=postgres \
  -e POSTGRES_DB=news_aggregator \
  -p 5432:5432 \
  postgres:15-alpine
```

4. Настройте базу данных:
```bash
cd apps/server
pnpm db:generate
pnpm db:push
pnpm db:seed
```

5. Запустите сервер и клиент:
```bash
# В корневой директории
pnpm dev
```

## Учетные записи по умолчанию

После выполнения seed будут созданы следующие пользователи:

- **Администратор**: `admin` / `admin123`
- **Модератор**: `moderator` / `moderator123`
- **Пользователь**: `user` / `user123`

## Функциональность

### Роли пользователей

#### Пользователь (user)
- Просмотр ленты новостей
- Фильтрация по тегам и источникам
- Просмотр детальной информации о статье
- Добавление/удаление статей в избранное
- Подача жалоб на статьи

#### Модератор (moderator)
- Все функции пользователя
- Просмотр списка жалоб
- Рассмотрение и закрытие жалоб
- Удаление статей по жалобам

#### Администратор (admin)
- Все функции модератора
- Управление пользователями (CRUD)
- Управление источниками (CRUD)
- Управление тегами (CRUD)

## API Endpoints

### Аутентификация
- `POST /api/auth/register` - Регистрация
- `POST /api/auth/login` - Вход
- `POST /api/auth/refresh` - Обновление токена

### Пользователи
- `GET /api/users` - Список пользователей (admin)
- `GET /api/users/:id` - Получить пользователя
- `POST /api/users` - Создать пользователя (admin)
- `PUT /api/users/:id` - Обновить пользователя
- `DELETE /api/users/:id` - Удалить пользователя (admin)

### Источники
- `GET /api/sources` - Список источников
- `GET /api/sources/:id` - Получить источник
- `POST /api/sources` - Создать источник (admin)
- `PUT /api/sources/:id` - Обновить источник (admin)
- `DELETE /api/sources/:id` - Удалить источник (admin)

### Лента новостей
- `GET /api/feed` - Список статей (с фильтрами)
- `GET /api/feed/:id` - Получить статью

### Теги
- `GET /api/tags` - Список тегов
- `GET /api/tags/:id` - Получить тег
- `POST /api/tags` - Создать тег (admin)
- `PUT /api/tags/:id` - Обновить тег (admin)
- `DELETE /api/tags/:id` - Удалить тег (admin)

### Избранное
- `GET /api/favorites` - Список избранного (user)
- `POST /api/favorites` - Добавить в избранное (user)
- `DELETE /api/favorites/:id` - Удалить из избранного (user)

### Жалобы
- `GET /api/reports` - Список жалоб (admin/moderator)
- `GET /api/reports/:id` - Получить жалобу
- `POST /api/reports` - Создать жалобу (user)
- `PUT /api/reports/:id` - Обновить статус жалобы (admin/moderator)

## Разработка

### Линтинг
```bash
pnpm lint
```

### Форматирование
```bash
pnpm format
```

### База данных

#### Создание миграции
```bash
cd apps/server
pnpm prisma migrate dev --name migration_name
```

#### Открыть Prisma Studio
```bash
cd apps/server
pnpm db:studio
```

## Безопасность

- Пароли хешируются с использованием bcrypt
- JWT токены с ограниченным временем жизни
- CORS настроен для работы с клиентом
- Helmet для защиты HTTP заголовков
- Валидация всех входных данных (Zod)
- Защита маршрутов по ролям

## Лицензия

MIT
