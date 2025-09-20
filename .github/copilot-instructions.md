 # Copilot Instructions for AI Coding Agents

## Project Overview
This monorepo contains a backend (Node.js/Express/PostgreSQL) and a placeholder for a frontend. The backend is structured for modularity and security, using Zod for validation, Argon2 for password hashing, JWT for authentication, and PostgreSQL for persistence.

## Key Backend Structure
- `src/server.js`: Express app entrypoint. Loads middleware, CORS, and health check.
- `src/config/env.js`: Loads and validates environment variables using Zod. Fails fast on invalid config.
- `src/config/db.js`: Exports a PostgreSQL connection pool using the validated DB URL.
- `src/routes/`: Route definitions. Example: `auth.routes.js` wires up authentication endpoints.
- `src/controllers/`: Request handlers. Example: `auth.controller.js` manages signup/login/logout.
- `src/services/`: Business logic. Example: `auth.service.js` handles password hashing, JWT, and user lookup.
- `src/repositories/`: DB access. Example: `user.repo.js` for user CRUD.
- `src/middlewares/`: Custom Express middleware (validation, error handling, rate limiting, auth).
- `src/schemas/`: Zod schemas for request validation.

## Developer Workflows
- **Start backend in dev mode:**
  ```sh
  cd backend && npm install && npm run dev
  ```
- **Environment:**
  - All config is loaded from `.env` and validated by Zod in `env.js`.
  - Required: `PORT`, `DB_URL`, `CORS_ORIGIN`, `JWT_SECRET`.
- **Database:**
  - Uses PostgreSQL. Connection via `env.DB_URL`.
  - Migrations are expected in `backend/db/migrations/` (not present in repo).
- **Testing:**
  - No test framework or scripts are present by default.
- **Frontend:**
  - No implementation yet. CORS is configured for `http://localhost:5173`.

## Project-Specific Patterns
- **Validation:** All incoming requests are validated using Zod schemas. See `validate.middleware.js` and `auth.schemas.js`.
- **Error Handling:** Centralized in `error.middleware.js`. Errors with a `status` property are sent as-is; others return 500.
- **Rate Limiting:** Per-route and global rate limiters are implemented using `express-rate-limit`.
- **Authentication:** JWT tokens are set as HTTP-only cookies. Use `requireAuth` middleware for protected routes.
- **Password Hashing:** Uses Argon2 for secure password storage.
- **Modularity:** Each concern (routes, controllers, services, repositories, middlewares) is separated for clarity and testability.

## Integration Points
- **External:**
  - PostgreSQL (via `pg`)
  - Argon2, JWT, Zod, express-rate-limit, helmet, cors
- **Internal:**
  - All business logic flows: Route → Middleware (validation, rate limit, auth) → Controller → Service → Repository

## Examples
- **Adding a new route:**
  1. Define a Zod schema in `schemas/`.
  2. Add a controller in `controllers/`.
  3. Wire up the route in `routes/`, using `validate` and any needed middleware.

- **Protecting a route:**
  Use `requireAuth(jwtSecret)` middleware from `auth.middleware.js`.

---

For questions about conventions or missing context, check the relevant directory or ask for clarification.