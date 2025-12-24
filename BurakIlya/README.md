# CourseWork MVP — каркас

Минимальный каркас full-stack проекта:

- Backend: Node.js + Express + TypeScript
- Frontend: React + TypeScript + Vite
- DB: PostgreSQL (Prisma schema, без бизнес-таблиц)

## Требования

- Node.js 18+ (рекомендуется 20+)
- npm 9+
- PostgreSQL (локально)

## Быстрый старт

1) Установить зависимости:

```bash
npm install
```

1) Создать файл `.env` в корне по примеру `.env.example`.

2) Запуск dev (backend + frontend):

```bash
npm run dev
```

## Проверка

- Backend healthcheck: `GET http://localhost:4000/health`
- Frontend: Vite dev server (обычно `http://localhost:5173`)
