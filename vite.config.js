import { resolve } from "path"
import eslintPlugin from "@nabla/vite-plugin-eslint"
import { reactRouter } from "@react-router/dev/vite"
import { defineConfig } from "vite"
import devtools from "vite-plugin-devtools-json"
import webfontDownload from "vite-plugin-webfont-dl"

export default defineConfig(() => ({
  base: process.env.VITE_BASE_PATH || "/",
  plugins: [
    ...reactRouter({
      routes: "./src/routes.js",
      react: {
        babel: {
          plugins: [
            ["babel-plugin-react-compiler"],
            ["babel-plugin-styled-components"],
          ],
        },
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
    devtools(),
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

  server: {
    proxy: {
      "/api": {
        target: "http://localhost:8080",
        changeOrigin: true,
        secure: false,
        ws: true,
        configure: (proxy) => {
          proxy.on("error", (err) => {
            console.log("proxy error", err)
          })
          proxy.on("proxyReq", (_proxyReq, req) => {
            console.log("Sending Request to the Target:", req.method, req.url)
          })
          proxy.on("proxyRes", (proxyRes, req) => {
            console.log(
              "Received Response from the Target:",
              proxyRes.statusCode,
              req.url,
            )
          })
        },
      },
    },
  },
}))
