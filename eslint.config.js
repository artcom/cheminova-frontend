import globals from "globals"
import pluginJs from "@eslint/js"
import pluginReact from "eslint-plugin-react"
import pluginReactHooks from "eslint-plugin-react-hooks"
import eslintConfigPrettier from "eslint-config-prettier"
import reactCompiler from "eslint-plugin-react-compiler"
import pluginQuery from "@tanstack/eslint-plugin-query"
import ReactThree from "@react-three/eslint-plugin"

/** @type {import('eslint').Linter.Config[]} */
export default [
  {
    languageOptions: {
      globals: {
        ...globals.browser,
      },
    },
  },

  {
    files: ["**/*.config.{js,mjs,cjs}", "vite.config.js", "eslint.config.js"],
    languageOptions: {
      globals: {
        ...globals.node,
        __dirname: "readonly",
        __filename: "readonly",
        process: "readonly",
        Buffer: "readonly",
      },
    },
  },

  pluginJs.configs.recommended,

  {
    files: ["**/*.{js,mjs,cjs,jsx}"],
    plugins: {
      react: pluginReact,
      "react-hooks": pluginReactHooks,
      "react-compiler": reactCompiler,
      "@tanstack/query": pluginQuery,
    },
    languageOptions: {
      ...pluginReact.configs.flat.recommended.languageOptions,
    },
    rules: {
      ...pluginReact.configs.flat.recommended.rules,
      ...pluginReact.configs.flat["jsx-runtime"].rules,
      ...pluginQuery.configs["flat/recommended"].rules,
      ...pluginReactHooks.configs.recommended.rules,
      "react-compiler/react-compiler": "error",
      "react/prop-types": "off",
      "react-hooks/exhaustive-deps": "warn",
    },
    settings: {
      react: {
        version: "detect",
      },
    },
  },

  {
    files: ["src/components/Gallery/**/*.{js,jsx}"],
    plugins: {
      "@react-three": ReactThree,
    },
    rules: {
      ...ReactThree.configs.recommended.rules,
      "react/no-unknown-property": "off",
    },
  },

  eslintConfigPrettier,
]
