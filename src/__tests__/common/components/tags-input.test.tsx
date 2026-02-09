import { act, render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";

import { TagsInput } from "@/common/components/tags-input";

describe("TagsInput", () => {
  it("renders input with placeholder", () => {
    const onChange = vi.fn();
    render(<TagsInput value={[]} onChange={onChange} placeholder="Add tags" />);
    expect(screen.getByPlaceholderText("Add tags")).toBeInTheDocument();
  });

  it("displays tags above the input", () => {
    render(<TagsInput value={["tag1", "tag2"]} onChange={vi.fn()} />);
    expect(screen.getByText("tag1")).toBeInTheDocument();
    expect(screen.getByText("tag2")).toBeInTheDocument();
  });

  it("adds tag on Enter", async () => {
    const user = userEvent.setup();
    const onChange = vi.fn();
    render(<TagsInput value={[]} onChange={onChange} />);
    const input = screen.getByPlaceholderText("Add…");
    await user.type(input, "new-tag");
    await user.keyboard("{Enter}");
    await waitFor(() => {
      expect(onChange).toHaveBeenCalledWith(["new-tag"]);
    });
  });

  it("adds single tag for text with spaces", async () => {
    const user = userEvent.setup();
    const onChange = vi.fn();
    render(<TagsInput value={[]} onChange={onChange} />);
    const input = screen.getByPlaceholderText("Add…");
    await user.type(input, "Thinh Tran");
    await user.keyboard("{Enter}");
    await waitFor(() => {
      expect(onChange).toHaveBeenCalledWith(["Thinh Tran"]);
    });
  });

  it("adds tag on blur when input has value", async () => {
    const user = userEvent.setup();
    const onChange = vi.fn();
    render(<TagsInput value={[]} onChange={onChange} />);
    const input = screen.getByPlaceholderText("Add…");
    await user.type(input, "blur-tag");
    await act(async () => {
      input.blur();
    });
    await waitFor(() => {
      expect(onChange).toHaveBeenCalledWith(["blur-tag"]);
    });
  });

  it("removes tag when remove button is clicked", async () => {
    const user = userEvent.setup();
    const onChange = vi.fn();
    render(<TagsInput value={["a", "b", "c"]} onChange={onChange} />);
    const removeA = screen.getByRole("button", { name: "Remove a" });
    await user.click(removeA);
    expect(onChange).toHaveBeenCalledWith(["b", "c"]);
  });

  it("does not add duplicate tags", async () => {
    const user = userEvent.setup();
    const onChange = vi.fn();
    render(<TagsInput value={["existing"]} onChange={onChange} />);
    const input = screen.getByPlaceholderText("Add…");
    await user.type(input, "existing");
    await user.keyboard("{Enter}");
    expect(onChange).not.toHaveBeenCalled();
  });

  it("associates input with id", () => {
    render(<TagsInput value={[]} onChange={vi.fn()} id="tags-field" />);
    expect(screen.getByPlaceholderText("Add…")).toHaveAttribute(
      "id",
      "tags-field",
    );
  });

  it("disables input and remove buttons when disabled", () => {
    render(<TagsInput value={["tag1"]} onChange={vi.fn()} disabled />);
    expect(screen.getByPlaceholderText("Add…")).toBeDisabled();
    expect(screen.getByRole("button", { name: "Remove tag1" })).toBeDisabled();
  });
});
