import type { StoryFn, StoryContext } from "@storybook/react";
import {
  DirectionProvider,
  MantineProvider,
  ColorSchemeScript,
} from "@mantine/core";
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
        {Story(context.args, context)}
      </MantineProvider>
    </DirectionProvider>
  );
};
