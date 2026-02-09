"use client";

import ErrorPage from "@/common/pages/error-page";

type ErrorProps = {
  error: Error & { digest?: string };
  reset: () => void;
};

export default function Error(props: ErrorProps) {
  return <ErrorPage reset={props.reset} />;
}
