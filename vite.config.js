import { resolve } from "path"
// eslint-disable-next-line import-x/default
import eslintPlugin from "@nabla/vite-plugin-eslint"
import { reactRouter } from "@react-router/dev/vite"
import { visualizer } from "rollup-plugin-visualizer"
import { defineConfig } from "vite"
import babel from "vite-plugin-babel"
import devtools from "vite-plugin-devtools-json"

export default defineConfig(() => {
  const enableBundleVisualizer =
    process.env.ANALYZE === "1" || process.env.ANALYZE === "true"
  const CMS_PROXY_TARGET = "http://localhost:8080"

  const routerPlugins = reactRouter({
    routes: "./src/routes.js",
  })

  const optionalPlugins = [
    enableBundleVisualizer
      ? visualizer({
          filename: "build/client/bundle-analysis.html",
          template: "treemap",
          gzipSize: true,
          brotliSize: true,
        })
      : null,
  ]

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
    plugins: [
      ...routerPlugins,
      eslintPlugin(),
      devtools(),
      babel({
        filter: /\.[jt]sx?$/,
        exclude: /node_modules/,
        babelConfig: {
          plugins: [
            ["babel-plugin-react-compiler"],
            ["babel-plugin-styled-components"],
          ],
        },
      }),
      ...optionalPlugins.filter(Boolean),
    ],
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
