import { describe, expect, it } from "vitest";

import type { MenuItem } from "@/common/interfaces";
import { resolveMenuItems } from "@/common/utils/menu";

describe("resolveMenuItems", () => {
  it("resolves flat menu items with translation function", () => {
    const items: MenuItem[] = [
      { id: "a", translationKey: "nav.a", href: "/a", children: undefined },
      { id: "b", translationKey: "nav.b", href: "/b", children: undefined },
    ];
    const t = (key: string) =>
      key === "nav.a" ? "Home" : key === "nav.b" ? "About" : key;

    expect(resolveMenuItems(items, t)).toEqual([
      { id: "a", label: "Home", href: "/a", children: undefined },
      { id: "b", label: "About", href: "/b", children: undefined },
    ]);
  });

  it("resolves nested menu items recursively", () => {
    const items: MenuItem[] = [
      {
        id: "docs",
        translationKey: "nav.docs",
        href: "",
        children: [
          {
            id: "doc1",
            translationKey: "nav.doc1",
            href: "/doc1",
            children: undefined,
          },
        ],
      },
    ];
    const t = (key: string) =>
      key === "nav.docs" ? "Docs" : key === "nav.doc1" ? "Guide" : key;

    expect(resolveMenuItems(items, t)).toEqual([
      {
        id: "docs",
        label: "Docs",
        href: "",
        children: [
          { id: "doc1", label: "Guide", href: "/doc1", children: undefined },
        ],
      },
    ]);
  });
});
