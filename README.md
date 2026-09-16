# Web Technologies | Engineering Portfolio

This repository presents a multi-project engineering portfolio created by Loginov Gleb during the Web Technologies course. It brings together a series of complete product implementations, from early requirements and system design through application development, testing, documentation, and delivery.

The collection is intentionally broad: each assignment explores a different product domain, while the consistent quality of the architecture, implementation, and documentation reflects one development process and one technical owner.

## Scope of ownership

I owned the full lifecycle of the projects represented here. My work covered:

- translating each brief into a clear product scope and set of user workflows;
- shaping the system architecture, data models, API contracts, roles, and permission boundaries;
- implementing the frontend, backend, persistence layer, and authentication flows;
- strengthening the applications with validation, error handling, security controls, seed data, and automated checks;
- producing the technical documentation, runbooks, reports, and evaluation-ready project structure.

Taken together, these projects show how I approach unfamiliar domains, choose an appropriate technology stack, and carry a product from an initial specification to a working, documented software system.

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

Each coursework brief has a dedicated directory that preserves the original assignment organization. A typical project contains:

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

This repository serves as both an academic record and a practical engineering portfolio of the systems I designed and delivered.

## License

This repository is available under the [Creative Commons Attribution-NonCommercial 4.0 International license](LICENSE). Non-commercial sharing and adaptation are permitted with attribution to Loginov Gleb; commercial use requires prior written permission.