/*
 * build.js
 * Report template compilation
 */

const fs = require("fs");
const path = require("path");
const chokidar = require("chokidar");
const {minify} = require("uglify-js");
const sass = require("sass");

/**
 * Source files
 */
const src = {
  styles: "src/styles/main.scss",
  scripts: [
    "node_modules/htm/preact/standalone.umd.js",
    "src/scripts/store.js",
    "src/scripts/globals.js",
    "src/scripts/mode-selector.js",
    "src/scripts/file-explorer.js",
    "src/scripts/indicator.js",
    "src/scripts/chart.js",
    "src/scripts/main.js"
  ],
  html: "src/template.html"
};

/**
 * Output template file
 */
let output = "../internal/report/template.html";

if (process.argv.some(arg => arg.match(/^(-d|--dev)$/))) {
  src.scripts.splice(2, 0, "src/scripts/data.js");
  output = output.replace(/.html$/, "-dev.html");
}

/**
 * JS minification options
 */
const minifyOpts = {compress: {varify: false}, mangle: false};

/**
 * Build scripts, styles and HTML template.
 */
function build() {
  console.log("Building...");
  const style = sass.renderSync({
    file: path.join(__dirname, src.styles),
    outputStyle: "compressed"
  }).css.toString("utf8").trim();
  const script = src.scripts
    .map(s => fs.readFileSync(path.join(__dirname, s), "utf8"))
    .map((s, i) => i >= 1 ? minify(s, minifyOpts).code
      .replace(/(>)\n +|\n +(<)/g, "$1$2")
      .replace(/(["}])\n +([\w$(])/g, "$1 $2") : s)
    .reduce((acc, val) => acc + val);
  const html = fs.readFileSync(path.join(__dirname, src.html), "utf8")
    .replace("<!-- {styles} -->", `<style>${style}</style>`)
    .replace("<!-- {scripts} -->", `<script>${script}</script>`);
  fs.writeFileSync(path.join(__dirname, output), html);
  console.log(`Done -> ${path.join(__dirname, output)}`);
}

// Initial build
build();

// Watch for changes
if (process.argv.some(arg => arg.match(/^(-w|--watch)$/))) {
  console.log("Watching for changes...");
  chokidar
    .watch(path.join(__dirname, "src/**/*.{js,scss,html}"), {ignoreInitial: true})
    .on("change", (path) => {
      console.log(`Changed ${path}`);
      build();
    });
}
