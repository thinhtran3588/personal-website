---
name: nextjs-frontend-developer
description: Guides frontend implementation using Next.js (App Router), shadcn/ui, Zustand, React Hook Form, Zod, and next-intl within our Clean Architecture module structure. Use when building or modifying Next.js UI, forms, validation, internationalization (i18n), translations, or when the user mentions Next.js frontend, shadcn, Zustand, React Hook Form, Zod, or next-intl.
---

# Next.js Frontend Developer

## Stack Overview

- **Next.js**: App Router, React Server Components by default, file-based routing under `app/[locale]/`.
- **shadcn/ui**: Radix UI + Tailwind components in `src/common/components/`. Use CLI to add: `npx shadcn@latest add <component>`.
- **Zustand**: Client-only state in module-specific hooks (`src/modules/{module}/presentation/hooks/`).
- **React Hook Form**: Form state with shadcn form components and Zod validation.
- **Zod**: Schema validation in `src/modules/{module}/domain/schemas.ts`.
- **next-intl**: i18n with locale routing (`app/[locale]/`), translations in `src/application/localization/`.
- **Awilix**: Dependency injection; resolve use cases via `useContainer()` hook.

---

## Project Structure

```
app/                              # Routing layer ONLY
└── [locale]/                     # Locale segment (next-intl)
    ├── layout.tsx                # Wraps with providers
    ├── (main)/                   # Route group with MainLayout
    │   └── {feature}/page.tsx    # Imports from src/modules/
    └── auth/                     # Auth routes with AuthLayout

src/                              # All application code
├── application/
│   ├── components/               # AppInitializer
│   ├── config/                   # firebase-config, main-menu
│   ├── localization/             # en.json, vi.json, zh.json, request.ts
│   └── register-container.ts     # DI container setup
├── common/
│   ├── components/               # Shared UI (button, form, input, card, etc.)
│   ├── hooks/                    # use-container
│   ├── routing/                  # routing.ts, navigation.ts (next-intl)
│   └── utils/                    # cn, container, base-use-case
└── modules/{module}/
    ├── domain/
    │   ├── types.ts              # Interfaces, type aliases
    │   ├── schemas.ts            # Zod schemas for forms
    │   └── interfaces.ts         # Service/repository interfaces
    ├── application/              # Use cases
    ├── infrastructure/           # Services, repositories
    ├── presentation/
    │   ├── components/           # Module-specific components
    │   ├── hooks/                # Zustand stores, custom hooks
    │   └── pages/{page}/
    │       ├── page.tsx          # Page component
    │       └── components/       # Page-specific components
    └── module-configuration.ts   # DI registration
```

---

## App Router Conventions

### Routes (app/)

- **Routes are minimal**: `app/[locale]/.../page.tsx` only imports and renders from `src/modules/`.
- **No business logic in app/**: All code lives in `src/`.

```tsx
// app/[locale]/auth/sign-in/page.tsx
import { SignInPage } from "@/modules/auth/presentation/pages/sign-in/page";

export default function Page() {
  return <SignInPage />;
}
```

### Server vs Client Components

- Default is **Server Component**.
- Add `"use client"` only when using hooks, browser APIs, or Zustand.
- Keep `"use client"` as low as possible (leaf components).

---

## shadcn/ui Usage

### Component Location

Components live in `src/common/components/` (not `components/ui/`).

```bash
# Add new shadcn component
npx shadcn@latest add button
# Then move to src/common/components/ if needed
```

### Import Pattern

```tsx
import { Button } from "@/common/components/button";
import { Card, CardHeader, CardContent } from "@/common/components/card";
import { Form, FormField, FormItem, FormControl, FormMessage } from "@/common/components/form";
```

### Styling

- Use **Tailwind** with design tokens (`primary`, `muted`, `destructive`).
- Use **`cn()`** helper from `@/common/utils/cn` for conditional classes.

---

## React Hook Form + Zod

### Schema Location

Schemas live in `src/modules/{module}/domain/schemas.ts`:

```ts
// src/modules/auth/domain/schemas.ts
import { z } from "zod";

export const signInSchema = z.object({
  email: z.string().email("Invalid email"),
  password: z.string().min(1, "Required").max(20),
});

export type SignInFormData = z.infer<typeof signInSchema>;
```

### Form Pattern with Use Cases

```tsx
"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { signInSchema, type SignInFormData } from "@/modules/auth/domain/schemas";
import { useContainer } from "@/common/hooks/use-container";
import { Form, FormField, FormItem, FormControl, FormMessage } from "@/common/components/form";
import { Input } from "@/common/components/input";
import { Button } from "@/common/components/button";

export function SignInForm() {
  const { signInWithEmailUseCase } = useContainer();
  
  const form = useForm<SignInFormData>({
    resolver: zodResolver(signInSchema),
    defaultValues: { email: "", password: "" },
  });

  const onSubmit = async (data: SignInFormData) => {
    const result = await signInWithEmailUseCase.execute(data);
    if (!result.success) {
      // Handle error
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)}>
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormControl>
                <Input {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        {/* More fields... */}
        <Button type="submit">Sign In</Button>
      </form>
    </Form>
  );
}
```

---

## Zustand Usage

### Store Location

Stores live in `src/modules/{module}/presentation/hooks/`:

```ts
// src/modules/auth/presentation/hooks/use-auth-user-store.ts
"use client";

import { create } from "zustand";
import type { AuthUser } from "@/modules/auth/domain/types";

interface AuthUserStore {
  user: AuthUser | null;
  loading: boolean;
  setAuthState: (user: AuthUser | null, loading: boolean) => void;
}

export const useAuthUserStore = create<AuthUserStore>((set) => ({
  user: null,
  loading: true,
  setAuthState: (user, loading) => set({ user, loading }),
}));
```

### Using in Components

```tsx
"use client";

import { useAuthUserStore } from "@/modules/auth/presentation/hooks/use-auth-user-store";

export function UserInfo() {
  const user = useAuthUserStore((s) => s.user);
  const loading = useAuthUserStore((s) => s.loading);
  
  if (loading) return <div>Loading...</div>;
  return <div>{user?.displayName}</div>;
}
```

---

## next-intl Usage

### Translation Files

Translations are in `src/application/localization/`:

```
src/application/localization/
├── en.json
├── vi.json
├── zh.json
└── request.ts
```

### Message Structure

```json
{
  "common": {
    "navigation": {
      "home": "Home",
      "signIn": "Sign in"
    }
  },
  "modules": {
    "auth": {
      "pages": {
        "sign-in": {
          "title": "Sign in",
          "emailLabel": "Email"
        }
      }
    }
  }
}
```

### Server Components

```tsx
import { getTranslations } from "next-intl/server";

export default async function Page() {
  const t = await getTranslations("modules.auth.pages.sign-in");
  return <h1>{t("title")}</h1>;
}
```

### Client Components

```tsx
"use client";

import { useTranslations } from "next-intl";

export function SignInForm() {
  const t = useTranslations("modules.auth.pages.sign-in");
  return <label>{t("emailLabel")}</label>;
}
```

### Navigation

Use next-intl's `Link` and `useRouter` for locale-aware navigation:

```tsx
import { Link, useRouter } from "@/common/routing/navigation";

// Link keeps current locale
<Link href="/auth/sign-in">Sign In</Link>

// Router keeps current locale
const router = useRouter();
router.push("/dashboard");
```

---

## Use Cases and DI

### Resolving Use Cases

Use `useContainer()` hook to resolve use cases:

```tsx
"use client";

import { useContainer } from "@/common/hooks/use-container";

export function MyComponent() {
  const { signInWithEmailUseCase, signOutUseCase } = useContainer();
  
  const handleSignIn = async () => {
    const result = await signInWithEmailUseCase.execute({ email, password });
  };
}
```

### Use Case Pattern

Use cases extend `BaseUseCase` and call services/repositories:

```ts
// src/modules/auth/application/sign-in-with-email-use-case.ts
import { BaseUseCase } from "@/common/utils/base-use-case";
import type { AuthenticationService } from "@/modules/auth/domain/interfaces";

interface Deps {
  authService: AuthenticationService;
}

export class SignInWithEmailUseCase extends BaseUseCase<Deps> {
  async execute({ email, password }: { email: string; password: string }) {
    return this.deps.authService.signInWithEmail(email, password);
  }
}
```

---

## Quick Decision Guide

| Task | Approach |
|------|----------|
| New page | Create `src/modules/{module}/presentation/pages/{page}/page.tsx`, add route in `app/[locale]/` |
| New component (shared) | Add to `src/common/components/`. Use shadcn CLI if applicable. |
| New component (module-specific) | Add to `src/modules/{module}/presentation/components/` |
| Form with validation | Zod schema in `domain/schemas.ts`, React Hook Form + shadcn Form, submit via use case |
| Global state | Zustand store in `src/modules/{module}/presentation/hooks/` |
| Data fetching | Use case in `application/`, resolve via `useContainer()` |
| Translations | Add keys to `src/application/localization/*.json`, use `getTranslations` or `useTranslations` |
| Navigation | Use `Link`/`useRouter` from `@/common/routing/navigation` |

---

## Checklist for New Features

- [ ] Page component in `src/modules/{module}/presentation/pages/{page}/page.tsx`
- [ ] Route file in `app/[locale]/...` imports from `src/modules/`
- [ ] `"use client"` only where needed (hooks, Zustand, browser APIs)
- [ ] Zod schemas in `domain/schemas.ts` with exported types
- [ ] Forms use React Hook Form + Zod + shadcn Form components
- [ ] Use cases in `application/`, registered in `module-configuration.ts`
- [ ] State in Zustand stores under `presentation/hooks/`
- [ ] Translations in `src/application/localization/*.json` (all 3 languages)
- [ ] Navigation uses next-intl `Link`/`useRouter` from `@/common/routing/navigation`
- [ ] Imports use path aliases (`@/modules/`, `@/common/`)
