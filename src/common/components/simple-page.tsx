import { Button } from "@/common/components/button";
import { Card, CardContent, CardHeader } from "@/common/components/card";
import { Link } from "@/common/routing/navigation";

type SimplePageProps = {
  title: string;
  href?: string;
  ctaLabel: string;
};

export function SimplePage({ title, href = "/", ctaLabel }: SimplePageProps) {
  return (
    <div className="mx-auto flex min-h-[60vh] w-full max-w-4xl items-center justify-center px-6 py-20">
      <Card className="rounded-3xl px-8 py-10 text-center">
        <CardHeader className="space-y-0 pb-0">
          <h1 className="mt-3 text-3xl font-semibold text-[var(--text-primary)] sm:text-4xl">
            {title}
          </h1>
        </CardHeader>
        <CardContent className="pt-6">
          <Button asChild variant="primary">
            <Link href={href}>{ctaLabel}</Link>
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
