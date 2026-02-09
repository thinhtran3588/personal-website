import { render, screen } from "@testing-library/react";

import messages from "@/application/localization/en.json";
import { ProductsPage } from "@/modules/landing-page/presentation/pages/products/page";

const products = messages.modules.landing.pages.products;

describe("ProductsPage", () => {
  it("renders the page title", async () => {
    render(await ProductsPage());

    expect(
      screen.getByRole("heading", { name: products.title }),
    ).toBeInTheDocument();
  });

  it("renders the eyebrow text", async () => {
    render(await ProductsPage());

    expect(screen.getByText(products.eyebrow)).toBeInTheDocument();
  });

  it("renders coming soon message", async () => {
    render(await ProductsPage());

    expect(screen.getByText(products.comingSoon)).toBeInTheDocument();
    expect(
      screen.getByText(products.comingSoonDescription),
    ).toBeInTheDocument();
  });
});
