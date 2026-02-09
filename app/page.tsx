import { redirect } from "next/navigation";

import { routing } from "@/common/routing/routing";

export default function Page() {
  redirect(`/${routing.defaultLocale}`);
}
