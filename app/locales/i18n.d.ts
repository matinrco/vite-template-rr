import type { i18n } from "i18next";

interface Locales {
  en: {
    common: typeof import("~/locales/en/common.json");
    about: typeof import("~/locales/en/about.json");
  };
  fa: {
    common: typeof import("~/locales/fa/common.json");
    about: typeof import("~/locales/fa/about.json");
  };
}

declare module "i18next" {
  interface CustomTypeOptions extends i18n {
    resources: Locales["en"];
  }
}
