import { render, screen } from "@testing-library/react";
import { createRef } from "react";
import { describe, expect, it } from "vitest";

import { Textarea } from "@/common/components/textarea";

describe("Textarea (common/components)", () => {
  it("renders a textarea", () => {
    render(<Textarea placeholder="Enter description" />);
    expect(
      screen.getByPlaceholderText("Enter description"),
    ).toBeInTheDocument();
  });

  it("forwards ref to the textarea element", () => {
    const ref = createRef<HTMLTextAreaElement>();
    render(<Textarea ref={ref} />);
    expect(ref.current).toBeInstanceOf(HTMLTextAreaElement);
  });

  it("accepts value and onChange", async () => {
    render(
      <Textarea value="test value" onChange={() => {}} aria-label="Desc" />,
    );
    expect(screen.getByLabelText("Desc")).toHaveValue("test value");
  });
});
