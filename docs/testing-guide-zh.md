# Testing Guide

本文档描述与 [Architecture](./architecture-zh.md) 中定义的 Clean Architecture patterns 对齐的测试方式。

## 目录

1. [概览](#概览)
2. [测试配置](#测试配置)
3. [测试组织](#测试组织)
4. [测试类型](#测试类型)
5. [编写测试](#编写测试)
   - [Use Case Tests](#use-case-tests)
   - [Component Tests](#component-tests)
   - [Schema Tests](#schema-tests)
6. [测试工具](#测试工具)
7. [Coverage 要求](#coverage-要求)
8. [运行测试](#运行测试)
9. [最佳实践](#最佳实践)

## 概览

项目使用 **Vitest** 进行测试，**React Testing Library** 用于 UI 测试。

### 核心原则

1. **100% Coverage 为必需** - 所有 lines、functions、branches 和 statements 都必须覆盖
2. **测试行为而非实现** - 关注结果而非内部细节
3. **隔离优先** - Mock 外部服务与依赖
4. **镜像源码结构** - Tests 遵循与源码相同的目录结构

## 测试配置

配置在 `vitest.config.ts` 中：

- **Environment**：`jsdom` 提供 DOM APIs
- **Setup file**：`src/__tests__/test-utils/setup.ts`
- **Coverage thresholds**：所有指标 100%
- **Path aliases**：与 `@/` → `src/` 对齐

## 测试组织

Tests 在 `src/__tests__/` 下镜像源码结构：

```text
src/__tests__/
├── application/              # 应用级测试
│   ├── components/           # AppInitializer 测试
│   └── register-container.test.ts
├── common/
│   ├── components/           # 共享组件测试
│   ├── hooks/                # 共享 hook 测试
│   └── utils/                # 工具测试
├── modules/
│   └── {module}/
│       ├── domain/           # Schema 测试
│       ├── application/      # Use case 测试
│       └── presentation/
│           ├── components/   # 组件测试
│           ├── hooks/        # Hook 测试
│           └── pages/        # 页面测试
└── test-utils/
    ├── setup.ts              # 全局 setup
    └── ...                   # 测试 helpers
```

### 文件命名

- 测试文件以 `.test.ts` 或 `.test.tsx` 结尾
- 与源文件名对应：`sign-in-form.tsx` → `sign-in-form.test.tsx`

## 测试类型

### Unit Tests

**目的**：无需 React 渲染即可测试纯逻辑。

**目标**：
- Domain schemas（`domain/schemas.ts`）
- Use cases（`application/*-use-case.ts`）
- Utilities（`utils/`）

### Component Tests

**目的**：验证 UI 行为与用户交互。

**目标**：
- Page components（`presentation/pages/`）
- 共享组件（`presentation/components/`、`common/components/`）
- 带 validation 的表单

### Integration Tests

**目的**：验证跨层流程。

**目标**：
- Component + use case 协作
- 错误处理流程
- 模块专属流程（settings、landing-page）

## 编写测试

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

  it("用正确数据调用 repository", async () => {
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
  it("渲染主题选项", async () => {
    const user = userEvent.setup();
    render(<ThemeSelector />);

    await user.click(screen.getByRole("button", { name: /theme/i }));

    expect(screen.getByRole("menuitem", { name: /light/i })).toBeInTheDocument();
    expect(screen.getByRole("menuitem", { name: /dark/i })).toBeInTheDocument();
    expect(screen.getByRole("menuitem", { name: /system/i })).toBeInTheDocument();
  });

  it("选择选项时更新主题", async () => {
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
  it("验证正确输入", () => {
    const result = userSettingsSchema.safeParse({
      locale: "en",
      theme: "dark",
    });
    
    expect(result.success).toBe(true);
  });

  it("拒绝无效主题", () => {
    const result = userSettingsSchema.safeParse({
      locale: "en",
      theme: "invalid",
    });
    
    expect(result.success).toBe(false);
  });

  it("接受部分输入", () => {
    const result = userSettingsSchema.safeParse({
      locale: "en",
    });
    
    expect(result.success).toBe(true);
  });
});
```

## 测试工具

共享 helpers 在 `src/__tests__/test-utils/`：

| 文件 | 用途 |
|------|------|
| `setup.ts` | 全局 setup（jest-dom、mocks、environment） |
| `render.tsx` | 带 providers 的自定义 render（如需要） |
| `fixtures.ts` | 共享测试数据 |

### Setup 示例

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

## Coverage 要求

以下指标**必须 100%**：

| 指标 | 阈值 |
|------|------|
| Lines | 100% |
| Functions | 100% |
| Branches | 100% |
| Statements | 100% |

### Branch Coverage

每个条件都必须测试：
- 三元运算符（`? :`）
- 逻辑运算符（`&&`、`||`）
- 可选链（`?.`）
- 空值合并（`??`）

### Coverage 排除项

仅对以下可排除覆盖：
- 纯类型定义
- 配置文件
- 测试工具本身

## 运行测试

```bash
npm test              # 运行所有测试
npm run test:watch    # Watch 模式
npm run test:coverage # 带 coverage 报告
npm run validate      # 完整 validation（包含测试）
```

## 最佳实践

1. **使用 Arrange-Act-Assert（AAA）模式**
   ```typescript
   it("做某事", () => {
     // Arrange
     const input = { ... };
     
     // Act
     const result = doSomething(input);
     
     // Assert
     expect(result).toBe(expected);
   });
   ```

2. **优先用 role/label 查询**而非 `data-testid`
   ```typescript
   // 好
   screen.getByRole("button", { name: /submit/i });
   screen.getByLabelText(/email/i);
   
   // 避免
   screen.getByTestId("submit-button");
   ```

3. **在边界处 mock** - mock services/repositories，而非 use cases
   ```typescript
   // 好 - mock service interface
   const mockService: FeatureService = { ... };
   
   // 避免 - mock 内部实现
   vi.mock("@/modules/feature/infrastructure/services/feature-service");
   ```

4. **测试错误情况** - 覆盖 validation 错误、API 失败、边界情况

5. **保持测试快速** - mock 外部调用，避免不必要的渲染

6. **每个测试一个断言焦点** - 如测试同一行为可有多个断言
