import fs from "fs"
import { resolve } from "path"
import eslintPlugin from "@nabla/vite-plugin-eslint"
import { reactRouter } from "@react-router/dev/vite"
import { defineConfig } from "vite"

export default defineConfig(() => {
  const CMS_PROXY_TARGET = "http://localhost:8080"

  const routerPlugins = reactRouter({
    routes: "./src/routes.js",
  })

  const createProxyConfig = (overrides = {}) => ({
    target: CMS_PROXY_TARGET,
    changeOrigin: true,
    secure: false,
    ...overrides,
  })

  const attachProxyLogging = (label) => {
    return (proxy) => {
      proxy.on("error", (err) => {
        console.log(`[${label}] proxy error`, err)
      })
      proxy.on("proxyReq", (_proxyReq, req) => {
        console.log(`Sending ${label} request:`, req.method, req.url)
      })
      proxy.on("proxyRes", (proxyRes, req) => {
        console.log(`Received ${label} response:`, proxyRes.statusCode, req.url)
      })
    }
  }

  return {
    base: process.env.VITE_BASE_PATH || "/",
    plugins: [...routerPlugins, eslintPlugin()],
    resolve: {
      alias: {
        "@": resolve(__dirname, "./src"),
        "@components": resolve(__dirname, "./src/components"),
        "@hooks": resolve(__dirname, "./src/hooks"),
        "@api": resolve(__dirname, "./src/api"),
        "@ui": resolve(__dirname, "./src/components/UI"),
        "@providers": resolve(__dirname, "./src/providers"),
      },
    },

    build: {
      sourcemap: false,
    },

    server: {
      proxy: {
        "/config.json": {
          target: "http://localhost:5173",
          bypass: (req, res) => {
            if (req.url === "/config.json") {
              res.setHeader("Content-Type", "application/json")
              res.end(fs.readFileSync("config.json"))
              return false
            }
          },
        },
        "/api": {
          ...createProxyConfig({ ws: true }),
          configure: attachProxyLogging("/api"),
        },
        "/media": createProxyConfig(),
        "/original_images": createProxyConfig(),
        "/static": createProxyConfig(),
      },
    },
  }
})
