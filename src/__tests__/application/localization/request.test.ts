import enMessages from "@/application/localization/en.json";
import requestConfig, {
  requestConfig as resolveRequestConfig,
} from "@/application/localization/request";
import enResumeMessages from "@/application/localization/resume.json";
import viResumeMessages from "@/application/localization/resume.vi.json";
import viMessages from "@/application/localization/vi.json";

const withResume = <
  TMessages extends typeof enMessages | typeof viMessages,
  TResume,
>(
  messages: TMessages,
  resumeMessages: TResume,
) => ({
  ...messages,
  modules: {
    ...messages.modules,
    landing: {
      ...messages.modules.landing,
      pages: {
        ...messages.modules.landing.pages,
        home: {
          ...messages.modules.landing.pages.home,
          resume: resumeMessages,
        },
      },
    },
  },
});

const expectedEnMessages = withResume(enMessages, enResumeMessages);
const expectedViMessages = withResume(viMessages, viResumeMessages);

describe("request config", () => {
  it("loads messages for the requested locale", async () => {
    const result = await requestConfig({
      requestLocale: Promise.resolve("en"),
    });

    expect(result).toEqual({ locale: "en", messages: expectedEnMessages });
  });

  it("returns messages from the named config function", async () => {
    const result = await resolveRequestConfig({
      requestLocale: Promise.resolve("en"),
    });

    expect(result).toEqual({ locale: "en", messages: expectedEnMessages });
  });

  it("falls back to default locale when unsupported", async () => {
    const result = await requestConfig({
      requestLocale: Promise.resolve("fr"),
    });

    expect(result).toEqual({ locale: "en", messages: expectedEnMessages });
  });

  it("loads messages for Vietnamese locale", async () => {
    const result = await requestConfig({
      requestLocale: Promise.resolve("vi"),
    });

    expect(result).toEqual({ locale: "vi", messages: expectedViMessages });
  });
});
