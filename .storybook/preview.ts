import type { Preview } from "@storybook/react-vite";
import { i18nConfig } from "~/locales/i18nConfig";
import { I18n as decoratorI18n } from "./decorators/i18n";
import { Mantine as decoratorMantine } from "./decorators/mantine";
import "~/app.css";

export const decorators = [decoratorI18n, decoratorMantine];

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
    theme: {
      name: "Theme",
      description: "Mantine color scheme",
      defaultValue: "light",
      toolbar: {
        icon: "mirror",
        items: [
          { value: "light", title: "Light" },
          { value: "dark", title: "Dark" },
        ],
      },
    },
  },
};

export default preview;
