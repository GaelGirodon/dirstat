module.exports = {
  plugins: [
    require("autoprefixer"),
    require("postcss-nested"),
    require("@fullhuman/postcss-purgecss")({
      content: ["./**/*.html", "./**/*.jsx"]
    })
  ]
};
