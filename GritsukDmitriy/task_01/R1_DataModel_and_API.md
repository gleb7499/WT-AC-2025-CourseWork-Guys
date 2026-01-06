# Вариант 24 — Ключевые сущности, связи и API (эскиз)

Сущности (основные)

- User
  - id: UUID
  - username: string (unique)
  - password_hash: string
  - role: enum [admin, user]

- Roadmap
  - id: UUID
  - title: string
  - description: string
  - created_at: datetime

- Step
  - id: UUID
  - roadmap_id: reference -> Roadmap.id
  - title: string
  - description: string
  - order: number

- Resource
  - id: UUID
  - step_id: reference -> Step.id
  - title: string
  - url: string
  - type: enum [article, video, course]

- Progress
  - id: UUID
  - user_id: reference -> User.id
  - step_id: reference -> Step.id
  - completed: boolean
  - completed_at: datetime

Связи (ER-эскиз)

- Roadmap 1..* Step (дорожная карта содержит шаги)
- Step 1..* Resource (шаг содержит ресурсы)
- User 1..* Progress (пользователь имеет прогресс)
- Step 1..* Progress (шаг может быть пройден многими пользователями)

Обязательные поля и ограничения (кратко)

- unique(User.username)
- Step.roadmap_id → Roadmap.id (FK, not null)
- Resource.step_id → Step.id (FK, not null)
- Progress.user_id → User.id (FK, not null)
- Progress.step_id → Step.id (FK, not null)
- unique(Progress.user_id, Progress.step_id)

API — верхнеуровневые ресурсы и операции

- /users
  - GET /users (admin)
  - POST /users (admin)
  - GET /users/{id}
  - PUT /users/{id}
  - DELETE /users/{id}

- /roadmaps
  - GET /roadmaps (list)
  - POST /roadmaps (admin)
  - GET /roadmaps/{id}
  - PUT /roadmaps/{id} (admin)
  - DELETE /roadmaps/{id} (admin)

- /steps
  - GET /steps?roadmap_id= (filter by roadmap)
  - POST /steps (admin)
  - GET /steps/{id}
  - PUT /steps/{id} (admin)
  - DELETE /steps/{id} (admin)

- /resources
  - GET /resources?step_id= (filter by step)
  - POST /resources (admin)
  - GET /resources/{id}
  - PUT /resources/{id} (admin)
  - DELETE /resources/{id} (admin)

- /progress
  - GET /progress?user_id=&roadmap_id= (filter)
  - POST /progress (mark step as completed)
  - DELETE /progress/{id} (unmark)

---

## Подробные операции API, схемы и поведение

Общие принципы

- Ответы в формате: `{ "status": "ok" | "error", "data"?: ..., "error"?: {code, message, fields?} }`
- Пагинация: `limit` и `offset` (по умолчанию limit=50).
- Аутентификация: `Authorization: Bearer <jwt>`; роли: `admin`, `user`.

Примеры ошибок (JSON)

```json
{
  "status": "error",
  "error": { "code": "validation_failed", "message": "Validation failed", "fields": { "title": "required" } }
}
```

Auth

- POST `/auth/register` — `{username, password}` → `201 {id, username, role}`
- POST `/auth/login` — `{username, password}` → `200 {accessToken, refreshToken, user}`
- POST `/auth/refresh` — `{refreshToken}` → `200 {accessToken}`

Users

- GET `/users?limit=&offset=` — Admin
- GET `/users/{id}` — Admin или self
- POST `/users` — Admin (payload: `{username, password, role?}`)
- PUT `/users/{id}` — Admin или self (частичное обновление)
- DELETE `/users/{id}` — Admin

Roadmaps

- GET `/roadmaps?limit=&offset=` — список дорожных карт
- POST `/roadmaps` — Admin (payload: `{title, description}`)
- GET `/roadmaps/{id}` — детали, включает список шагов
- PUT `/roadmaps/{id}` — Admin
- DELETE `/roadmaps/{id}` — Admin

Steps

- GET `/steps?roadmap_id=&limit=&offset=` — список шагов для roadmap
- POST `/steps` — Admin `{roadmap_id, title, description, order}` → `201 {id}`
- GET `/steps/{id}` — детали шага, включает ресурсы
- PUT `/steps/{id}` — Admin
- DELETE `/steps/{id}` — Admin

Resources

- GET `/resources?step_id=&limit=&offset=` — список ресурсов для шага
- POST `/resources` — Admin `{step_id, title, url, type}` → `201 {id}`
- GET `/resources/{id}` — детали ресурса
- PUT `/resources/{id}` — Admin
- DELETE `/resources/{id}` — Admin

Progress (трекинг прогресса)

- GET `/progress?user_id=&roadmap_id=` — прогресс пользователя

  - Response: `{completed_steps: [...], total_steps: n, percentage: x}`

- POST `/progress` — отметить шаг как выполненный

  - Payload: `{step_id}`
  - Response: `201 {id, step_id, completed: true, completed_at}`

- DELETE `/progress/{id}` — снять отметку о выполнении
