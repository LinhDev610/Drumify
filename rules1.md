# Drumify AI Coding Rules (Deterministic)

This document focuses on explaining the specific purpose of each architectural component — why it is needed, what it does, and how the code looks in practice. The architecture follows a layer-first approach so that Repositories and Models can be easily shared across multiple features without duplication or complex cross-import issues.

## 0) Priority Order

Apply rules in this order:
1. User explicit instruction
2. Section 1 (AI Behavior Rules)
3. Section 6 (Forbidden Actions)
4. Sections 2-5
5. Style preferences

Conflict handling:
- If rules conflict, follow higher priority and state the trade-off.
- If requirements are unclear, ask before coding.
- If change may break production behavior, warn and request confirmation before coding.

Examples:
- User asks to rename API response from `result` to `data` but rules forbid contract changes -> ask for explicit approval and warn about frontend impact.
- Task says "fix one UI bug", but request implies DB schema update -> ask before touching backend model/migration.

## 1) AI Behavior Rules (Strict)

1. Architecture changes
- MUST ask for explicit approval before changing architecture, layer boundaries, folder strategy, route/security flow, persistence model, API contract shape, DTO schema, top-level folders, or dependencies.
- MUST NOT apply those changes without approval.

2. Reuse-first policy
- MUST search for reusable components/hooks/services/DTOs/mappers/utilities before creating new code.
- MUST create new abstractions only if no suitable reusable option exists.

3. Duplicate prevention
- MUST NOT create duplicate files or parallel implementations with overlapping responsibility.
- MUST NOT create `*Copy`, `*New`, `*Temp`, or versioned duplicate files.

4. Naming/style preservation
- MUST follow existing naming conventions and project style exactly.
- MUST align new code with patterns already used in the target module.

5. Major change communication
- MUST explain major change plan and wait for confirmation before implementation.
- Major change = cross-module refactor, cross backend+frontend contract change, auth/security change, route hierarchy change, persistence model change, dependency addition.

6. Dependency policy
- MUST NOT add dependencies unless strictly required.
- If required, MUST justify why existing dependencies are insufficient.

7. File scope policy
- MUST modify/create only files required by the request.
- MUST NOT add extra docs/config/scaffolding/helper files unless requested.
- Exception: minimal required supporting edits for compile/runtime integrity (imports, registration, wiring, DI).

8. No requirement guessing
- MUST NOT invent endpoints, DTO fields, enums, roles, groups, statuses, or business rules.
- If unknown, MUST ask or follow existing model patterns exactly.

Examples:
- Need product list for admin: reuse `warehouseService.fetchWarehouseProducts()` instead of creating `getAdminProductsV2()`.
- Need new helper logic used once: keep it local; do not create extra utility file unless reused.
- Need architecture change (new module/folder): provide plan and wait for user confirmation first.

## 2) Backend Rules

1. Layering
- MUST keep `controller -> service -> repository` boundaries.
- Controllers MUST be transport-only.
- Services MUST contain business logic and orchestration.
- Repositories MUST contain persistence/query logic.

2. DTO contract
- Controllers MUST use DTOs for all I/O (`*Request`, `*Response`).
- MUST NOT expose entities directly in API responses.
- Request DTOs MUST be validated at boundary (`@Valid` + Jakarta constraints).

3. Service/repository behavior
- Service write flows touching multiple entities MUST use `@Transactional`.
- Repeated business checks SHOULD be extracted into private helpers.
- Aggregate reads requiring related data SHOULD use repository fetch strategies (`@Query` + `JOIN FETCH`) to avoid lazy-loading issues.

4. Exceptions and errors
- Business/domain failures MUST throw `AppException(ErrorCode.X)`.
- Error mapping MUST remain centralized in `GlobalExceptionHandler`.
- MUST return consistent codes/messages and MUST NOT leak stack traces.
- MUST NOT swallow exceptions silently.

5. Security
- MUST preserve Keycloak JWT resource-server model.
- Protected operations MUST enforce authorization with `@PreAuthorize` using existing role/group style.
- MUST NOT weaken endpoint protection to pass flows/tests.

Examples:
- Correct: `OrderController` receives DTO, delegates to `OrderService`, returns `ApiResponse<OrderResponse>`.
- Incorrect: controller directly calls repository and returns `Order` entity.
- Correct: validation annotations on request DTO + business checks in service.

## 3) Frontend Rules

1. Component design
- Components MUST stay UI-focused.
- API and heavy data logic MUST live in services/hooks.
- Components SHOULD remain small and readable.

2. Routing/auth
- MUST preserve existing route/layout hierarchy (`MainLayout`, `AdminLayout`, guarded routes).
- Auth and permission checks MUST stay in `ProtectedRoute` / `RoleProtectedRoute`.

3. API access
- MUST use `frontend/src/configurations/httpCient.js` (`httpClient`) for HTTP calls.
- API calls MUST live in `frontend/src/services/*`.
- MUST reuse `unwrapResult`, `unwrapList`, `getErrorMessage` where applicable.
- Service return style MUST stay consistent within each module.

4. State and hooks
- Global cross-cutting state MUST use existing Contexts (`KeycloakAuth`, `Profile`, `Theme`).
- Feature/page state SHOULD stay local unless shared.
- Repeated async/filter/paging logic SHOULD be moved to reusable hooks in `frontend/src/hooks/*`.
- Reusable data hooks SHOULD expose `{ data, loading, error, refetch }` when relevant.

5. Forms and styling
- Forms MUST be controlled and explicitly validated before submit.
- Payloads MUST be normalized (`trim`, numeric conversion, optional fields handling).
- Styling MUST follow existing MUI + `sx` + token patterns (`--color-*`).
- SCSS modules MUST be used where already established.
- MUST NOT restyle unrelated screens during logic changes.

Examples:
- Correct: page calls function in `frontend/src/services/*` that uses `httpClient`.
- Incorrect: page component calls Axios directly.
- Correct: shared fetch/filter logic extracted to `frontend/src/hooks/*` when reused.

## 4) Naming Rules

1. General
- Names MUST be descriptive, unambiguous, domain-oriented.
- Avoid abbreviations unless already common in project.

2. Backend
- Class names: PascalCase.
- Layer suffixes REQUIRED: `*Controller`, `*Service`, `*Repository`, `*Mapper`.
- DTO suffixes REQUIRED: `*Request`, `*Response`.
- Method names MUST express intent.

3. Frontend
- Components/pages/layouts: PascalCase.
- Hooks: `useXxx`.
- Service functions: verb + domain.
- Constants: UPPER_SNAKE_CASE.

4. Legacy compatibility
- MUST preserve active legacy names unless user requests dedicated refactor (example: `httpCient.js`).
- MUST NOT perform spelling-only renames by default.

Examples:
- Backend: `ShipmentController`, `ShipmentService`, `ShipmentRepository`, `ShipmentResponse`.
- Frontend: `WarehouseWorkspace.jsx`, `useHomeProducts`, `fetchWorkflowOrders`, `WH_TAB_CONFIG`.
- Legacy: keep import path `configurations/httpCient.js` unless user explicitly asks to rename.

## 5) API Rules

1. Response format
- Backend responses MUST use `ApiResponse<T>` with payload in `result`.
- MUST NOT introduce inconsistent envelopes for existing domains.

2. Endpoint design
- MUST follow existing resource-oriented paths and HTTP verb semantics.

3. Validation contract
- Input validation MUST occur at DTO boundary.
- Business validation MUST occur in services.

4. Error/security contract
- Failures MUST map to `ErrorCode` consistently.
- Frontend MUST consume/display error messages via shared helpers.
- Protected endpoints MUST follow existing auth + authorization model.
- MUST NOT expose internal-only endpoints publicly.

Examples:
- Correct response: `{ code, message, result }` using `ApiResponse<T>`.
- Incorrect response for existing domain: raw array/object without envelope.
- Correct flow: request DTO validation in controller boundary, business validation in service.

## 5.1) Quality Gates (Before Final Output)

- Scope gate: only intended files changed; no unrelated churn.
- Contract gate: backend/frontend DTO and response usage aligned when both sides touched.
- Runtime gate: app wiring remains valid (imports, routes, registration, DI).
- Error-path gate: failure handling remains meaningful and non-breaking.

Examples:
- If backend field name changes, update corresponding frontend service/hook mapping in same task.
- If adding a guarded route, verify route wiring + guard usage remains consistent.

## 6) Forbidden Actions

AI MUST NOT:
- put business logic in controllers
- expose JPA entities directly via API
- bypass `ApiResponse<T>` contract in existing backend modules
- duplicate logic already available in hooks/services/utilities
- call Axios directly from pages/components when service modules are expected
- introduce new global state libraries unless explicitly requested
- bypass route guards or remove authorization for convenience
- hardcode secrets/tokens/credentials
- rename/move legacy files/folders as cleanup without explicit request
- run destructive git/repository operations without explicit request
- change API contract names/envelope/auth behavior without explicit approval
- create parallel feature implementations in new files
- leave TODO placeholders in production code unless explicitly requested

Examples:
- Forbidden: create `orderServiceNew.js` while `orderService.js` already owns the domain.
- Forbidden: replace `ApiResponse<T>` with custom response wrapper for only one endpoint.
- Forbidden: remove `@PreAuthorize` or guarded route checks to "make it work quickly".

