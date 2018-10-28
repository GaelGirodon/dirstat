# DirStat

Simple directory statistics.

## Overview

**DirStat** is a simple graphical web application to show
where your disk space has gone to help you to clean it up.

## Guide

### Quick start

1. Download the [latest release](https://github.com/GaelGirodon/dir-stat/releases)
2. Start **DirStat**
3. Set the path of the directory to scan
4. Click on the 🔍 **Scan** button
5. Navigate in the treemap to show where your disk space has gone

### CLI usage

```shell
dirstat --port 8000
```

## Development

### Setup

Install global dependencies:

- Node.js >= 8
- Go >= 1.11
- [Packr](https://github.com/gobuffalo/packr) >= 1.15

Then, install project dependencies:

```shell
npm run ensure
```

### Build

```shell
npm run build
```

### Package

```shell
npm run package
```

### Release

1. Start the release: `git flow release start X.Y.Z`
2. Update the version number in [`package.json`](package.json)
3. Commit changes: `git commit -m "Bump the version number"`
4. Finish the release: `git flow release finish X.Y.Z`
5. Push to the repository: `git push --all origin && git push --tags`

## License

DirStat is licensed under the GNU General Public License.
