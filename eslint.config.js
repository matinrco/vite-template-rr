import pluginJs from "@eslint/js";
import pluginImport from "eslint-plugin-import";
import pluginPrettier from "eslint-plugin-prettier/recommended";
import pluginReact from "eslint-plugin-react";
import pluginReactHooks from "eslint-plugin-react-hooks";
import pluginReactRefresh from "eslint-plugin-react-refresh";
import pluginStorybook from "eslint-plugin-storybook";
import globals from "globals";
import pluginTs from "typescript-eslint";

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
  // customize generic rules
  {
    rules: {
      "no-restricted-syntax": [
        "error",
        "FunctionDeclaration",
        {
          selector: "FunctionExpression",
        },
      ],
    },
  },
  // js
  pluginJs.configs.recommended,
  // import
  {
    plugins: {
      import: pluginImport,
    },
    settings: {
      "import/internal-regex": "^~/",
    },
    rules: {
      "import/first": "error",
      "import/newline-after-import": "error",
      "import/consistent-type-specifier-style": ["error", "prefer-top-level"],
      "import/no-duplicates": "error",
      "import/enforce-node-protocol-usage": ["error", "never"],
      "import/no-absolute-path": "error",
      "import/order": [
        "error",
        {
          groups: [
            "builtin",
            "external",
            "internal",
            "parent",
            "sibling",
            "index",
          ],
          pathGroups: [
            {
              pattern: "**/*.css",
              group: "index",
              position: "after",
            },
          ],
          "newlines-between": "never",
          warnOnUnassignedImports: true,
          named: true,
          alphabetize: { order: "asc" },
        },
      ],
    },
  },
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
              "middleware",
              "clientMiddleware",
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
