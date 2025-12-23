import type { StoryContext, StoryFn } from "@storybook/react-vite";
import { useEffect } from "react";
import { I18nextProvider } from "react-i18next";
import { i18n } from "./instance";

export const I18n = (Story: StoryFn, context: StoryContext) => {
  const { locale } = context.globals;

  useEffect(() => {
    i18n.changeLanguage(locale);
  }, [locale]);

  return (
    <I18nextProvider i18n={i18n}>
      {Story(context.args, context)}
    </I18nextProvider>
  );
};
