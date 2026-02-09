# Coding Conventions

This document covers coding conventions, file organization, and framework-specific patterns used in this project.

## Table of Contents

1. [App Router (Routing Only)](#app-router-routing-only)
2. [Data Fetching and Mutations](#data-fetching-and-mutations)
3. [File and Folder Conventions](#file-and-folder-conventions)
   - [Naming](#naming)
   - [Component Props](#component-props)
   - [Folder Structure](#folder-structure)
4. [Forms and Validation](#forms-and-validation)
5. [Internationalization (next-intl)](#internationalization-next-intl)

## App Router (Routing Only)

- **Routes**: `app/[locale]/{segment}/page.tsx` for routing; these files import page components from `src/modules/{module}/presentation/pages/`.
- **No code in /app**: All business logic, components, and services live in `/src`. The `/app` folder only handles Next.js routing.
- **Server vs Client**: Pages and components can be Server or Client Components. Default to Server Components; add `"use client"` only for hooks, browser APIs, or Zustand.
- **Client boundary**: Keep `"use client"` as low as possible (leaf components or small wrappers).

### Route Example

```tsx
// app/[locale]/auth/sign-in/page.tsx
import { SignInPage } from "@/modules/auth/presentation/pages/sign-in/page";

export default function Page() {
  return <SignInPage />;
}
```

```tsx
// app/[locale]/layout.tsx
import { AppInitializer } from "@/application/components/app-initializer";
import { RootLayout } from "@/common/components/root-layout";
import { Toaster } from "@/common/components/toaster";

export default async function LocaleLayout({ children, params }: { ... }) {
  // ... next-intl setup
  return (
    <NextIntlClientProvider locale={locale} messages={messages}>
      <AppInitializer />
      <RootLayout>{children}</RootLayout>
      <Toaster />
    </NextIntlClientProvider>
  );
}
```

Route groups (e.g. `(main)`) use a shared layout that provides `MainLayout` with menu and auth slot; auth routes use `AuthLayout`. This keeps `/app` minimal and all code in `/src` for better organization and testability.

## Data Fetching and Mutations

- **Server Components**: Fetch data via use cases (in `src/modules/{module}/application/`, resolved from container when needed); no direct `fetch` in components when it represents a use case.
- **Client Components**: For mutations (forms), resolve use cases via `useContainer()` and call `execute()`. Use cases use services or API client to communicate with the backend or external API. Client Components may also fetch data via use cases when needed.
- **Forms**: Validate with Zod (React Hook Form), then call application services to submit data to the backend.

## File and Folder Conventions

### Naming

- **All files and folders use kebab-case** (lowercase with hyphens), except Next.js reserved route files like `page.tsx` and `layout.tsx`.
- **Page modules** live in their own folder under `src/modules/{module}/presentation/pages/{page}/page.tsx`.

### Component Props

- **All components with props must define a props type** and use it in the component signature.
- **Components without props should not define a props type** or include a props parameter.

### Folder Structure

| Path | Purpose |
|------|---------|
| `app/` | Routing only (page.tsx, layout.tsx, error.tsx, not-found.tsx); under `app/[locale]/` with next-intl |
| `src/application/` | App-level setup: components, config, localization, register-container |
| `src/common/components/` | Shared components (flat: button, card, dialog, form, input, label, etc.) |
| `src/common/hooks/` | Shared hooks (e.g. use-container) |
| `src/common/interfaces.ts` | Shared interfaces (MenuItem, ResolvedMenuItem) |
| `src/common/pages/` | Shared page components (error-page, not-found-page) |
| `src/common/routing/` | next-intl routing (routing.ts, navigation.ts) |
| `src/common/utils/` | Utilities (cn, container, base-use-case, menu, read-doc) |
| `src/modules/{module}/` | Feature modules with domain, application, infrastructure, presentation layers |
| `src/__tests__/` | Tests mirror src structure |

## Forms and Validation

- Use React Hook Form with Zod (`zodResolver(schema)`) and Form components from `src/common/components/`.
- On form submit, resolve the appropriate use case via `useContainer()` and call `execute()` with validated form data. Use cases delegate to services or API client.
- Handle API errors and map them to form state as needed (e.g. via module utils like `map-auth-error`).

### Example

```tsx
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { loginSchema, type LoginFormData } from "@/modules/auth/domain/schemas";
import { useContainer } from "@/common/hooks/use-container";

function SignInForm() {
  const { signInWithEmailUseCase } = useContainer();
  const form = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = async (data: LoginFormData) => {
    await signInWithEmailUseCase.execute(data);
  };

  return <form onSubmit={form.handleSubmit(onSubmit)}>{/* ... */}</form>;
}
```

## Internationalization (next-intl)

- **Locale-based routing**: `app/[locale]/...`; middleware for locale detection.
- **Server Components**: Use `getTranslations('namespace')` for translations.
- **Client Components**: Use `useTranslations('namespace')` for translations.
- **Navigation**: Use next-intl `Link` and `useRouter` for locale-aware navigation.

### Translation Files

Translation JSON files are stored in `src/application/localization/`:
- `en.json` - English
- `vi.json` - Vietnamese
- `zh.json` - Chinese

### Example

```tsx
// Server Component
import { getTranslations } from "next-intl/server";

export default async function Page() {
  const t = await getTranslations("auth");
  return <h1>{t("signIn.title")}</h1>;
}

// Client Component
"use client";
import { useTranslations } from "next-intl";

export function SignInForm() {
  const t = useTranslations("auth");
  return <button>{t("signIn.submit")}</button>;
}
```
