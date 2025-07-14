import react from "@vitejs/plugin-react";
import { reactRouter } from "@react-router/dev/vite";
import { reactRouterDevTools } from "react-router-devtools";
import { defineConfig } from "vite";
import tsconfigPaths from "vite-tsconfig-paths";
import devtoolsJson from "vite-plugin-devtools-json";

const isStorybook = process.argv.join("").includes("storybook");

/**
 * To have a single Vite configuration,
 * we need to detect if we're running in a Storybook environment.
 * This allows us to conditionally use either the React plugin for Storybook
 * or the React Router plugin for our main application.
 */
export default defineConfig({
  plugins: [
    ...(isStorybook ? [react()] : [reactRouterDevTools(), reactRouter()]),
    tsconfigPaths(),
    devtoolsJson(),
  ],
});
