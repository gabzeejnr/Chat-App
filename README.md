# Chat App Monorepo

A TypeScript monorepo for a chat application with a React client, an Express API server, and a shared package for reusable types and utilities.

## Overview

This repository is split into three main packages:

- `apps/client` — Vite + React frontend for the chat experience
- `apps/server` — Express + Socket.IO backend and API layer
- `packages/shared` — common TypeScript models and shared logic

The app is designed around a social chat workflow with authentication, friend management, and real-time messaging support.

## Architecture

### Client

The frontend lives in `apps/client` and is built with:

- React 19
- Vite
- TypeScript
- React Router
- Socket.IO client
- Tailwind CSS

This app handles:

- registration and login
- protected routes and user sessions
- friend discovery and friend requests
- chat layout and user interface
- real-time socket connections

### Server

The backend lives in `apps/server` and is built with:

- Express 5
- TypeScript
- PostgreSQL via `pg`
- JWT-based authentication
- Socket.IO for real-time events
- Zod for request validation

This API handles:

- user registration and login
- session validation
- friend requests and friendships
- user and profile queries
- health checks and internal routes

### Shared package

The shared package at `packages/shared` provides common TypeScript exports and reusable logic used by the application.

## Repository structure

```text
chat-app/
├── apps/
│   ├── client/
│   │   ├── src/
│   │   ├── package.json
│   │   └── vite.config.ts
│   └── server/
│       ├── src/
│       ├── package.json
│       └── tsconfig.json
├── packages/
│   └── shared/
│       ├── src/
│       ├── package.json
│       └── tsconfig.json
├── package.json
├── package-lock.json
└── README.md
```

## Prerequisites

Before running the project, make sure you have:

- Node.js 18+ (recommended: current LTS)
- npm
- PostgreSQL database running locally or remotely

## Environment variables

Create a `.env` file at the project root for the server environment configuration.

Example:

```env
DATABASE_HOST=localhost
DATABASE_PORT=5432
DATABASE=chat_app
DATABASE_USER=postgres
DATABASE_PASSWORD=your_password
JWT_SECRET=super-secret-key
PORT=4000
```

The server uses `dotenv` and reads variables from the root `.env` file.

## Installation

From the repository root:

```bash
npm install
```

This installs the monorepo workspaces and their shared dependencies.

## Running the app

### Start the server

```bash
npm run dev:server
```

The API runs on:

- http://localhost:4000

### Start the client

```bash
npm run dev:client
```

The frontend runs on:

- http://localhost:5173

## Production builds

Build all workspace packages:

```bash
npm run build:server
npm run build:client
npm run build:shared
```

Or build the server only:

```bash
npm run build:server
```

## Useful scripts

From the root package:

```bash
npm run dev:client
npm run build:client
npm run lint:client
npm run preview:client

npm run dev:server
npm run build:server
npm run start:server
npm run watch:server
```

## Notes

- The project uses npm workspaces managed from the root `package.json`.
- Server authentication is JWT-based and enforced with middleware on protected routes.
- Socket.IO is configured with cookie-based authentication and a CORS allowlist for the Vite frontend.
- This repository is structured for scaling features across frontend, backend, and shared logic without duplication.

## Contributing

1. Create a branch for your change.
2. Keep frontend, backend, and shared code separated by package.
3. Run the relevant build or validation checks before submitting changes.
4. Keep environment variables documented and avoid committing secrets.

## License

This project currently uses the MIT license for the server package and is set up as a monorepo workspace. Check package-level metadata for any package-specific usage details.
