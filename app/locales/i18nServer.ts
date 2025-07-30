import { createCookie } from "react-router";
import { initReactI18next as i18nPluginInitReact } from "react-i18next";
import { unstable_createI18nextMiddleware as createI18nMiddleware } from "remix-i18next/middleware";
import { i18nConfig } from "~/locales/i18nConfig";

const localeKey = "locale";

export const localeCookie = createCookie(localeKey, {
  path: "/",
  sameSite: "lax",
  secure: false,
  httpOnly: true,
});

const allFiles = import.meta.glob<{
  default: Record<string, string>;
}>("/app/locales/**/*.json", {
  eager: true,
});

export const resources: Record<
  string,
  Record<string, Record<string, string>>
> = Object.keys(allFiles).reduce(
  (
    localeAccumulator: Record<string, Record<string, Record<string, string>>>,
    filePath,
  ) => {
    // extract locale from the file path
    const match = filePath.match(/\/([a-z]{2})\//);
    if (!match) return localeAccumulator;
    const locale = match[1];

    // extract namespace from the file name
    const namespace =
      filePath
        .split("/")
        .pop()
        ?.replace(/\.[^/.]+$/, "") || "";

    // ensure the locale exists in the accumulator
    if (!localeAccumulator[locale]) {
      localeAccumulator[locale] = {};
    }

    // assign JSON content to the namespace
    localeAccumulator[locale][namespace] = allFiles[filePath].default;

    return localeAccumulator;
  },
  {} as Record<string, Record<string, Record<string, string>>>, // explicitly type the initial object
);

export const [i18nMiddleware, getLocale, getI18nInstance] =
  createI18nMiddleware({
    detection: {
      supportedLanguages: i18nConfig.supportedLngs as string[],
      fallbackLanguage: i18nConfig.fallbackLng as string,
      cookie: localeCookie,
      searchParamKey: localeKey,
      // remove header from orders if you want to disable automatic locale detection
      order: ["searchParams", "cookie", "header"],
    },
    /**
     * this is the configuration for i18next used
     * when translating messages server-side only
     */
    i18next: {
      ...i18nConfig,
      resources,
    },
    /**
     * the i18next plugins you want RemixI18next to use for `i18n.getFixedT` inside loaders and actions.
     * e.g. the backend plugin for loading translations from the file system
     * tip: you could pass `resources` to the `i18next` configuration and avoid a backend here
     */
    plugins: [i18nPluginInitReact],
  });
