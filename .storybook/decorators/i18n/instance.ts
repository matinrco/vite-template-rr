import i18n from "i18next";
import { i18nConfig } from "~/locales/i18nConfig";

const allFiles = import.meta.glob<{
  default: Record<string, string>;
}>("/app/locales/**/*.json", {
  eager: true,
});

const resources: Record<
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
