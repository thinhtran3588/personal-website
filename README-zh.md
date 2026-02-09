# Next.js Starter Kit

[![CI - Main](https://github.com/thinhtran3588/nextjs-starter-kit/actions/workflows/ci-main.yml/badge.svg?branch=main)](https://github.com/thinhtran3588/nextjs-starter-kit/actions/workflows/ci-main.yml)
[![codecov - Main](https://codecov.io/gh/thinhtran3588/nextjs-starter-kit/branch/main/graph/badge.svg)](https://codecov.io/gh/thinhtran3588/nextjs-starter-kit/tree/main)

[![CI - Develop](https://github.com/thinhtran3588/nextjs-starter-kit/actions/workflows/ci-develop.yml/badge.svg?branch=develop)](https://github.com/thinhtran3588/nextjs-starter-kit/actions/workflows/ci-develop.yml)
[![codecov - Develop](https://codecov.io/gh/thinhtran3588/nextjs-starter-kit/branch/develop/graph/badge.svg)](https://codecov.io/gh/thinhtran3588/nextjs-starter-kit/tree/develop)

![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?style=flat&logo=typescript&logoColor=white)
![Next.js](https://img.shields.io/badge/Next.js-000000?style=flat&logo=next.js&logoColor=white)
![React](https://img.shields.io/badge/React-61DAFB?style=flat&logo=react&logoColor=black)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=flat&logo=tailwind-css&logoColor=white)
![Radix UI](https://img.shields.io/badge/Radix_UI-161618?style=flat&logo=radix-ui&logoColor=white)
![Zod](https://img.shields.io/badge/Zod-3E67B1?style=flat&logo=zod&logoColor=white)
![React Hook Form](https://img.shields.io/badge/React_Hook_Form-EC5990?style=flat&logo=reacthookform&logoColor=white)
![Firebase](https://img.shields.io/badge/Firebase-DD2C00?style=flat&logo=firebase&logoColor=white)
![Vitest](https://img.shields.io/badge/Vitest-6E9F18?style=flat&logo=vitest&logoColor=white)
![Testing Library](https://img.shields.io/badge/Testing_Library-E33332?style=flat&logo=testing-library&logoColor=white)

[English](README.md) | [Tiếng Việt](README-vi.md) | **中文**

**[在线演示](https://nextjs-starter-kit.gemsignal.com/en)**

生产就绪的 Next.js 入门套件，采用 Clean Architecture 与模块化结构，支持可扩展的前端开发。

## 功能特性

- **Clean Architecture** — Domain、Application、Infrastructure、Presentation 四层，配合 Awilix DI
- **模块化结构** — 功能模块位于 `src/modules/`，边界清晰
- **技术栈** — Next.js App Router、TypeScript（strict）、Tailwind CSS、shadcn/ui（Radix）
- **表单与验证** — React Hook Form + Zod，类型安全的 schemas
- **状态与国际化** — Zustand 管理客户端状态，next-intl 支持 3 种语言（EN、VI、ZH）
- **测试** — Vitest + React Testing Library，要求 100% 覆盖率
- **Firebase** — Auth、Firestore 与 Analytics，抽象化接口便于更换 provider

## 快速开始

```bash
npm install
npm run dev
```

应用运行于 `http://localhost:3000`。

## 脚本命令

| 命令               | 说明                                |
| ------------------ | ----------------------------------- |
| `npm run dev`      | 启动开发服务器                      |
| `npm run build`    | 构建生产版本                        |
| `npm run validate` | 运行 lint、格式检查和带覆盖率的测试 |

## 文档

| 文档                                             | 说明                                             |
| ------------------------------------------------ | ------------------------------------------------ |
| [架构](docs/architecture-zh.md)                  | 层级结构、数据流、设计模式、Awilix 依赖注入      |
| [编码规范](docs/coding-conventions-zh.md)        | 文件命名、App Router 模式、表单、国际化          |
| [开发指南](docs/development-guide-zh.md)         | Git 工作流、添加功能、创建模块                   |
| [测试指南](docs/testing-guide-zh.md)             | 测试组织、覆盖率、最佳实践                       |
| [Firebase 集成](docs/firebase-integration-zh.md) | Auth、Firestore 与 Analytics 设置、更换 provider |
| [部署](docs/deployment-zh.md)                    | Firebase、Cloudflare Pages、GitHub Actions CI/CD |

## AI Agent 集成

本项目包含 AI 编码助手的配置以协助开发，支持 [Antigravity](https://github.com/google-deepmind/antigravity) 和 [Cursor](https://cursor.com/)。

### Antigravity

| 路径                                   | 用途                                |
| -------------------------------------- | ----------------------------------- |
| `.agent/workflows/branch-and-pr.md`    | 强制性 Git 工作流和验证流程         |
| `.agent/skills/project-rules/SKILL.md` | 项目约定和代码风格                  |
| `.agent/skills/`                       | 专业技能 (reviewer, frontend, arch) |

### Cursor

| 路径                                       | 用途                                     |
| ------------------------------------------ | ---------------------------------------- |
| `.cursor/rules/general.mdc`                | 项目约定和代码风格                       |
| `.cursor/rules/branch-and-pr-workflow.mdc` | Git 工作流、验证和 PR 创建               |
| `.cursor/skills/`                          | 专业 agent (code review, frontend, arch) |

### 与其他 AI Agent 配合使用

要与其他 AI 工具（GitHub Copilot、Windsurf 等）配合使用：

1. 将 `.cursor/rules/` 内容复制到 agent 的规则位置（如 `.github/copilot-instructions.md`）
2. 在 prompts 中引用 skill 文件或转换为 agent 的 skill 格式
3. 根据所选工具调整文件路径和语法

## 贡献

1. 从 `develop` 创建功能分支
2. 编写/更新测试以保持 100% 覆盖率
3. 提交前运行 `npm run validate`
4. 向 `develop` 发起 Pull Request

详细工作流参见[开发指南](docs/development-guide-zh.md)。

## 许可证

MIT
