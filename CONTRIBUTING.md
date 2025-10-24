# Contributing

## Development

Install global dependencies:

- Node.js LTS
- Go >= 1.25

Install project dependencies:

```shell
pushd report && npm install && popd
```

Build and run:

- Build the report template ([`report/`](./report)): `npm run build`
  <br>_or_ for report template development:
  - Create a [`data.js`](./report/public/data.js) file with some stub data
    (e.g. from a real report):
    ```js
    var files = [/* stub data */];
    var pathSeparator = "/";
    ```
  - Run: `npm run dev`
- Build and run DirStat: `go run "cmd/dirstat.go" [...]`

## Release

- Update the version number in:
  - [`meta.go`](./internal/meta/meta.go)
  - [`package.json`](./report/package.json) (+ `npm install`)
- Update the [changelog](./CHANGELOG.md)
- Commit changes: `git commit -a -m "Release X.Y.Z"`
- Merge `develop` in `main`: `git switch main && git merge develop --ff-only`
- Create the tag: `git tag "X.Y.Z" -a -m "X.Y.Z"`
- Push to the repository: `git push --all origin && git push --tags`
