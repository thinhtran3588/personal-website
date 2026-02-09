import type { MenuItem } from "@/common/interfaces";

export function getMainMenuConfig(): MenuItem[] {
  return [
    {
      id: "home",
      translationKey: "navigation.home",
      href: "/",
    },
    {
      id: "products",
      translationKey: "navigation.products",
      href: "/products",
    },
    {
      id: "contact",
      translationKey: "navigation.contact",
      href: "/contact",
    },
  ];
}
