---
name: project-rules
description: General project rules and documentation references
---

# General Instructions

## Documentation References

**CRITICAL**: When making code changes, always refer to the project documentation:

| Document                                                      | Description                                                                                     |
| ------------------------------------------------------------- | ----------------------------------------------------------------------------------------------- |
| **[Architecture](../../../docs/architecture.md)**             | Clean Architecture layers, module structure, data flow, design patterns, and DI with Awilix     |
| **[Coding Conventions](../../../docs/coding-conventions.md)** | File naming, component props, App Router patterns, forms with Zod, and next-intl i18n           |
| **[Development Guide](../../../docs/development-guide.md)**   | Git workflow, branch naming, adding features, creating modules, and common patterns             |
| **[Testing Guide](../../../docs/testing-guide.md)**           | Vitest, React Testing Library, 100% coverage requirement, test organization, and best practices |

## Project Quick Reference

| Category      | Details                                                                                    |
| ------------- | ------------------------------------------------------------------------------------------ |
| **Framework** | Next.js (App Router), TypeScript (strict mode)                                             |
| **Source**    | `src/` — all code; `app/` — routing only                                                   |
| **Modules**   | `src/modules/{module}/` with `domain/`, `application/`, `infrastructure/`, `presentation/` |
| **DI**        | Awilix — `useContainer()` hook, `module-configuration.ts` per module                       |
| **Testing**   | Vitest with 100% coverage in `src/__tests__/`                                              |
| **UI**        | shadcn/ui, Tailwind CSS, Zustand, React Hook Form + Zod                                    |

## AI Agent Workflow

### Branch Management

**CRITICAL**: Before any code changes, you MUST:

1. Check current branch: `git branch --show-current`
2. If on `main`: switch to `develop` first: `git checkout develop`
3. If on `develop`: fetch and pull latest: `git fetch origin && git pull origin develop`
4. Create feature branch from `develop`: `git checkout -b <branch-name>`
5. **Never** commit directly to `main` or `develop`

**Always base feature branches on `develop`, never on `main`.**

For the detailed execution steps, refer to the **`branch-and-pr`** workflow in [branch-and-pr](../../workflows/branch-and-pr.md).

See [Development Guide](../../../docs/development-guide.md) for branch naming conventions.

### Commit and PR Rules

- **Request permission** before committing: show summary, ask "May I commit these changes?"
- **Auto-push** after commit: `git push -u origin <branch-name>`
- **Request permission** before creating PR: ask "May I create a Pull Request?"
- Use temp file for PR description to avoid shell escaping issues

### Validation

Run `npm run validate` after code changes (includes lint, format check, and tests with 100% coverage).

## Code Style Guidelines

### Import Type

Use `import type` for type-only imports:

```typescript
// ✅ Type-only import

// ✅ Runtime import
import { Button } from "./button";
import type { User } from "./types";
```

### Code Comments

- Don't comment obvious code — code should be self-documenting
- Comment **why**, not **what**
- Document non-obvious business logic or workarounds

### Object Creation

Create objects inline when used once:

```typescript
// ✅ Inline (used once)
return authApi.register({ email, password });

// ✅ Variable (used multiple times or modified)
const data = { email, password };
form.reset(data);
return authApi.register(data);
```

### Validation Order

1. Local validation first (Zod schema)
2. Check for updates (skip API if nothing changed)
3. Submit to API
