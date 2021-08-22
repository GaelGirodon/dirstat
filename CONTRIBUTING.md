# Contributing

## Development

Install global dependencies:

- Node.js LTS
- Go >= 1.17

Install project dependencies:

```shell
pushd report && npm install && popd
```

Build and run:

- Build report template ([`./report`](./report)):
  - For development: `npm run build:dev`
  - For production: `npm run build`
- Run DirStat: `go run "cmd/dirstat.go" [...]`

## Release

- Start the release: `git flow release start X.Y.Z`
- Update the version number in:
  - [`meta.go`](./internal/meta/meta.go)
  - [`package.json`](./report/package.json) (+ `npm install`)
- Update the [changelog](./CHANGELOG.md)
- Commit changes: `git commit -m "Bump the version number"`
- Finish the release: `git flow release finish X.Y.Z`
- Push to the repository: `git push --all origin && git push --tags`
