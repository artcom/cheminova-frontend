import globals from "globals"
import pluginJs from "@eslint/js"
import pluginReact from "eslint-plugin-react"
import pluginReactHooks from "eslint-plugin-react-hooks"
import eslintConfigPrettier from "eslint-config-prettier"
import reactCompiler from "eslint-plugin-react-compiler"
import pluginQuery from "@tanstack/eslint-plugin-query"

/** @type {import('eslint').Linter.Config[]} */
export default [
  {
    files: ["**/*.{js,mjs,cjs,jsx}"],
    settings: {
      react: {
        version: "detect",
      },
    },
    plugins: {
      "react-hooks": pluginReactHooks,
      "react-compiler": reactCompiler,
    },
    rules: {
      "react-compiler/react-compiler": "error",
    },
  },
  { languageOptions: { globals: globals.browser } },
  ...pluginQuery.configs["flat/recommended"],
  pluginJs.configs.recommended,
  pluginReact.configs.flat.recommended,
  pluginReact.configs.flat["jsx-runtime"],
  eslintConfigPrettier,
]
