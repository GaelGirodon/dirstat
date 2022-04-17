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
      return html
        .replace(/<!-- {version} -->/, packageJson.version + "-dev")
        .replace(/<!-- {path} -->/, "/data")
        .replace(/<!-- {data} -->/, '<script src="data.js"></script>'); // public/data.js
    }
  };
}

/**
 * Inline assets (JS, CSS and SVG) and write the report template
 * to Go sources to embed it in the output executable.
 * @returns Vite plugin
 */
export function publishPlugin() {
  return {
    name: "publish",
    writeBundle(_options, bundle) {
      const html = bundle["index.html"].source
        .replace(/<script[^>]+ src="\/([^"]+\.js)"><\/script>/g,
          (_, src) => `<script type="module">${bundle[src].code.trim()}</script>`)
        .replace(/<link rel="stylesheet" href="\/([^"]+\.css)">/g,
          (_, href) => `<style>${bundle[href].source.trim()}</style>`)
        .replace(/<img ([^>]+) src="\/([^"]+\.svg)" \/>/g, (_, attr, src) => {
          const value = bundle[src].source.toString("base64");
          return `<img ${attr} src="data:image/svg+xml;base64,${value}" />`;
        })
        .replace(/^ +$/gm, "").replace(/\n{2,}/g, "\n");
      writeFileSync("../internal/report/template.html", html);
    }
  };
}
