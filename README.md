# Thinh Tran — Personal Website

[![CI - Main](https://github.com/thinhtran3588/personal-website/actions/workflows/ci-main.yml/badge.svg?branch=main)](https://github.com/thinhtran3588/personal-website/actions/workflows/ci-main.yml)
[![codecov - Main](https://codecov.io/gh/thinhtran3588/personal-website/branch/main/graph/badge.svg)](https://codecov.io/gh/thinhtran3588/personal-website/tree/main)

[![CI - Develop](https://github.com/thinhtran3588/personal-website/actions/workflows/ci-develop.yml/badge.svg?branch=develop)](https://github.com/thinhtran3588/personal-website/actions/workflows/ci-develop.yml)
[![codecov - Develop](https://codecov.io/gh/thinhtran3588/personal-website/branch/develop/graph/badge.svg)](https://codecov.io/gh/thinhtran3588/personal-website/tree/develop)

![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?style=flat&logo=typescript&logoColor=white)
![Next.js](https://img.shields.io/badge/Next.js-000000?style=flat&logo=next.js&logoColor=white)
![React](https://img.shields.io/badge/React-61DAFB?style=flat&logo=react&logoColor=black)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=flat&logo=tailwind-css&logoColor=white)
![Radix UI](https://img.shields.io/badge/Radix_UI-161618?style=flat&logo=radix-ui&logoColor=white)
![Zod](https://img.shields.io/badge/Zod-3E67B1?style=flat&logo=zod&logoColor=white)
![React Hook Form](https://img.shields.io/badge/React_Hook_Form-EC5990?style=flat&logo=reacthookform&logoColor=white)
![Vitest](https://img.shields.io/badge/Vitest-6E9F18?style=flat&logo=vitest&logoColor=white)
![Testing Library](https://img.shields.io/badge/Testing_Library-E33332?style=flat&logo=testing-library&logoColor=white)

**English** | [Tiếng Việt](README-vi.md) | [中文](README-zh.md)

**[Live Site](https://thinhtq.com/en)**

My personal website showcasing my portfolio, services, resume, and blog — built with Next.js, Clean Architecture, and a modular structure.

## Features

- **Clean Architecture** — Domain, Application, Infrastructure, Presentation layers with Awilix DI
- **Modular Structure** — Feature modules under `src/modules/` with clear boundaries
- **Tech Stack** — Next.js App Router, TypeScript (strict), Tailwind CSS, shadcn/ui (Radix)
- **Forms & Validation** — React Hook Form + Zod with type-safe schemas
- **State & i18n** — Zustand for client state, next-intl with 3 languages (EN, VI, ZH)
- **Testing** — Vitest + React Testing Library with 100% coverage requirement

## Quick Start

```bash
npm install
npm run dev
```

The app runs at `http://localhost:3000`.

## Scripts

| Command            | Description                                     |
| ------------------ | ----------------------------------------------- |
| `npm run dev`      | Start development server                        |
| `npm run build`    | Build for production                            |
| `npm run validate` | Run lint, format check, and tests with coverage |

## Documentation

| Document                                         | Description                                        |
| ------------------------------------------------ | -------------------------------------------------- |
| [Architecture](docs/architecture.md)             | Layers, data flow, design patterns, DI with Awilix |
| [Coding Conventions](docs/coding-conventions.md) | File naming, App Router patterns, forms, i18n      |
| [Development Guide](docs/development-guide.md)   | Git workflow, adding features, creating modules    |
| [Testing Guide](docs/testing-guide.md)           | Test organization, coverage, best practices        |
| [Deployment](docs/deployment.md)                 | Cloudflare Pages, GitHub Actions CI/CD             |

## AI Agent Integration

This project includes configuration for AI-assisted development, supporting both [Antigravity](https://github.com/google-deepmind/antigravity) and [Cursor](https://cursor.com/).

### Antigravity

| Path                                   | Purpose                                       |
| -------------------------------------- | --------------------------------------------- |
| `.agent/workflows/branch-and-pr.md`    | Mandatory Git workflow and validation process |
| `.agent/skills/project-rules/SKILL.md` | Project conventions and code style            |
| `.agent/skills/`                       | Specialized skills (reviewer, frontend, arch) |

### Cursor

| Path                                       | Purpose                                          |
| ------------------------------------------ | ------------------------------------------------ |
| `.cursor/rules/general.mdc`                | Project conventions and code style               |
| `.cursor/rules/branch-and-pr-workflow.mdc` | Git workflow, validation, and PR creation        |
| `.cursor/skills/`                          | Specialized agents (code review, frontend, arch) |

For other AI tools, copy rules to the agent's config location and adapt as needed.

## Contributing

1. Create a feature branch from `develop`
2. Write/update tests to maintain 100% coverage
3. Run `npm run validate` before committing
4. Open a Pull Request targeting `develop`

See [Development Guide](docs/development-guide.md) for detailed workflow.

## License

MIT
