import { defineConfig } from "vite";
import pluginReact from "@vitejs/plugin-react";
import { reactRouter as pluginReactRouter } from "@react-router/dev/vite";
import pluginTSConfigPaths from "vite-tsconfig-paths";
import pluginDevtoolsJson from "vite-plugin-devtools-json";

const isStorybook = process.argv.join("").includes("storybook");

/**
 * To have a single Vite configuration,
 * we need to detect if we're running in a Storybook environment.
 * This allows us to conditionally use either the React plugin for Storybook
 * or the React Router plugin for our main application.
 */
export default defineConfig({
  plugins: [
    ...(isStorybook ? [pluginReact()] : [pluginReactRouter()]),
    pluginTSConfigPaths(),
    pluginDevtoolsJson(),
  ],
});
