import { fixupPluginRules } from "@eslint/compat"
import js from "@eslint/js"
import * as ReactThree from "@react-three/eslint-plugin"
import pluginQuery from "@tanstack/eslint-plugin-query"
import eslintConfigPrettier from "eslint-config-prettier"
import { flatConfigs } from "eslint-plugin-import-x"
import pluginJsxA11y from "eslint-plugin-jsx-a11y"
import pluginReact from "eslint-plugin-react"
import pluginReactHooks from "eslint-plugin-react-hooks"
import pluginReactRefresh from "eslint-plugin-react-refresh"
import globals from "globals"

export default [
  {
    ignores: [
      "build/**",
      "dist/**",
      "coverage/**",
      "**/node_modules/**",
      "**/.react-router/**",
    ],
  },

  js.configs.recommended,

  flatConfigs.recommended,
  flatConfigs.react,

  pluginJsxA11y.flatConfigs.recommended,

  {
    languageOptions: {
      globals: {
        ...globals.browser,
      },
      parserOptions: {
        ecmaVersion: "latest",
        sourceType: "module",
        ecmaFeatures: {
          jsx: true,
        },
      },
    },
    settings: {
      "import-x/resolver": {
        alias: {
          map: [
            ["@", "./src"],
            ["@components", "./src/components"],
            ["@hooks", "./src/hooks"],
            ["@api", "./src/api"],
            ["@ui", "./src/components/UI"],
            ["@providers", "./src/providers"],
            ["@utils", "./src/utils"],
          ],
          extensions: [".js", ".jsx", ".json"],
        },
        node: {
          extensions: [".js", ".jsx", ".mjs"],
        },
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

  {
    files: ["**/*.{js,mjs,cjs,jsx}"],
    ...pluginReact.configs.flat.recommended,
  },
  {
    files: ["**/*.{js,mjs,cjs,jsx}"],
    ...pluginReact.configs.flat["jsx-runtime"],
  },

  {
    plugins: {
      "react-hooks": fixupPluginRules(pluginReactHooks),
    },
    rules: {
      ...pluginReactHooks.configs.recommended.rules,
      "react-hooks/exhaustive-deps": "warn",
    },
  },

  {
    files: ["**/*.{js,jsx}"],
    plugins: {
      "react-refresh": pluginReactRefresh,
    },
    rules: {
      "react-refresh/only-export-components": [
        "warn",
        {
          allowConstantExport: true,
          allowExportNames: [
            "clientLoader",
            "links",
            "meta",
            "HydrateFallback",
            "ErrorBoundary",
            "AppLayout",
            "id",
            "useLanguages",
          ],
        },
      ],
    },
  },

  ...pluginQuery.configs["flat/recommended"],

  {
    files: ["src/components/Gallery/**/*.{js,jsx}"],
    plugins: {
      "@react-three": fixupPluginRules(ReactThree),
    },
    rules: {
      ...ReactThree.configs.recommended.rules,
      "react/no-unknown-property": "off",
    },
  },

  {
    rules: {
      "react/prop-types": "off",
    },
    settings: {
      react: {
        version: "detect",
      },
    },
  },

  eslintConfigPrettier,
]
