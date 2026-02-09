import { render } from "@testing-library/react";

import {
  AppleIcon,
  BackArrowIcon,
  ChevronDownIcon,
  EyeIcon,
  EyeOffIcon,
  GoogleIcon,
  LoaderIcon,
  MailIcon,
  MenuIcon,
  MonitorIcon,
  MoonIcon,
  PencilIcon,
  PlusIcon,
  SunIcon,
  UserIcon,
  XIcon,
} from "@/common/components/icons";

describe("Icons", () => {
  it("GoogleIcon renders svg with aria-hidden", () => {
    const { container } = render(<GoogleIcon />);
    const svg = container.querySelector("svg");
    expect(svg).toBeInTheDocument();
    expect(svg).toHaveAttribute("aria-hidden");
  });

  it("GoogleIcon applies className", () => {
    const { container } = render(<GoogleIcon className="w-6" />);
    expect(container.querySelector("svg")).toHaveClass("w-6");
  });

  it("MailIcon renders svg", () => {
    const { container } = render(<MailIcon />);
    expect(container.querySelector("svg")).toBeInTheDocument();
  });

  it("BackArrowIcon renders with optional className", () => {
    const { container } = render(<BackArrowIcon className="size-4" />);
    expect(container.querySelector("svg")).toBeInTheDocument();
    expect(container.querySelector("svg")).toHaveClass("size-4");
  });

  it("LoaderIcon renders with className", () => {
    const { container } = render(<LoaderIcon className="animate-spin" />);
    const svg = container.querySelector("svg");
    expect(svg).toHaveClass("animate-spin");
  });

  it("EyeIcon and EyeOffIcon render", () => {
    const { container: c1 } = render(<EyeIcon />);
    const { container: c2 } = render(<EyeOffIcon />);
    expect(c1.querySelector("svg")).toBeInTheDocument();
    expect(c2.querySelector("svg")).toBeInTheDocument();
  });

  it("ChevronDownIcon renders", () => {
    const { container } = render(<ChevronDownIcon />);
    expect(container.querySelector("svg")).toBeInTheDocument();
  });

  it("MenuIcon renders", () => {
    const { container } = render(<MenuIcon />);
    expect(container.querySelector("svg")).toBeInTheDocument();
  });

  it("AppleIcon renders", () => {
    const { container } = render(<AppleIcon />);
    expect(container.querySelector("svg")).toBeInTheDocument();
  });

  it("UserIcon renders", () => {
    const { container } = render(<UserIcon />);
    expect(container.querySelector("svg")).toBeInTheDocument();
  });

  it("SunIcon, MoonIcon and MonitorIcon render", () => {
    const { container: c1 } = render(<SunIcon />);
    const { container: c2 } = render(<MoonIcon />);
    const { container: c3 } = render(<MonitorIcon />);
    expect(c1.querySelector("svg")).toBeInTheDocument();
    expect(c2.querySelector("svg")).toBeInTheDocument();
    expect(c3.querySelector("svg")).toBeInTheDocument();
  });

  it("XIcon renders", () => {
    const { container } = render(<XIcon className="size-3" />);
    expect(container.querySelector("svg")).toBeInTheDocument();
    expect(container.querySelector("svg")).toHaveClass("size-3");
  });

  it("PencilIcon and PlusIcon render", () => {
    const { container: c1 } = render(<PencilIcon className="size-4" />);
    const { container: c2 } = render(<PlusIcon className="size-4" />);
    expect(c1.querySelector("svg")).toBeInTheDocument();
    expect(c2.querySelector("svg")).toBeInTheDocument();
  });
});
