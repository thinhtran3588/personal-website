import { act, render, screen } from "@testing-library/react";

import { TypedText } from "@/modules/landing-page/presentation/pages/home/components/typed-text";

describe("TypedText", () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it("renders with cursor visible", () => {
    render(<TypedText roles={["Developer"]} />);

    expect(screen.getByText("|")).toBeInTheDocument();
  });

  it("types the first role character by character", () => {
    render(<TypedText roles={["Dev"]} typingSpeed={50} />);

    act(() => {
      vi.advanceTimersByTime(50);
    });
    expect(screen.getByLabelText("Dev")).toHaveTextContent("D|");

    act(() => {
      vi.advanceTimersByTime(50);
    });
    expect(screen.getByLabelText("Dev")).toHaveTextContent("De|");

    act(() => {
      vi.advanceTimersByTime(50);
    });
    expect(screen.getByLabelText("Dev")).toHaveTextContent("Dev|");
  });

  it("pauses then deletes and moves to next role", () => {
    render(
      <TypedText
        roles={["AB", "CD"]}
        typingSpeed={50}
        deletingSpeed={30}
        pauseDuration={100}
      />,
    );

    // Type "AB"
    act(() => {
      vi.advanceTimersByTime(50);
    }); // A
    act(() => {
      vi.advanceTimersByTime(50);
    }); // AB

    // Finish typing step + pause + deleting transition
    act(() => {
      vi.advanceTimersByTime(50);
    }); // charIndex>=2, pausing
    act(() => {
      vi.advanceTimersByTime(100);
    }); // pausing -> deleting

    // Delete characters
    act(() => {
      vi.advanceTimersByTime(30);
    }); // "A"
    act(() => {
      vi.advanceTimersByTime(30);
    }); // ""
    act(() => {
      vi.advanceTimersByTime(30);
    }); // charIndex=0, setRoleIndex(1)

    // Type first character of next role
    act(() => {
      vi.advanceTimersByTime(50);
    }); // "C"
    expect(screen.getByLabelText("CD")).toHaveTextContent("C|");
  });

  it("cycles back to first role after last", () => {
    render(
      <TypedText
        roles={["A", "B"]}
        typingSpeed={50}
        deletingSpeed={30}
        pauseDuration={100}
      />,
    );

    // Type "A"
    act(() => {
      vi.advanceTimersByTime(50);
    }); // A
    // Pausing (charIndex=1 >= length 1)
    act(() => {
      vi.advanceTimersByTime(50);
    }); // pausing
    act(() => {
      vi.advanceTimersByTime(100);
    }); // deleting transition
    // Delete "A"
    act(() => {
      vi.advanceTimersByTime(30);
    }); // ""
    act(() => {
      vi.advanceTimersByTime(30);
    }); // charIndex=0, setRoleIndex(1)

    // Type "B"
    act(() => {
      vi.advanceTimersByTime(50);
    }); // B
    // Pausing (charIndex=1 >= length 1)
    act(() => {
      vi.advanceTimersByTime(50);
    }); // pausing
    act(() => {
      vi.advanceTimersByTime(100);
    }); // deleting transition
    // Delete "B"
    act(() => {
      vi.advanceTimersByTime(30);
    }); // ""
    act(() => {
      vi.advanceTimersByTime(30);
    }); // charIndex=0, setRoleIndex(0)

    // Type first role again
    act(() => {
      vi.advanceTimersByTime(50);
    }); // A
    expect(screen.getByLabelText("A")).toHaveTextContent("A|");
  });
});
