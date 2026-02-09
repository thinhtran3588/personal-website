import { render, screen } from "@testing-library/react";

import { ErrorPageView } from "@/common/components/error-page-view";
import { Link } from "@/common/routing/navigation";

describe("ErrorPageView", () => {
  it("renders title and description", () => {
    render(
      <ErrorPageView
        title="Page not found"
        description="The page does not exist."
        primaryAction={<button type="button">Back</button>}
      />,
    );

    expect(
      screen.getByRole("heading", { name: "Page not found" }),
    ).toBeInTheDocument();
    expect(screen.getByText("The page does not exist.")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Back" })).toBeInTheDocument();
  });

  it("renders secondary action when provided", () => {
    render(
      <ErrorPageView
        title="Error"
        description="Something went wrong."
        primaryAction={<button type="button">Try again</button>}
        secondaryAction={<Link href="/">Home</Link>}
      />,
    );

    expect(
      screen.getByRole("button", { name: "Try again" }),
    ).toBeInTheDocument();
    expect(screen.getByRole("link", { name: "Home" })).toBeInTheDocument();
  });

  it("renders eyebrow and error code when provided", () => {
    render(
      <ErrorPageView
        eyebrow="Not found"
        errorCode="404"
        title="Page not found"
        description="The page does not exist."
        primaryAction={<button type="button">Back</button>}
      />,
    );

    expect(screen.getByText("Not found")).toBeInTheDocument();
    expect(screen.getByText("404")).toBeInTheDocument();
  });
});
