import { render, screen } from "@testing-library/react";

import messages from "@/application/localization/en.json";
import NotFoundPage from "@/common/pages/not-found-page";

describe("NotFoundPage", () => {
  it("renders not found title and description from translations", () => {
    render(<NotFoundPage />);

    const title = messages.common.errors.notFound.title;
    const description = messages.common.errors.notFound.description;

    expect(screen.getByRole("heading", { name: title })).toBeInTheDocument();
    expect(screen.getByText(description)).toBeInTheDocument();
  });

  it("renders back to home link with correct href", () => {
    render(<NotFoundPage />);

    const link = screen.getByRole("link", {
      name: messages.common.errors.notFound.cta,
    });
    expect(link).toBeInTheDocument();
    expect(link).toHaveAttribute("href", "/");
  });
});
