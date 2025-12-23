import vscodeSettings from "./.vscode/settings.json" with { type: "json" };

/**
 * @type {import("@commitlint/types").UserConfig}
 */
export default {
  extends: ["@commitlint/config-conventional"],
  rules: {
    "scope-enum": [2, "always", vscodeSettings["conventionalCommits.scopes"]],
  },
};
