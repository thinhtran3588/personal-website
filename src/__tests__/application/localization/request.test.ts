import enMessages from "@/application/localization/en.json";
import requestConfig, {
  requestConfig as resolveRequestConfig,
} from "@/application/localization/request";
import viMessages from "@/application/localization/vi.json";

describe("request config", () => {
  it("loads messages for the requested locale", async () => {
    const result = await requestConfig({
      requestLocale: Promise.resolve("en"),
    });

    expect(result).toEqual({ locale: "en", messages: enMessages });
  });

  it("returns messages from the named config function", async () => {
    const result = await resolveRequestConfig({
      requestLocale: Promise.resolve("en"),
    });

    expect(result).toEqual({ locale: "en", messages: enMessages });
  });

  it("falls back to default locale when unsupported", async () => {
    const result = await requestConfig({
      requestLocale: Promise.resolve("fr"),
    });

    expect(result).toEqual({ locale: "en", messages: enMessages });
  });

  it("loads messages for Vietnamese locale", async () => {
    const result = await requestConfig({
      requestLocale: Promise.resolve("vi"),
    });

    expect(result).toEqual({ locale: "vi", messages: viMessages });
  });
});
