# Frontend

## Стек

- React 18 + TypeScript
- Vite 5
- React Router DOM (роутинг)
- React Hook Form + Zod (валидация форм)

## Настройка окружения

1) Скопировать `.env.example` в `.env` и задать переменные:

```
VITE_API_URL=http://localhost:4000
```

## Установка зависимостей

Из корня репо (workspace):

```
npm install
```

## Запуск dev-сервера

Из корня репо:

```
npm run dev -w frontend
```

Frontend будет доступен на `http://localhost:5173`

## Сборка production

```
npm run build -w frontend
```

## Структура

- `/login` — вход
- `/register` — регистрация
- `/` — список запросов помощи
- `/requests/new` — создать запрос
- `/requests/:id` — детали запроса и отклик волонтёра
- `/volunteer` — профиль волонтёра (создание/просмотр)
- `/assignments` — мои назначения (волонтёр)

## Тестовые пользователи (после seed)

- admin: <admin@example.com> / admin123
- user: <user@example.com> / user12345
- volunteer: <volunteer@example.com> / volunteer123

## Требования

- Backend должен быть запущен на `http://localhost:4000`
- В БД должны быть seed-данные (категории)
