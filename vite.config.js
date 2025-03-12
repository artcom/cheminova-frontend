import eslintPlugin from "@nabla/vite-plugin-eslint"
import react from "@vitejs/plugin-react"
import { defineConfig } from "vite"

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
})
