# DirStat

[![release](https://img.shields.io/github/v/release/GaelGirodon/dirstat?style=flat-square)](https://github.com/GaelGirodon/dirstat/releases)
[![license](https://img.shields.io/github/license/GaelGirodon/dirstat?color=informational&style=flat-square)](https://github.com/GaelGirodon/dirstat/blob/master/LICENSE)
[![build](https://img.shields.io/gitlab/pipeline/GaelGirodon/dirstat/develop?style=flat-square)](https://gitlab.com/GaelGirodon/dirstat/-/pipelines/latest)

A simple tool that helps to clean up directories by scanning them and generating interactive
statistics reports.

## About

**DirStat** is a lightweight command-line tool (< 1 MB). It allows to scan a directory that needs to
be cleaned up, collect statistics about it and make them easily browsable by generating an
[interactive graphical HTML report](#report).

Statistics about biggest files and directories (both in size and files count, recursively or not),
most used extensions, most frequent modification years and maximum level of nesting help to know
where the disk space has gone and make it easier to clean the directory.

## Install

Download and extract the [latest release](https://github.com/GaelGirodon/dirstat/releases):

```powershell
# Windows (PowerShell)
$DOWNLOAD_URL = "https://github.com/GaelGirodon/dirstat/releases/latest/download"
Invoke-WebRequest -OutFile "dirstat.zip" "$DOWNLOAD_URL/dirstat_windows_amd64.zip"
Expand-Archive "dirstat.zip" -DestinationPath ./
```

```shell
# Linux (Bash)
DOWNLOAD_URL="https://github.com/GaelGirodon/dirstat/releases/latest/download"
curl -sL "$DOWNLOAD_URL/dirstat_linux_amd64.tar.gz" | tar xvz
```

## Usage

Open a terminal and scan a directory using the `dirstat` binary:

```shell
dirstat [flags] <path>
```

Invoke `dirstat` without any argument to run the interactive mode.

> :warning: Scanning directories with many files can take a long time and leads to a large report.

### Arguments

| Argument    | Description                               | Default |
| ----------- | ----------------------------------------- | ------- |
| `<path>`    | Path to the directory to scan             |         |
| `-o <path>` | Path to the directory to write reports to | `.`     |
| `-v`        | Print the version number and exit         |         |
| `-h`        | Print the help message and exit           |         |

### Example

#### CLI

```shell
$ dirstat ./my/dir/ -o ./report/
Scanning ./my/dir/
42 files scanned
Reports written to report/dirstat-report.*
```

#### Interactive mode

```shell
$ dirstat
   ___  _     ______       __
  / _ \(_)___/ __/ /____ _/ /_
 / // / / __/\ \/ __/ _ `/ __/
/____/_/_/ /___/\__/\_,_/\__/

Type or paste the path to the directory to scan and press the Enter key:
> ./my/dir/

Scanning ./my/dir/
42 files scanned
Reports written to dirstat-report.*

Press the Enter key to open the report and exit...
```

### Report

**DirStat** generates two report files:

- `dirstat-report.html`: the interactive graphical HTML report
- `dirstat-report.json`: raw directory statistics

![HTML report screenshot](https://user-images.githubusercontent.com/10748287/131232594-9bba83fe-45d5-44fe-993a-d162ffd25fde.png)

## License

**DirStat** is licensed under the GNU General Public License.
