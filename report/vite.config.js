import { defineConfig } from "vite";
import preact from "@preact/preset-vite";
import autoprefixer from "autoprefixer";
import nested from "postcss-nested";
import purgeCSSPlugin from "@fullhuman/postcss-purgecss";

import { publishPlugin, stubPlugin } from "./vite.plugins";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [preact(), stubPlugin(), publishPlugin()],
  css: {
    postcss: {
      plugins: [
        autoprefixer,
        nested,
        purgeCSSPlugin({
          content: ["./**/*.html", "./**/*.jsx"]
        })
      ]
    }
  }
});
