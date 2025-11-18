import { resolve } from "path"
import eslintPlugin from "@nabla/vite-plugin-eslint"
import { reactRouter } from "@react-router/dev/vite"
import { visualizer } from "rollup-plugin-visualizer"
import { defineConfig } from "vite"
import babel from "vite-plugin-babel"
import devtools from "vite-plugin-devtools-json"

export default defineConfig(() => {
  const enableBundleVisualizer =
    process.env.ANALYZE === "1" || process.env.ANALYZE === "true"

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
        "@theme": resolve(__dirname, "./src/theme"),
      },
    },

    build: {
      sourcemap: enableBundleVisualizer,
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
  }
})
