import { resolve } from "node:path";
import { createCookie } from "react-router";
import i18nPluginFsBackend from "i18next-fs-backend/cjs";
import { RemixI18Next as RemixI18n } from "remix-i18next/server";
import { i18nConfig } from "~/locales/i18nConfig";

const localeKey = "locale";

export const localeCookie = createCookie(localeKey, {
  path: "/",
  sameSite: "lax",
  secure: false,
  httpOnly: true,
});

export const i18nServer = new RemixI18n({
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
    backend: {
      loadPath: resolve("./app/locales/{{lng}}/{{ns}}.json"),
    },
  },
  /**
   * the i18next plugins you want RemixI18next to use for `i18n.getFixedT` inside loaders and actions.
   * e.g. the backend plugin for loading translations from the file system
   * tip: you could pass `resources` to the `i18next` configuration and avoid a backend here
   */
  plugins: [i18nPluginFsBackend],
});
