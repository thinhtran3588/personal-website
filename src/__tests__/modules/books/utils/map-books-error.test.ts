import { describe, expect, it } from "vitest";

import { mapBooksError } from "@/modules/books/utils/map-books-error";

describe("mapBooksError", () => {
  it("returns generic for any error", () => {
    expect(mapBooksError(new Error("permission denied"))).toBe("generic");
    expect(mapBooksError(new Error())).toBe("generic");
    expect(mapBooksError("string")).toBe("generic");
  });
});
