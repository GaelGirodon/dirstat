# DirStat

Simple directory statistics.

## Overview

**DirStat** is a simple graphical web application to show
where your disk space has gone to help you to clean it up.

## Guide

### Quick start

1. Download the [latest release](https://github.com/GaelGirodon/dirstat/releases)
2. Start **DirStat**
3. Set the path of the directory to scan
4. Click on the <kbd>**Scan**</kbd> button (or press <kbd>Enter</kbd>)
5. Navigate in the treemap to show where your disk space has gone

### CLI usage

```shell
dirstat [--port 8000]
```

## Development

### Setup

Install global dependencies:

- Node.js >= 14
- NPM >= 6
- Go >= 1.16
- Packr >= 2
- PowerShell

Install NPM packages:

```shell
npm install
```

Install D3plus:

- Download and extract the latest 1.x release of `d3plus-hierarchy`
- Move `d3plus-hierarchy.full.min.js` to [`assets/js/lib/`](./assets/js/lib/)

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
2. Update the version number in:
   - [`package.json`](package.json) (+ `npm install`)
   - [`index.html`](web/index.html)
3. Commit changes: `git commit -m "Bump the version number"`
4. Finish the release: `git flow release finish X.Y.Z`
5. Push to the repository: `git push --all origin && git push --tags`

## Tasks

- [ ] Auto-complete the directory path
- [ ] Improve the treemap display
- [ ] Harmonize folder naming (directory, folder...)

## License

**DirStat** is licensed under the GNU General Public License.
