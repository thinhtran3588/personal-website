# Testing Guide

This document describes the testing approach aligned with the Clean Architecture patterns defined in [Architecture](./architecture.md).

## Table of Contents

1. [Overview](#overview)
2. [Test Configuration](#test-configuration)
3. [Test Organization](#test-organization)
4. [Test Types](#test-types)
5. [Writing Tests](#writing-tests)
   - [Use Case Tests](#use-case-tests)
   - [Component Tests](#component-tests)
   - [Schema Tests](#schema-tests)
6. [Test Utilities](#test-utilities)
7. [Coverage Requirements](#coverage-requirements)
8. [Running Tests](#running-tests)
9. [Best Practices](#best-practices)

## Overview

The project uses **Vitest** for testing with **React Testing Library** for UI tests.

### Key Principles

1. **100% Coverage Mandatory** - All lines, functions, branches, and statements must be covered
2. **Test Behavior, Not Implementation** - Focus on outcomes rather than internal details
3. **Isolation First** - Mock external services and dependencies
4. **Mirror Source Structure** - Tests follow the same folder structure as source code

## Test Configuration

Configuration in `vitest.config.ts`:

- **Environment**: `jsdom` for DOM APIs
- **Setup file**: `src/__tests__/test-utils/setup.ts`
- **Coverage thresholds**: 100% across all metrics
- **Path aliases**: Aligned with `@/` → `src/`

## Test Organization

Tests mirror the source structure under `src/__tests__/`:

```text
src/__tests__/
├── application/              # App-level tests
│   ├── components/           # AppInitializer tests
│   └── register-container.test.ts
├── common/
│   ├── components/           # Shared component tests
│   ├── hooks/                # Shared hook tests
│   └── utils/                # Utility tests
├── modules/
│   └── {module}/
│       ├── domain/           # Schema tests
│       ├── application/      # Use case tests
│       └── presentation/
│           ├── components/   # Component tests
│           ├── hooks/        # Hook tests
│           └── pages/        # Page tests
└── test-utils/
    ├── setup.ts              # Global setup
    └── ...                   # Test helpers
```

### File Naming

- Tests end in `.test.ts` or `.test.tsx`
- Match source file name: `sign-in-form.tsx` → `sign-in-form.test.tsx`

## Test Types

### Unit Tests

**Purpose**: Test pure logic without React rendering.

**Targets**:
- Domain schemas (`domain/schemas.ts`)
- Use cases (`application/*-use-case.ts`)
- Utilities (`utils/`)

### Component Tests

**Purpose**: Validate UI behavior and user interactions.

**Targets**:
- Page components (`presentation/pages/`)
- Shared components (`presentation/components/`, `common/components/`)
- Forms with validation

### Integration Tests

**Purpose**: Validate flows across multiple layers.

**Targets**:
- Component + use case coordination
- Error handling flows
- Module-specific flows (settings, landing-page)

## Writing Tests

### Use Case Tests

```typescript
// src/__tests__/modules/{module}/application/create-feature-use-case.test.ts
import { CreateFeatureUseCase } from "@/modules/{module}/application/create-feature-use-case";
import type { FeatureRepository } from "@/modules/{module}/domain/interfaces";

describe("CreateFeatureUseCase", () => {
  let useCase: CreateFeatureUseCase;
  let mockRepository: FeatureRepository;

  beforeEach(() => {
    mockRepository = {
      create: vi.fn(),
      get: vi.fn(),
      update: vi.fn(),
      delete: vi.fn(),
    };
    useCase = new CreateFeatureUseCase(mockRepository);
  });

  it("calls repository with correct data", async () => {
    await useCase.execute({ userId: "user1", data: { name: "Feature" } });
    
    expect(mockRepository.create).toHaveBeenCalledWith(
      "user1",
      { name: "Feature" }
    );
  });
});
```

### Component Tests

```typescript
// src/__tests__/modules/settings/presentation/components/theme-selector.test.tsx
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { ThemeSelector } from "@/modules/settings/presentation/components/theme-selector";

describe("ThemeSelector", () => {
  it("renders theme options", async () => {
    const user = userEvent.setup();
    render(<ThemeSelector />);

    await user.click(screen.getByRole("button", { name: /theme/i }));

    expect(screen.getByRole("menuitem", { name: /light/i })).toBeInTheDocument();
    expect(screen.getByRole("menuitem", { name: /dark/i })).toBeInTheDocument();
    expect(screen.getByRole("menuitem", { name: /system/i })).toBeInTheDocument();
  });

  it("updates theme when option is selected", async () => {
    const user = userEvent.setup();
    render(<ThemeSelector />);

    await user.click(screen.getByRole("button", { name: /theme/i }));
    await user.click(screen.getByRole("menuitem", { name: /dark/i }));

    expect(screen.getByRole("button", { name: /theme: dark/i })).toBeInTheDocument();
  });
});
```

### Schema Tests

```typescript
// src/__tests__/modules/settings/domain/schemas.test.ts
import { userSettingsSchema } from "@/modules/settings/domain/schemas";

describe("userSettingsSchema", () => {
  it("validates correct input", () => {
    const result = userSettingsSchema.safeParse({
      locale: "en",
      theme: "dark",
    });
    
    expect(result.success).toBe(true);
  });

  it("rejects invalid theme", () => {
    const result = userSettingsSchema.safeParse({
      locale: "en",
      theme: "invalid",
    });
    
    expect(result.success).toBe(false);
  });

  it("accepts partial input", () => {
    const result = userSettingsSchema.safeParse({
      locale: "en",
    });
    
    expect(result.success).toBe(true);
  });
});
```

## Test Utilities

Shared helpers in `src/__tests__/test-utils/`:

| File | Purpose |
|------|---------|
| `setup.ts` | Global setup (jest-dom, mocks, environment) |
| `render.tsx` | Custom render with providers (if needed) |
| `fixtures.ts` | Shared test data |

### Example Setup

```typescript
// src/__tests__/test-utils/setup.ts
import "@testing-library/jest-dom/vitest";
import { vi } from "vitest";

// Mock browser APIs
Object.defineProperty(window, "matchMedia", {
  value: vi.fn().mockImplementation((query) => ({
    matches: false,
    media: query,
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
  })),
});
```

## Coverage Requirements

**100% coverage is mandatory** for:

| Metric | Threshold |
|--------|-----------|
| Lines | 100% |
| Functions | 100% |
| Branches | 100% |
| Statements | 100% |

### Branch Coverage

Every conditional must be tested:
- Ternary operators (`? :`)
- Logical operators (`&&`, `||`)
- Optional chaining (`?.`)
- Nullish coalescing (`??`)

### Coverage Exclusions

Skip tests only for:
- Pure type definitions
- Configuration files
- Test utilities themselves

## Running Tests

```bash
npm test              # Run all tests
npm run test:watch    # Watch mode
npm run test:coverage # With coverage report
npm run validate      # Full validation (includes tests)
```

## Best Practices

1. **Use Arrange-Act-Assert (AAA) pattern**
   ```typescript
   it("does something", () => {
     // Arrange
     const input = { ... };
     
     // Act
     const result = doSomething(input);
     
     // Assert
     expect(result).toBe(expected);
   });
   ```

2. **Prefer queries by role/label** over `data-testid`
   ```typescript
   // Good
   screen.getByRole("button", { name: /submit/i });
   screen.getByLabelText(/email/i);
   
   // Avoid
   screen.getByTestId("submit-button");
   ```

3. **Mock at the boundary** - Mock services/repositories, not use cases
   ```typescript
   // Good - mock the service interface
   const mockService: FeatureService = { ... };
   
   // Avoid - mocking internal implementation
   vi.mock("@/modules/feature/infrastructure/services/feature-service");
   ```

4. **Test error cases** - Cover validation errors, API failures, edge cases

5. **Keep tests fast** - Mock external calls, avoid unnecessary rendering

6. **One assertion focus per test** - Multiple assertions are fine if testing one behavior

