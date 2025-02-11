import { useCallback, useEffect, type FC, type PropsWithChildren } from "react";
import type { StoryFn, StoryContext } from "@storybook/react";
import { addons } from "@storybook/preview-api";
import { DARK_MODE_EVENT_NAME } from "storybook-dark-mode";
import { MantineProvider, useMantineColorScheme } from "@mantine/core";
import i18n from "i18next";
import { createTheme } from "~/utils/createTheme";

const channel = addons.getChannel();

const ColorSchemeWrapper: FC<PropsWithChildren> = ({ children }) => {
  const { setColorScheme } = useMantineColorScheme();

  const handleColorScheme = useCallback(
    (value: boolean) => setColorScheme(value ? "dark" : "light"),
    [setColorScheme],
  );

  useEffect(() => {
    channel.on(DARK_MODE_EVENT_NAME, handleColorScheme);

    return () => channel.off(DARK_MODE_EVENT_NAME, handleColorScheme);
  }, [handleColorScheme]);

  return <>{children}</>;
};

export const Mantine = (Story: StoryFn, context: StoryContext) => {
  const { locale } = context.globals;

  return (
    <MantineProvider theme={createTheme({ dir: i18n.dir(locale) })}>
      <ColorSchemeWrapper>{Story(context.args, context)}</ColorSchemeWrapper>
    </MantineProvider>
  );
};
