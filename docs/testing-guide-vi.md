# Testing Guide

Tài liệu này mô tả cách tiếp cận testing phù hợp với Clean Architecture patterns định nghĩa trong [Architecture](./architecture-vi.md).

## Mục lục

1. [Tổng quan](#tổng-quan)
2. [Cấu hình Test](#cấu-hình-test)
3. [Tổ chức Test](#tổ-chức-test)
4. [Loại Test](#loại-test)
5. [Viết Tests](#viết-tests)
   - [Use Case Tests](#use-case-tests)
   - [Component Tests](#component-tests)
   - [Schema Tests](#schema-tests)
6. [Test Utilities](#test-utilities)
7. [Yêu cầu Coverage](#yêu-cầu-coverage)
8. [Chạy Tests](#chạy-tests)
9. [Best Practices](#best-practices)

## Tổng quan

Dự án dùng **Vitest** cho testing với **React Testing Library** cho UI tests.

### Nguyên tắc chính

1. **100% Coverage bắt buộc** - Mọi lines, functions, branches và statements phải được cover
2. **Test Behavior, không phải Implementation** - Tập trung vào kết quả thay vì chi tiết nội bộ
3. **Isolation First** - Mock external services và dependencies
4. **Phản chiếu cấu trúc Source** - Tests theo cùng cấu trúc folder với source code

## Cấu hình Test

Cấu hình trong `vitest.config.ts`:

- **Environment**: `jsdom` cho DOM APIs
- **Setup file**: `src/__tests__/test-utils/setup.ts`
- **Coverage thresholds**: 100% cho mọi metrics
- **Path aliases**: Khớp với `@/` → `src/`

## Tổ chức Test

Tests phản chiếu cấu trúc source dưới `src/__tests__/`:

```text
src/__tests__/
├── application/              # Tests cấp app
│   ├── components/           # AppInitializer tests
│   └── register-container.test.ts
├── common/
│   ├── components/           # Tests shared component
│   ├── hooks/                # Tests shared hook
│   └── utils/                # Tests utility
├── modules/
│   └── {module}/
│       ├── domain/           # Tests schema
│       ├── application/      # Tests use case
│       └── presentation/
│           ├── components/   # Tests component
│           ├── hooks/        # Tests hook
│           └── pages/        # Tests page
└── test-utils/
    ├── setup.ts              # Setup toàn cục
    └── ...                   # Test helpers
```

### Quy ước đặt tên File

- Tests kết thúc bằng `.test.ts` hoặc `.test.tsx`
- Khớp tên file source: `sign-in-form.tsx` → `sign-in-form.test.tsx`

## Loại Test

### Unit Tests

**Mục đích**: Test logic thuần không cần render React.

**Targets**:
- Domain schemas (`domain/schemas.ts`)
- Use cases (`application/*-use-case.ts`)
- Utilities (`utils/`)

### Component Tests

**Mục đích**: Validate UI behavior và user interactions.

**Targets**:
- Page components (`presentation/pages/`)
- Shared components (`presentation/components/`, `common/components/`)
- Forms với validation

### Integration Tests

**Mục đích**: Validate flows qua nhiều layers.

**Targets**:
- Phối hợp Component + use case
- Error handling flows
- Flows riêng module (settings, landing-page)

## Viết Tests

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

  it("gọi repository với dữ liệu đúng", async () => {
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
  it("hiển thị các tùy chọn theme", async () => {
    const user = userEvent.setup();
    render(<ThemeSelector />);

    await user.click(screen.getByRole("button", { name: /theme/i }));

    expect(screen.getByRole("menuitem", { name: /light/i })).toBeInTheDocument();
    expect(screen.getByRole("menuitem", { name: /dark/i })).toBeInTheDocument();
    expect(screen.getByRole("menuitem", { name: /system/i })).toBeInTheDocument();
  });

  it("cập nhật theme khi chọn tùy chọn", async () => {
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
  it("validates đúng input", () => {
    const result = userSettingsSchema.safeParse({
      locale: "en",
      theme: "dark",
    });
    
    expect(result.success).toBe(true);
  });

  it("reject invalid theme", () => {
    const result = userSettingsSchema.safeParse({
      locale: "en",
      theme: "invalid",
    });
    
    expect(result.success).toBe(false);
  });

  it("chấp nhận input một phần", () => {
    const result = userSettingsSchema.safeParse({
      locale: "en",
    });
    
    expect(result.success).toBe(true);
  });
});
```

## Test Utilities

Shared helpers trong `src/__tests__/test-utils/`:

| File | Mục đích |
|------|----------|
| `setup.ts` | Setup toàn cục (jest-dom, mocks, environment) |
| `render.tsx` | Custom render với providers (nếu cần) |
| `fixtures.ts` | Shared test data |

### Ví dụ Setup

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

## Yêu cầu Coverage

**100% coverage là bắt buộc** cho:

| Metric | Threshold |
|--------|-----------|
| Lines | 100% |
| Functions | 100% |
| Branches | 100% |
| Statements | 100% |

### Branch Coverage

Mọi conditional phải được test:
- Ternary operators (`? :`)
- Logical operators (`&&`, `||`)
- Optional chaining (`?.`)
- Nullish coalescing (`??`)

### Coverage Exclusions

Chỉ bỏ qua test cho:
- Pure type definitions
- Configuration files
- Test utilities

## Chạy Tests

```bash
npm test              # Chạy tất cả tests
npm run test:watch    # Watch mode
npm run test:coverage # Với coverage report
npm run validate      # Full validation (bao gồm tests)
```

## Best Practices

1. **Dùng pattern Arrange-Act-Assert (AAA)**
   ```typescript
   it("làm gì đó", () => {
     // Arrange
     const input = { ... };
     
     // Act
     const result = doSomething(input);
     
     // Assert
     expect(result).toBe(expected);
   });
   ```

2. **Ưu tiên queries theo role/label** thay vì `data-testid`
   ```typescript
   // Tốt
   screen.getByRole("button", { name: /submit/i });
   screen.getByLabelText(/email/i);
   
   // Tránh
   screen.getByTestId("submit-button");
   ```

3. **Mock tại boundary** - Mock services/repositories, không mock use cases
   ```typescript
   // Tốt - mock service interface
   const mockService: FeatureService = { ... };
   
   // Tránh - mock internal implementation
   vi.mock("@/modules/feature/infrastructure/services/feature-service");
   ```

4. **Test error cases** - Cover validation errors, API failures, edge cases

5. **Giữ tests nhanh** - Mock external calls, tránh render không cần thiết

6. **Một assertion focus mỗi test** - Nhiều assertions được nếu test một behavior
