import { render, screen } from "@testing-library/react";

import { RootLayout } from "@/common/components/root-layout";

describe("RootLayout", () => {
  it("renders children", () => {
    render(
      <RootLayout>
        <div>Content</div>
      </RootLayout>,
    );

    expect(screen.getByText("Content")).toBeInTheDocument();
  });
});
