import { Page } from "@/common/components/page";
import { AuthVerification } from "@/modules/auth/presentation/components/auth-verification";

export default function ProfileLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <Page>
      <AuthVerification>{children}</AuthVerification>
    </Page>
  );
}
