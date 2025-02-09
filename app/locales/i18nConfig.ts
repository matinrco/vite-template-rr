import type { InitOptions } from "i18next";

export const i18nConfig: InitOptions = {
  // this is the list of languages your application supports
  supportedLngs: ["en", "fa"],
  /**
   * this is the language you want to use in case
   * if the user language is not in the supportedLngs
   */
  fallbackLng: "en",
  // the default namespace of i18next is "translation", but you can customize it here
  defaultNS: "common",
};
