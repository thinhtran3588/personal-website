import { render, screen } from "@testing-library/react";
import { vi } from "vitest";
import { DocPage } from "@/modules/docs/presentation/pages/doc/page";

const mockGetLocale = vi.fn().mockResolvedValue("vi");
vi.mock("next-intl/server", () => ({
  getLocale: (...args: unknown[]) => mockGetLocale(...args),
  getTranslations: vi.fn(() =>
    Promise.resolve((key: string) =>
      key === "navigation.backToHome" ? "Back to home" : key,
    ),
  ),
}));

const mockReadDocContent = vi.fn();
vi.mock("@/common/utils/read-doc", () => ({
  readDocContent: (...args: unknown[]) => mockReadDocContent(...args),
}));

vi.mock("next/navigation", () => ({
  notFound: vi.fn(() => {
    throw new Error("notFound");
  }),
}));

describe("DocPage", () => {
  beforeEach(() => {
    mockReadDocContent.mockReset();
    mockGetLocale.mockResolvedValue("vi");
  });

  it("calls notFound when locale is not supported", async () => {
    mockGetLocale.mockResolvedValue("fr");
    const { notFound } = await import("next/navigation");

    await expect(DocPage({ slug: "architecture" })).rejects.toThrow(
      "notFound",
    );
    expect(notFound).toHaveBeenCalled();
    expect(mockReadDocContent).not.toHaveBeenCalled();
  });

  it("renders doc content and back button when content exists", async () => {
    mockReadDocContent.mockResolvedValue("# Architecture\n\nContent here.");

    const page = await DocPage({ slug: "architecture" });
    render(page);

    expect(
      screen.getByRole("heading", { level: 1, name: "Architecture" }),
    ).toBeInTheDocument();
    expect(screen.getByText("Content here.")).toBeInTheDocument();
    expect(
      screen.getByRole("link", { name: "Back to home" }),
    ).toHaveAttribute("href", "/");
  });

  it("calls notFound when content is null", async () => {
    mockReadDocContent.mockResolvedValue(null);
    const { notFound } = await import("next/navigation");

    await expect(DocPage({ slug: "architecture" })).rejects.toThrow("notFound");
    expect(notFound).toHaveBeenCalled();
  });

  it("calls notFound when slug is invalid", async () => {
    mockReadDocContent.mockResolvedValue(null);
    const { notFound } = await import("next/navigation");

    await expect(DocPage({ slug: "invalid-slug" })).rejects.toThrow("notFound");
    expect(notFound).toHaveBeenCalled();
  });
});
