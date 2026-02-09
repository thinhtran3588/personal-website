# Development Guide

This guide provides step-by-step instructions for adding new features and creating new modules following the Clean Architecture patterns.

## Table of Contents

1. [Git Workflow](#git-workflow)
   - [Development Workflow](#development-workflow)
   - [Branch Naming](#branch-naming)
2. [Adding a New Feature](#adding-a-new-feature)
   - [Step 1: Identify the Module](#step-1-identify-the-module)
   - [Step 2: Create Domain Types](#step-2-create-domain-types-if-needed)
   - [Step 3: Create Use Case](#step-3-create-use-case)
   - [Step 4: Register Use Case](#step-4-register-use-case)
   - [Step 5: Create UI Components](#step-5-create-ui-components)
   - [Step 6: Add Route](#step-6-add-route)
   - [Step 7: Write Tests](#step-7-write-tests)
3. [Creating a New Module](#creating-a-new-module)
   - [Module Structure](#module-structure)
   - [Step-by-Step](#step-by-step)
4. [Common Patterns](#common-patterns)
   - [Use Case Pattern](#use-case-pattern)
   - [Form with Validation](#form-with-validation)
   - [Interface Implementation](#interface-implementation)
5. [Testing](#testing)

## Git Workflow

### Development Workflow

```mermaid
flowchart TD
    Start([Start]) --> CheckBranch{Current branch?}
    CheckBranch -->|main/develop| SwitchDevelop[git checkout develop]
    CheckBranch -->|feature branch| Develop
    SwitchDevelop --> FetchPull[git fetch && git pull]
    FetchPull --> CreateBranch[Create feature/fix branch]
    CreateBranch --> Develop[Develop & Write Tests]
    Develop --> Validate[npm run validate]
    Validate --> Pass{Pass?}
    Pass -->|No| Develop
    Pass -->|Yes| Commit[Commit & Push]
    Commit --> PRExists{PR exists?}
    PRExists -->|No| CreatePR[Create PR to develop]
    PRExists -->|Yes| Review
    CreatePR --> Review{Approved?}
    Review -->|No| Develop
    Review -->|Yes| Merge[Squash Merge]
    Merge --> Done([Done])

    style Start fill:#1565c0,color:#fff
    style Done fill:#2e7d32,color:#fff
    style CreateBranch fill:#ef6c00,color:#fff
    style Merge fill:#00838f,color:#fff
```

### Workflow Steps

#### Starting New Work

1. **Create Feature/Fix Branch**
   ```bash
   git checkout develop
   git fetch origin && git pull origin develop
   git checkout -b feature/your-feature-name   # or fix/your-bug-fix
   ```

#### Continuing Existing Work

1. **If already on feature branch**, continue development directly.

#### Development Cycle

2. **Develop and Validate**
   ```bash
   # Make changes, write tests
   npm run validate  # Must pass before committing (lint + format + tests with 100% coverage)
   ```

3. **Commit and Push**
   ```bash
   git add . && git commit -m "feat: description"
   git push -u origin feature/your-feature-name
   ```

4. **Create PR** targeting `develop` branch (if not already created), then squash merge after approval.

### Branch Naming

| Type | Pattern | Example |
|------|---------|---------|
| New feature | `feature/description` | `feature/add-user-profile` |
| Bug fix | `fix/description` | `fix/login-validation` |
| Hotfix | `hotfix/description` | `hotfix/security-patch` |

## Adding a New Feature

### Step 1: Identify the Module

Determine which module the feature belongs to:
- `auth` - Authentication features
- `books` - Book CRUD operations
- `settings` - User settings
- `landing-page` - Public pages
- Or create a new module (see [Creating a New Module](#creating-a-new-module))

### Step 2: Create Domain Types (if needed)

Add types and schemas in `src/modules/{module}/domain/`:

```typescript
// domain/types.ts
export type NewFeatureData = {
  id: string;
  name: string;
};

// domain/schemas.ts
import { z } from "zod";

export const newFeatureSchema = z.object({
  name: z.string().min(1, "Name is required"),
});

export type NewFeatureInput = z.infer<typeof newFeatureSchema>;
```

### Step 3: Create Use Case

Add use case in `src/modules/{module}/application/`:

```typescript
// application/create-feature-use-case.ts
import { BaseUseCase } from "@/common/utils/base-use-case";
import type { FeatureRepository } from "@/modules/{module}/domain/interfaces";

type Input = { userId: string; data: NewFeatureInput };
type Output = { success: boolean };

export class CreateFeatureUseCase extends BaseUseCase<Input, Output> {
  constructor(private readonly repository: FeatureRepository) {
    super();
  }

  async execute(input: Input): Promise<Output> {
    await this.repository.create(input.userId, input.data);
    return { success: true };
  }
}
```

### Step 4: Register Use Case

Update `src/modules/{module}/module-configuration.ts`:

```typescript
import { asFunction } from "awilix";
import { CreateFeatureUseCase } from "./application/create-feature-use-case";

export function registerModule(container: AwilixContainer<object>): void {
  container.register({
    createFeatureUseCase: asFunction(
      (cradle) => new CreateFeatureUseCase(cradle.featureRepository)
    ).singleton(),
  });
}
```

### Step 5: Create UI Components

Add page in `src/modules/{module}/presentation/pages/{page}/`:

```typescript
// presentation/pages/new-feature/page.tsx
"use client";

import { useContainer } from "@/common/hooks/use-container";

export function NewFeaturePage() {
  const { createFeatureUseCase } = useContainer();
  // ... component logic
}
```

### Step 6: Add Route

Create route in `app/[locale]/`:

```typescript
// app/[locale]/(main)/new-feature/page.tsx
import { NewFeaturePage } from "@/modules/{module}/presentation/pages/new-feature/page";

export default function Page() {
  return <NewFeaturePage />;
}
```

### Step 7: Write Tests

Add tests in `src/__tests__/modules/{module}/`:

```typescript
// __tests__/modules/{module}/application/create-feature-use-case.test.ts
describe("CreateFeatureUseCase", () => {
  it("creates feature successfully", async () => {
    // ... test implementation
  });
});
```

## Creating a New Module

### Module Structure

```text
src/modules/{module-name}/
├── domain/
│   ├── types.ts              # Domain types
│   ├── schemas.ts            # Zod validation schemas
│   └── interfaces.ts         # Service/Repository interfaces
├── application/
│   └── {use-case}-use-case.ts
├── infrastructure/
│   ├── services/             # External service implementations
│   └── repositories/         # Data access implementations
├── presentation/
│   ├── components/           # Module-shared components
│   ├── hooks/                # Module hooks (Zustand stores, etc.)
│   └── pages/
│       └── {page}/
│           ├── page.tsx
│           └── components/   # Page-specific components
├── utils/                    # Module utilities
└── module-configuration.ts   # DI registration
```

### Step-by-Step

1. **Create folder structure** following the template above

2. **Define domain** (`domain/types.ts`, `domain/schemas.ts`, `domain/interfaces.ts`)

3. **Implement infrastructure** (services/repositories that implement interfaces)

4. **Create use cases** in `application/`

5. **Register in DI container** (`module-configuration.ts`):
   ```typescript
   export function registerModule(container: AwilixContainer<object>): void {
     container.register({
       // Register services/repositories
       featureRepository: asFunction(
         (cradle) => new FirestoreFeatureRepository(cradle.getFirestoreInstance)
       ).singleton(),
       // Register use cases
       createFeatureUseCase: asFunction(
         (cradle) => new CreateFeatureUseCase(cradle.featureRepository)
       ).singleton(),
     });
   }
   ```

6. **Register module** in `src/application/register-container.ts`:
   ```typescript
   import { registerModule as registerFeatureModule } from "@/modules/feature/module-configuration";
   
   export function registerContainer(container: AwilixContainer<object>): void {
     // ... existing registrations
     registerFeatureModule(container);
   }
   ```

7. **Create presentation layer** (pages, components, hooks)

8. **Add routes** in `app/[locale]/`

9. **Write tests** mirroring the module structure in `src/__tests__/`

## Common Patterns

### Use Case Pattern

```typescript
export class MyUseCase extends BaseUseCase<Input, Output> {
  constructor(private readonly service: ServiceInterface) {
    super();
  }

  async execute(input: Input): Promise<Output> {
    // Orchestrate the flow
    return this.service.doSomething(input);
  }
}
```

### Form with Validation

```typescript
const form = useForm<FormData>({
  resolver: zodResolver(formSchema),
  defaultValues: { name: "" },
});

const onSubmit = async (data: FormData) => {
  await useCase.execute(data);
};
```

### Resolving Use Cases

```typescript
// In components
const { myUseCase } = useContainer();
await myUseCase.execute(input);
```

### Interface Implementation

```typescript
// domain/interfaces.ts
export interface FeatureRepository {
  create(userId: string, data: FeatureData): Promise<void>;
  get(userId: string, id: string): Promise<Feature | null>;
}

// infrastructure/repositories/firestore-feature-repository.ts
export class FirestoreFeatureRepository implements FeatureRepository {
  // Implementation
}
```

## Testing

### Quick Reference

| Command | Purpose |
|---------|---------|
| `npm test` | Run all tests |
| `npm run test:coverage` | Run with coverage report |
| `npm run validate` | Full validation (includes tests) |

### Key Points

- **100% code coverage** required
- Tests mirror source structure in `src/__tests__/`
- Mock services/repositories at the boundary

