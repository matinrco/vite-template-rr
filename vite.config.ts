import path from "path";
import { reactRouter as pluginReactRouter } from "@react-router/dev/vite";
import pluginReact from "@vitejs/plugin-react";
import { defineConfig } from "vite";
import pluginDevtoolsJson from "vite-plugin-devtools-json";
import pluginTSConfigPaths from "vite-tsconfig-paths";

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
  resolve: {
    alias: [
      {
        /**
         * Alias the root import of `react-date-object` to its ES module build.
         *
         * Context:
         * - `react-multi-date-picker` depends on `react-date-object`.
         * - When importing `DateObject` directly from `react-multi-date-picker` like:
         *     `import { DateObject } from "react-multi-date-picker"`
         *   it internally resolves to a CommonJS build, which causes Vite to throw a CJS bundling error.
         *
         * Why this alias:
         * - Instead of importing `DateObject` from `react-multi-date-picker`, I import it directly from `react-date-object`.
         * - To avoid the CJS import issue, I alias the root of `react-date-object` to its ESM build (`dist/index.module.js`).
         * - This allows direct imports like `import DateObject from "react-date-object"` to work correctly with Vite.
         *
         * Scope:
         * - The alias uses a regex (`/^react-date-object$/`) to only target the root import.
         * - Subpath imports like `react-date-object/locales/...` and `react-date-object/calendars/...` continue to work without interference.
         *
         * SSR Note:
         * - Some components from `react-multi-date-picker`, such as `DatePicker`, still cause SSR errors in Vite.
         * - To fix this, I wrap them in a custom `<NoSSR>` component to defer rendering to the client side only.
         *
         * Final Result:
         * ✅ `import DateObject from "react-date-object"` works without bundling errors.
         * ❌ `import { DateObject } from "react-multi-date-picker"` causes a CJS error (even with alias).
         * ✅ `import DatePicker from "react-multi-date-picker"` works when wrapped in `<NoSSR>` to avoid SSR errors.
         */
        find: /^react-date-object$/,
        replacement: path.resolve(
          __dirname,
          "node_modules/react-date-object/dist/index.module.js",
        ),
      },
    ],
  },
});
