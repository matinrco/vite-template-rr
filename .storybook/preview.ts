import type { Preview } from "@storybook/react";
import { i18nConfig } from "~/locales/i18nConfig";
import { I18n as decoratorI18n } from "./decorators/i18n";
import { Mantine as decoratorMantine } from "./decorators/mantine";
import "~/app.css";

export const decorators = [decoratorI18n, decoratorMantine];

const preview: Preview = {
  parameters: {
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/i,
      },
    },
  },
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
