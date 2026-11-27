# Aforium Projects

React, TypeScript, and Vite workspace frontend.

## Run with the in-memory API

```sh
npm install
# Copy .env.example to .env.local (VITE_USE_MOCKS=true)
npm run dev
```

MSW starts before React mounts. Atlas Studio contains a Website redesign project, three members, four columns, twelve tasks, a USD budget, and expenses. Changes persist only in memory and reset on reload. Set `VITE_USE_MOCKS=false` and `VITE_API_BASE_URL` to your backend origin to use real requests. The MSW worker is not started in real mode.

## Contract and typed client

`openapi.yaml` is a provisional OpenAPI 3.1 contract, encoded as JSON (valid YAML). No TL-102 contract or endpoint specification was present in this checkout. Replace/reconcile this draft with TL-102 before treating endpoint coverage as final. The draft covers auth, workspaces/members, project listing/create/update/archive/restore, columns, tasks, budgets, and expenses.

```sh
npm run api:types
npm run build
npm run test:api
```

Generated types live in `src/apis/schema.d.ts`. Regenerate after each contract edit and commit the result. `api.request` constrains paths, methods, path parameters, request bodies, and response types to the generated contract. The existing project screen uses this client via `src/services/projectsApi.ts`; its model types also come from the generated schema. Compile-time assertions in `src/apis/client.typecheck.ts` check rejected calls.

The client in `src/apis/client.ts` holds access tokens in memory and sends cookies for refresh. Call `api.setAccessToken(session.accessToken)` after login. Concurrent 401 responses share a refresh, and each request retries once. Failed refresh or a second 401 clears the token and emits `auth:signout`; a future auth screen can subscribe to this event. `ApiError` exposes `status`, `code`, `message`, and optional `details`. Auth routes do not recursively refresh.

Mock handlers live in `src/apis/mocks`. Registration follows the contract; an operation without an implementation returns a loud 500. Every handler supports `X-Mock-Error: 400|401|403|404|409|500` for deterministic error scenarios. Missing resources, invalid input, duplicate project keys, and expired sessions also produce errors. Seed state can be restored with `resetMocks()` in tests.

The default workspace ID is `atlas-studio` in `src/apis/index.ts`; replace this with the selected workspace when workspace navigation is implemented. This app currently has a projects screen; the other API resources are ready for later screens.
