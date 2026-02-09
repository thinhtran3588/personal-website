import { Page } from "@/common/components/page";

export default function BooksLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <Page>{children}</Page>;
}
