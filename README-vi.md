# Thinh Tran — Trang Web Cá Nhân

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

[English](README.md) | **Tiếng Việt** | [中文](README-zh.md)

**[Trang web](https://thinhtq.com/vi)**

Trang web cá nhân giới thiệu portfolio, dịch vụ, hồ sơ và blog — được xây dựng với Next.js, Clean Architecture và cấu trúc module.

## Tính năng

- **Clean Architecture** — Các layer Domain, Application, Infrastructure, Presentation với Awilix DI
- **Cấu trúc Module** — Module tính năng trong `src/modules/` với ranh giới rõ ràng
- **Tech Stack** — Next.js App Router, TypeScript (strict), Tailwind CSS, shadcn/ui (Radix)
- **Forms & Validation** — React Hook Form + Zod với schemas type-safe
- **State & i18n** — Zustand cho state client, next-intl với 3 ngôn ngữ (EN, VI, ZH)
- **Testing** — Vitest + React Testing Library với yêu cầu 100% coverage

## Bắt đầu nhanh

```bash
npm install
npm run dev
```

Ứng dụng chạy tại `http://localhost:3000`.

## Scripts

| Lệnh               | Mô tả                                            |
| ------------------ | ------------------------------------------------ |
| `npm run dev`      | Khởi động server phát triển                      |
| `npm run build`    | Build cho production                             |
| `npm run validate` | Chạy lint, kiểm tra format và tests với coverage |

## Tài liệu

| Tài liệu                                             | Mô tả                                                    |
| ---------------------------------------------------- | -------------------------------------------------------- |
| [Kiến trúc](docs/architecture-vi.md)                 | Các layer, luồng dữ liệu, design patterns, DI với Awilix |
| [Quy ước Coding](docs/coding-conventions-vi.md)      | Đặt tên file, patterns App Router, forms, i18n           |
| [Hướng dẫn Phát triển](docs/development-guide-vi.md) | Git workflow, thêm tính năng, tạo modules                |
| [Hướng dẫn Testing](docs/testing-guide-vi.md)        | Tổ chức test, coverage, best practices                   |
| [Triển khai](docs/deployment-vi.md)                  | Cloudflare Pages, GitHub Actions CI/CD                   |

## Tích hợp AI Agent

Dự án này bao gồm cấu hình cho các trợ lý AI coding để hỗ trợ phát triển, hỗ trợ cả [Antigravity](https://github.com/google-deepmind/antigravity) và [Cursor](https://cursor.com/).

### Antigravity

| Đường dẫn                              | Mục đích                                          |
| -------------------------------------- | ------------------------------------------------- |
| `.agent/workflows/branch-and-pr.md`    | Quy trình Git bắt buộc và validation              |
| `.agent/skills/project-rules/SKILL.md` | Quy ước dự án và code style                       |
| `.agent/skills/`                       | Các kỹ năng chuyên biệt (reviewer, frontend, ...) |

### Cursor

| Đường dẫn                                  | Mục đích                                           |
| ------------------------------------------ | -------------------------------------------------- |
| `.cursor/rules/general.mdc`                | Quy tắc dự án và conventions                       |
| `.cursor/rules/branch-and-pr-workflow.mdc` | Git workflow, validation, và tạo PR                |
| `.cursor/skills/`                          | Các agent chuyên biệt (code review, frontend, ...) |

### Sử dụng với AI Agent khác

Để sử dụng với các công cụ AI khác (GitHub Copilot, Windsurf, v.v.):

1. Copy nội dung `.cursor/rules/` sang vị trí rules của agent (vd. `.github/copilot-instructions.md`)
2. Tham chiếu các file skill trong prompts hoặc chuyển đổi sang format skill của agent
3. Điều chỉnh đường dẫn file và cú pháp phù hợp với công cụ bạn chọn

## Đóng góp

1. Tạo feature branch từ `develop`
2. Viết/cập nhật tests để duy trì 100% coverage
3. Chạy `npm run validate` trước khi commit
4. Mở Pull Request nhắm vào `develop`

Xem [Hướng dẫn Phát triển](docs/development-guide-vi.md) để biết workflow chi tiết.

## Giấy phép

MIT
