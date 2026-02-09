import type { MenuItem, ResolvedMenuItem } from "@/common/interfaces";

export function resolveMenuItems(
  items: MenuItem[],
  t: (key: string) => string,
): ResolvedMenuItem[] {
  return items.map((item) => ({
    id: item.id,
    label: t(item.translationKey),
    href: item.href,
    children: item.children?.length
      ? resolveMenuItems(item.children, t)
      : undefined,
  }));
}
