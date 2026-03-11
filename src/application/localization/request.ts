import { getRequestConfig } from "next-intl/server";

import enMessages from "@/application/localization/en.json";
import enResumeMessages from "@/application/localization/resume.json";
import viResumeMessages from "@/application/localization/resume.vi.json";
import zhResumeMessages from "@/application/localization/resume.zh.json";
import viMessages from "@/application/localization/vi.json";
import zhMessages from "@/application/localization/zh.json";
import { isSupportedLocale, routing } from "@/common/routing/routing";

function mergeHomeResume<TMessages extends typeof enMessages>(
  messages: TMessages,
  resume: unknown,
) {
  return {
    ...messages,
    modules: {
      ...messages.modules,
      landing: {
        ...messages.modules.landing,
        pages: {
          ...messages.modules.landing.pages,
          home: {
            ...messages.modules.landing.pages.home,
            resume,
          },
        },
      },
    },
  };
}

const messagesByLocale = {
  en: mergeHomeResume(enMessages, enResumeMessages),
  vi: mergeHomeResume(viMessages, viResumeMessages),
  zh: mergeHomeResume(zhMessages, zhResumeMessages),
} as const;

type RequestConfigParams = {
  requestLocale: Promise<string | undefined>;
};

export async function requestConfig({ requestLocale }: RequestConfigParams) {
  const locale = await requestLocale;
  const resolvedLocale = isSupportedLocale(locale)
    ? locale
    : routing.defaultLocale;

  return {
    locale: resolvedLocale,
    messages: messagesByLocale[resolvedLocale],
  };
}

export default getRequestConfig(requestConfig);
