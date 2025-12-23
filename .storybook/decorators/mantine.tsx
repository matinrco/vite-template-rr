import {
  ColorSchemeScript,
  DirectionProvider,
  MantineProvider,
} from "@mantine/core";
import { Notifications } from "@mantine/notifications";
import type { StoryContext, StoryFn } from "@storybook/react";
import i18n from "i18next";
import { createTheme } from "~/utils/theme";

export const Mantine = (Story: StoryFn, context: StoryContext) => {
  const { locale } = context.globals;
  const scheme = (context.globals.theme || "light") as "light" | "dark";

  return (
    <DirectionProvider initialDirection={i18n.dir(locale)}>
      <MantineProvider
        theme={createTheme({ dir: i18n.dir(locale) })}
        forceColorScheme={scheme}
      >
        <ColorSchemeScript />
        <Notifications />
        {Story(context.args, context)}
      </MantineProvider>
    </DirectionProvider>
  );
};
