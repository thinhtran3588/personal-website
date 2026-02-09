"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";

import { Button } from "@/common/components/button";
import { DocumentsDropdown } from "@/common/components/documents-dropdown";
import { GitHubIcon, MenuIcon } from "@/common/components/icons";
import { MobileMenuProvider } from "@/common/contexts/mobile-menu-context";
import type { ResolvedMenuItem } from "@/common/interfaces";
import { Link, usePathname } from "@/common/routing/navigation";
import { cn } from "@/common/utils/cn";

type MainHeaderProps = {
  badge: string;
  menuItems: ResolvedMenuItem[];
  menuLabel: string;
  githubUrl?: string;
  authSlot?: React.ReactNode;
  settingsSlot?: React.ReactNode;
};

const SCROLL_HIDE_THRESHOLD = 32;
const SCROLL_DELTA = 4;

const navLinkClass = cn(
  "relative py-1 transition text-[var(--text-muted)] hover:text-[var(--text-primary)] nav-link-indicator",
  "after:absolute after:bottom-0 after:left-0 after:block after:h-0.5 after:w-full after:bg-[var(--text-primary)] after:content-[''] after:transition-transform after:duration-300 after:origin-left",
);

export function MainHeader({
  badge,
  menuItems,
  menuLabel,
  githubUrl,
  authSlot,
  settingsSlot,
}: MainHeaderProps) {
  const pathname = usePathname();
  const [isHidden, setIsHidden] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const lastScrollY = useRef(0);

  const isActive = (path: string) =>
    path === "/" ? pathname === "/" || pathname === "" : pathname === path;

  useEffect(() => {
    lastScrollY.current = window.scrollY;
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      const delta = currentScrollY - lastScrollY.current;

      if (Math.abs(delta) < SCROLL_DELTA) {
        return;
      }

      if (currentScrollY <= SCROLL_HIDE_THRESHOLD) {
        setIsHidden(false);
      } else if (delta > 0) {
        setIsHidden(true);
      } else {
        setIsHidden(false);
      }

      lastScrollY.current = currentScrollY;
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <header
      className={`glass-header fixed inset-x-0 top-0 z-50 transition-all duration-300 ${
        isHidden
          ? "pointer-events-none -translate-y-full opacity-0"
          : "translate-y-0 opacity-100"
      }`}
    >
      <div className="relative">
        <div className="mx-auto flex w-full max-w-6xl items-center justify-between px-6 py-4">
          <Link
            className="flex items-center gap-3 text-base font-semibold text-[var(--text-primary)] transition hover:opacity-90"
            href="/"
          >
            <Image
              src="/icon.svg"
              alt=""
              width={24}
              height={24}
              className="h-6 w-6 rounded-md"
              aria-hidden="true"
            />
            {badge}
          </Link>
          <div className="flex items-center gap-3 text-sm">
            <nav className="hidden items-center gap-4 sm:flex">
              {menuItems.map((item) =>
                item.children?.length ? (
                  <DocumentsDropdown
                    key={item.id}
                    documentsLabel={item.label}
                    items={item.children.map((c) => ({
                      label: c.label,
                      href: c.href,
                    }))}
                  />
                ) : (
                  <Link
                    key={item.id}
                    className={cn(
                      navLinkClass,
                      isActive(item.href)
                        ? "font-bold text-[var(--text-primary)] after:scale-x-100"
                        : "after:scale-x-0",
                    )}
                    href={item.href}
                  >
                    {item.label}
                  </Link>
                ),
              )}
            </nav>
            {githubUrl ? (
              <a
                href={githubUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="text-[var(--text-muted)] transition hover:text-[var(--text-primary)]"
                aria-label="GitHub"
                data-testid="github-link"
              >
                <GitHubIcon className="h-5 w-5" />
              </a>
            ) : null}
            {settingsSlot != null ? (
              <div
                className="flex items-center gap-3"
                data-testid="settings-slot"
              >
                {settingsSlot}
              </div>
            ) : null}
            {authSlot != null ? (
              <div className="hidden sm:block">{authSlot}</div>
            ) : null}
            <Button
              type="button"
              variant="default"
              size="icon"
              className="sm:hidden"
              aria-label={menuLabel}
              aria-expanded={isMenuOpen}
              onClick={() => setIsMenuOpen((value) => !value)}
            >
              <MenuIcon className="h-4 w-4" />
            </Button>
          </div>
        </div>
        {isMenuOpen ? (
          <>
            <div
              className="fixed inset-0 z-30 sm:hidden"
              aria-hidden
              onClick={() => setIsMenuOpen(false)}
              data-testid="mobile-menu-backdrop"
            />
            <div
              className="mobile-menu-panel absolute top-full right-6 left-6 z-40 rounded-3xl px-4 py-4 text-sm sm:hidden"
              data-testid="mobile-menu"
            >
              <nav
                className="flex flex-col gap-3"
                onClick={() => setIsMenuOpen(false)}
              >
                {authSlot != null ? (
                  <div className="sm:hidden">
                    <MobileMenuProvider value={true}>
                      {authSlot}
                    </MobileMenuProvider>
                  </div>
                ) : null}
                {menuItems.map((item) =>
                  item.children?.length ? (
                    <div key={item.id} className="flex flex-col gap-1">
                      <span className="py-1 text-[var(--text-muted)]">
                        {item.label}
                      </span>
                      <div className="flex flex-col pl-3">
                        {item.children.map((child) => (
                          <Link
                            key={child.id}
                            className={cn(
                              "block py-1 text-[var(--text-muted)] transition hover:text-[var(--text-primary)]",
                              isActive(child.href) &&
                                "font-bold text-[var(--text-primary)]",
                            )}
                            href={child.href}
                          >
                            {child.label}
                          </Link>
                        ))}
                      </div>
                    </div>
                  ) : (
                    <Link
                      key={item.id}
                      className={cn(
                        "py-1 text-[var(--text-muted)] transition hover:text-[var(--text-primary)]",
                        isActive(item.href) &&
                          "font-bold text-[var(--text-primary)]",
                      )}
                      href={item.href}
                    >
                      {item.label}
                    </Link>
                  ),
                )}
              </nav>
            </div>
          </>
        ) : null}
      </div>
    </header>
  );
}
