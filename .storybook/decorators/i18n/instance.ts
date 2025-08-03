import i18n from "i18next";
import { i18nConfig } from "~/locales/i18nConfig";
import { resources } from "~/locales/i18nServer";

i18n.init({
  fallbackLng: i18nConfig.fallbackLng,
  interpolation: {
    escapeValue: false,
  },
  ns:
    // extract all namespaces from resources
    Object.entries(resources)
      .map((entry) => entry[1])
      .reduce<string[]>((acc, ns) => {
        const nsList = Object.keys(ns);

        nsList.forEach((nsItem) => {
          if (!acc.includes(nsItem)) {
            acc.push(nsItem);
          }
        });

        return acc;
      }, []),
  resources,
  defaultNS: i18nConfig.defaultNS,
});

i18n.on("languageChanged", (locale) => {
  document.dir = i18n.dir(locale);
  document.querySelector("html")?.setAttribute("lang", locale);
});

export { i18n };
