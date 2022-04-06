import { defineConfig } from "vite";
import preact from "@preact/preset-vite";
import { publishPlugin, stubPlugin } from "./vite.plugins";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [preact(), stubPlugin(), publishPlugin()]
})
