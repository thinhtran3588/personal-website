import { describe, expect, it } from "vitest";

import {
  getYearsOfExperience,
  START_WORKING_YEAR,
} from "@/application/config/personal-info";

describe("personal-info", () => {
  it("exports START_WORKING_YEAR as 2011", () => {
    expect(START_WORKING_YEAR).toBe(2011);
  });

  it("calculates years of experience from current year", () => {
    const expected = new Date().getFullYear() - START_WORKING_YEAR;
    expect(getYearsOfExperience()).toBe(expected);
  });
});
