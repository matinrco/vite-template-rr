import type { Preview } from "@storybook/react-vite";
import { i18nConfig } from "~/locales/i18nConfig";
import { I18n as decoratorI18n } from "./decorators/i18n";
import "~/app.css";

export const decorators = [decoratorI18n];

const preview: Preview = {
  parameters: {},
  globalTypes: {
    locale: {
      name: "Locale",
      description: "Internationalization locale",
      defaultValue: i18nConfig.fallbackLng,
      toolbar: {
        icon: "globe",
        items: (i18nConfig.supportedLngs as string[]).map((locale) => ({
          value: locale,
          title: locale.toUpperCase(),
        })),
        showName: true,
        dynamicTitle: true,
      },
    },
  },
};

export default preview;
