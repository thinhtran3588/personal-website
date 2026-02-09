import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

import messages from "@/application/localization/en.json";
import ErrorPage from "@/common/pages/error-page";

describe("ErrorPage", () => {
  it("renders server error title and description from translations", () => {
    const reset = vi.fn();
    render(<ErrorPage reset={reset} />);

    const title = messages.common.errors.serverError.title;
    const description = messages.common.errors.serverError.description;

    expect(screen.getByRole("heading", { name: title })).toBeInTheDocument();
    expect(screen.getByText(description)).toBeInTheDocument();
  });

  it("renders try again and back to home actions", () => {
    const reset = vi.fn();
    render(<ErrorPage reset={reset} />);

    expect(
      screen.getByRole("button", {
        name: messages.common.errors.serverError.tryAgain,
      }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("link", {
        name: messages.common.errors.serverError.cta,
      }),
    ).toBeInTheDocument();
  });

  it("calls reset when try again is clicked", async () => {
    const user = userEvent.setup();
    const reset = vi.fn();
    render(<ErrorPage reset={reset} />);

    await user.click(
      screen.getByRole("button", {
        name: messages.common.errors.serverError.tryAgain,
      }),
    );

    expect(reset).toHaveBeenCalledTimes(1);
  });

  it("back to home link points to home", () => {
    render(<ErrorPage reset={vi.fn()} />);

    const link = screen.getByRole("link", {
      name: messages.common.errors.serverError.cta,
    });
    expect(link).toHaveAttribute("href", "/");
  });
});
