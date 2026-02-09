export type MenuItem = {
  id: string;
  translationKey: string;
  href: string;
  children?: MenuItem[];
};

export type ResolvedMenuItem = {
  id: string;
  label: string;
  href: string;
  children?: ResolvedMenuItem[];
};
