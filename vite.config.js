import eslintPlugin from "@nabla/vite-plugin-eslint"
import react from "@vitejs/plugin-react"
import { defineConfig } from "vite"
import { resolve } from "path"

export default defineConfig({
  plugins: [
    react({
      babel: {
        plugins: [
          ["babel-plugin-react-compiler"],
          ["babel-plugin-styled-components"],
        ],
      },
    }),
    eslintPlugin(),
  ],
  resolve: {
    alias: {
      "@": resolve(__dirname, "./src"),
      "@components": resolve(__dirname, "./src/components"),
      "@hooks": resolve(__dirname, "./src/hooks"),
      "@api": resolve(__dirname, "./src/api"),
    },
  },
})
