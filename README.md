# Web Technologies Coursework Portfolio

This repository contains a portfolio of full-stack coursework projects developed for the Web Technologies course. Each project was designed, implemented, documented, and prepared for local evaluation as a standalone application.

## What is included

The repository brings together projects covering several practical domains:

- news aggregation and content moderation;
- community support and volunteering;
- collaborative notes and knowledge sharing;
- job application and career tracking;
- personal progress and goal tracking;
- travel planning and trip sharing;
- bug tracking and team workflows;
- room booking and scheduling;
- learning platforms and help desk tools;
- configurable request and workflow management.

Most projects include requirements and design materials, a working `task_02` implementation, and dedicated documentation for the backend and frontend where the architecture is split into separate applications.

## Engineering focus

The projects demonstrate practical experience with:

- React, TypeScript, Vite, Next.js, and responsive SPA design;
- Node.js, Express, Flask, and REST API design;
- PostgreSQL, Prisma, SQLite, and MongoDB-backed persistence;
- JWT authentication with access and refresh tokens;
- role-based authorization and ownership checks;
- input validation, error handling, CORS, cookies, and security middleware;
- migrations, seed data, automated tests, Docker, and deployment-oriented configuration.

## Repository layout

Each participant has a dedicated directory. A typical project contains:

```text
<participant>/
├── task_01/        # Requirements and system design
├── task_02/        # Source code and run instructions
└── task_03/        # Coursework report and supporting materials
```

The README files inside the project directories describe the relevant stack, environment variables, startup commands, implemented functionality, and verification scenarios.

## Running a project

Open the README in the selected participant's `task_02` directory first. Requirements differ between projects, but the usual workflow is:

1. Install the required runtime and package manager.
2. Install dependencies from the project root.
3. Configure the documented environment variables.
4. Prepare the database and run migrations or seed scripts when provided.
5. Start the backend and frontend using the project-specific commands.

This repository is maintained as an academic engineering portfolio and as a record of complete coursework deliverables.