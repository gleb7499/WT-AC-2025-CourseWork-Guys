# CourseWork MVP — «Помощь рядом» (Вариант 43)

SPA + API для сервиса волонтёрской помощи. Роли: `admin`, `user`; волонтёр — это `user` с созданным `VolunteerProfile`. Проверка доступа на сервере по матрице прав.

## Архитектура

- Backend: Node.js + Express + TypeScript, PostgreSQL + Prisma, JWT, Zod
- Frontend: React + TypeScript + Vite, react-router, react-hook-form + zod, axios
- База: PostgreSQL (Prisma migrations + seed)

## Что умеет приложение

- Регистрация и вход (JWT)
- Категории помощи (CRUD только admin)
- Запросы помощи (создать/редактировать/удалить владелец или admin; удалить только если status=new)
- Волонтёры (user создаёт себе профиль; admin может любому; редактирование/удаление своего или admin)
- Назначения (волонтёр откликается на запрос `new`; admin может назначить любого; смена статуса; удаление admin)
- Отзывы (автор запроса после completed назначения; редактирование/удаление автором или admin)
- UI скрывает недоступные действия, но окончательная проверка на backend

## Требования окружения

- Node.js 18+ (рекомендуется 20+)
- npm 9+
- PostgreSQL локально

## Настройка и запуск

1) Установить зависимости (из корня):

```bash
npm install
```

2) Скопировать `.env.example` → `.env` в корне (VITE_API_URL) и в `apps/backend/.env` указать `DATABASE_URL`, `JWT_SECRET`, `PORT` (см. backend/README).
2) Применить миграции и seed (из корня):

```bash
npm run prisma:migrate -w backend
npm run prisma:seed -w backend
```

4) Запустить dev-сервера в монорепо:

```bash
npm run dev
```

Backend: <http://localhost:4000> · Frontend: <http://localhost:5173>

## Тестовые учётки (seed)

- <admin@example.com> / admin123
- <user@example.com> / user12345
- <volunteer@example.com> / volunteer123 (есть VolunteerProfile)

## Как тестировать сценарии

1) Войти под admin → создать/редактировать категории, просмотреть все запросы.
2) Войти под user → создать запрос помощи → убедиться, что удалить можно только пока status=new.
3) Войти под volunteer → откликнуться на запрос со статусом `new` → сменить статус назначения → вернуться под user и оставить отзыв после `completed`.
4) Проверить, что недоступные действия (например, создание категории под user) возвращают ошибку `Forbidden` и UI показывает сообщение.

Полные детали API и примеры curl смотрите в [apps/backend/README.md](apps/backend/README.md), UI сценарии — в [apps/frontend/README.md](apps/frontend/README.md).
