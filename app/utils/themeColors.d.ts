/**
 * here is mantine type extension & override.
 * don't forget to check theme.ts.
 */
import type { DefaultMantineColor, MantineColorsTuple } from "@mantine/core";

type ExtendedCustomColors = "brand" | DefaultMantineColor;

declare module "@mantine/core" {
  export interface MantineThemeColorsOverride {
    colors: Record<ExtendedCustomColors, MantineColorsTuple>;
  }
}
