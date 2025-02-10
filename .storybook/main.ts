import type { StorybookConfig } from "@storybook/react-vite";

const config: StorybookConfig = {
  stories: ["../app/components/**/*.stories.@(ts|tsx)"],
  addons: [
    "@storybook/addon-onboarding",
    "@storybook/addon-essentials",
    "@storybook/addon-interactions",
    "storybook-dark-mode",
  ],
  framework: {
    name: "@storybook/react-vite",
    options: {},
  },
};
export default config;
