import globals from "globals";
import pluginJs from "@eslint/js";
import pluginTs from "typescript-eslint";
import pluginReact from "eslint-plugin-react";
import pluginReactHooks from "eslint-plugin-react-hooks";
import pluginReactRefresh from "eslint-plugin-react-refresh";
import pluginPrettier from "eslint-plugin-prettier/recommended";
import pluginStorybook from "eslint-plugin-storybook";

/** @type {import('eslint').Linter.Config[]} */
export default [
  { ignores: ["build", ".react-router", ".yarn/releases"] },
  {
    files: ["**/*.{ts,tsx}"],
    languageOptions: {
      ecmaVersion: 2022,
      globals: { ...globals.browser, ...globals.node },
    },
  },
  // js
  pluginJs.configs.recommended,
  // react
  {
    ...pluginReact.configs.flat.recommended,
    settings: {
      react: {
        version: "detect",
      },
    },
    rules: {
      ...pluginReact.configs.flat.recommended.rules,
      ...{ "react/react-in-jsx-scope": "off" },
    },
  },
  // react-hooks
  {
    plugins: {
      "react-hooks": pluginReactHooks,
    },
    rules: {
      ...pluginReactHooks.configs.recommended.rules,
    },
  },
  // react-refresh
  {
    ...pluginReactRefresh.configs.recommended,
    rules: {
      ...pluginReactRefresh.configs.recommended.rules,
      ...{
        "react-refresh/only-export-components": [
          "error",
          {
            allowConstantExport: true,
            allowExportNames: [
              "meta",
              "links",
              "headers",
              "loader",
              "clientLoader",
              "action",
              "clientAction",
              "unstable_middleware",
              "unstable_clientMiddleware",
            ],
          },
        ],
      },
    },
  },
  // ts
  ...pluginTs.configs.recommended,
  {
    rules: {
      // do not check error objects in try...catch  blocks
      "@typescript-eslint/no-unused-vars": [
        "error",
        {
          caughtErrors: "none",
        },
      ],
    },
  },
  // prettier
  pluginPrettier,
  // storybook
  ...pluginStorybook.configs["flat/recommended"],
];
