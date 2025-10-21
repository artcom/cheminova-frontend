import { resolve } from "path"
import eslintPlugin from "@nabla/vite-plugin-eslint"
import react from "@vitejs/plugin-react"
import { defineConfig } from "vite"
import webfontDownload from "vite-plugin-webfont-dl"

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
    webfontDownload(
      [
        "https://fonts.googleapis.com/css2?family=Bricolage+Grotesque:opsz,wght@12..96,200..800&display=swap",
      ],
      {
        injectAsStyleTag: true,
        minifyCss: true,
        async: true,
        cache: true,
        proxy: false,
        subsetsAllowed: ["latin"],
      },
    ),
  ],
  resolve: {
    alias: {
      "@": resolve(__dirname, "./src"),
      "@components": resolve(__dirname, "./src/components"),
      "@hooks": resolve(__dirname, "./src/hooks"),
      "@api": resolve(__dirname, "./src/api"),
      "@ui": resolve(__dirname, "./src/components/UI"),
      "@theme": resolve(__dirname, "./src/theme"),
    },
  },
})
