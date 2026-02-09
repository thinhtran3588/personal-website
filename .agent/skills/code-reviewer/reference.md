# Code Reviewer — Extended Reference

Use this when you need a deeper checklist or project-specific reminders. The main instructions are in [SKILL.md](SKILL.md).

## Extended bad-code checklist

### Logic

- [ ] All branches of conditionals are reachable and tested (including `else`, `default`, `??`, `?.`).
- [ ] Loops have correct termination and no infinite loops on edge input.
- [ ] Async code: no unhandled rejections; loading/error states updated correctly.
- [ ] Forms: prevent double submit; reset or redirect after success as specified.
- [ ] Lists: handle empty, single item, and pagination boundaries.

### Security (extra)

- [ ] No `dangerouslySetInnerHTML` or `eval` with user input without sanitization.
- [ ] Auth errors do not leak whether an identifier exists (e.g. “Invalid credentials” vs “User not found”).
- [ ] Sensitive operations require explicit authorization checks.
- [ ] File/upload handling: type and size checks; no path traversal.

### Performance (extra)

- [ ] No `useEffect` that runs on every render without correct dependency array.
- [ ] Expensive computations or filters in list components consider `useMemo` or moving logic off render path.
- [ ] Event handlers that do heavy work consider debounce/throttle.
- [ ] Dynamic imports for heavy or below-the-fold components where appropriate.

### React / Next.js

- [ ] No state that could be derived from props or other state (single source of truth).
- [ ] Keys in lists are stable and unique (no index when list is reordered or filtered).
- [ ] Client components are only where needed (hooks, browser APIs, interactivity).
- [ ] Server/client boundary is clear; no accidental async or server-only APIs in client components.

---

## Convention reminders (project)

- **Import type**: Every type-only import must use `import type`.
- **Comments**: Only for “why”; remove or refactor “what” comments.
- **Inline objects**: Single-use argument objects are created inline.
- **Validation**: Create = validate then API; Update = validate then “has changes?” then API.
- **Layers**: Domain (no framework/infra); use-cases (interfaces only); pages in `src/modules/{module}/pages/`.
- **DI**: Use-cases resolved via `useContainer()`; register new types in `module-configuration.ts` and `register-container.ts`.

---

## Test anti-patterns (avoid)

- Testing that a component “renders” or “matches snapshot” with no behavior assertion.
- Asserting on internal state (e.g. `expect(component.state.x).toBe(y)`).
- Testing implementation details (e.g. calling a private method or checking hook call count without behavior).
- One huge test that does many actions and many assertions (hard to debug; split by behavior).
- Relying on real timers or network in unit/component tests (use fake timers and mocks).
- Missing tests for: validation errors, 404/empty, loading, and error UI.
- Tests that only pass because mocks are too loose (e.g. never asserting on call args or return values).

---

## Test coverage reminders

- **Branches**: Every `if/else`, ternary, `&&`, `||`, `??`, `?.` path must be covered.
- **Error paths**: `catch` blocks, error states, and error UI must have tests.
- **Boundaries**: Min/max length, zero, empty array, null/undefined as inputs.
- **Files**: New or modified production files should have a corresponding test file (or be covered by an existing test).

---

## Project test layout (this repo)

- Tests live under `src/__tests__/`, mirroring `src/` (e.g. `src/__tests__/modules/books/`).
- Naming: `*.test.ts` or `*.test.tsx`; match source name (e.g. `book-form.test.tsx` for `book-form.tsx`).
- Use Vitest, React Testing Library, and project `render`/setup from `src/__tests__/test-utils/`.
- Run: `npm test`, `npm run test:coverage`, `npm run validate` (includes coverage).

When in doubt, prefer the project’s [testing-guide.md](../../docs/testing-guide.md) and [architecture.md](../../docs/architecture.md) for authoritative rules.
