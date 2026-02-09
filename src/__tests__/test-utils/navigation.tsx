import React from "react";

type LinkProps = {
  href: string;
  children: React.ReactNode;
  className?: string;
};

export function Link({ href, children, ...rest }: LinkProps) {
  return (
    <a href={href} {...rest}>
      {children}
    </a>
  );
}

export function redirect() {
  throw new Error("redirect is not supported in tests");
}

export function usePathname() {
  return "/";
}

export function useRouter() {
  return {
    push: () => undefined,
    replace: () => undefined,
    back: () => undefined,
    prefetch: () => undefined,
  };
}
