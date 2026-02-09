import { render } from "@testing-library/react";

import {
  BackArrowIcon,
  ChevronDownIcon,
  CloudGearIcon,
  EyeIcon,
  EyeOffIcon,
  FacebookIcon,
  FlutterIcon,
  GitHubIcon,
  LinkedInIcon,
  LoaderIcon,
  MenuIcon,
  MonitorIcon,
  MoonIcon,
  NodejsIcon,
  ReactIcon,
  SolidityIcon,
  SunIcon,
  XIcon,
} from "@/common/components/icons";

describe("Icons", () => {
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

  it("LinkedInIcon renders", () => {
    const { container } = render(<LinkedInIcon />);
    expect(container.querySelector("svg")).toBeInTheDocument();
  });

  it("FacebookIcon renders", () => {
    const { container } = render(<FacebookIcon />);
    expect(container.querySelector("svg")).toBeInTheDocument();
  });

  it("ReactIcon renders", () => {
    const { container } = render(<ReactIcon />);
    expect(container.querySelector("svg")).toBeInTheDocument();
  });

  it("NodejsIcon renders", () => {
    const { container } = render(<NodejsIcon />);
    expect(container.querySelector("svg")).toBeInTheDocument();
  });

  it("FlutterIcon renders", () => {
    const { container } = render(<FlutterIcon />);
    expect(container.querySelector("svg")).toBeInTheDocument();
  });

  it("SolidityIcon renders", () => {
    const { container } = render(<SolidityIcon />);
    expect(container.querySelector("svg")).toBeInTheDocument();
  });

  it("CloudGearIcon renders", () => {
    const { container } = render(<CloudGearIcon />);
    expect(container.querySelector("svg")).toBeInTheDocument();
  });

  it("GitHubIcon renders with aria-hidden", () => {
    const { container } = render(<GitHubIcon />);
    const svg = container.querySelector("svg");
    expect(svg).toBeInTheDocument();
    expect(svg).toHaveAttribute("aria-hidden");
  });

  it("GitHubIcon applies className", () => {
    const { container } = render(<GitHubIcon className="h-5 w-5" />);
    expect(container.querySelector("svg")).toHaveClass("h-5", "w-5");
  });
});
