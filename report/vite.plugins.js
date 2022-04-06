import { writeFileSync } from "fs";
import packageJson from "./package.json";

/**
 * Inject stub data for development.
 * @returns Vite plugin
 */
export function stubPlugin() {
  return {
    name: "stub",
    apply(config) {
      return config.mode === "development";
    },
    transformIndexHtml(html) {
      return html.replace(/<!-- {version} -->/, packageJson.version + "-dev")
        .replace(/<!-- {path} -->/, "/data")
        .replace(/<!-- {data} -->/, '<script src="data.js"></script>'); // public/data.js
    }
  };
}

/**
 * Inline assets (JS and CSS) and write the report template
 * to Go sources to embed it in the output executable.
 * @returns Vite plugin
 */
export function publishPlugin() {
  return {
    name: "publish",
    writeBundle(_options, bundle) {
      const html = bundle["index.html"].source
        .replace(/<script[^>]+ src="\/([^"]+\.js)"><\/script>/g,
          (_, src) => `<script type="module">${bundle[src].code}</script>`)
        .replace(/<link rel="stylesheet" href="\/([^"]+\.css)">/g,
          (_, href) => `<style>${bundle[href].source}</style>`)
        .replace(/\n.*(<\/script)/g, "$1")
        .replace(/\n{2,}/g, "\n");
      writeFileSync("../internal/report/template.html", html);
    }
  };
}
