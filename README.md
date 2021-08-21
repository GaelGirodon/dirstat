# DirStat

[![release](https://img.shields.io/github/v/release/GaelGirodon/dirstat?style=flat-square)](https://github.com/GaelGirodon/dirstat/releases)
[![license](https://img.shields.io/github/license/GaelGirodon/dirstat?color=informational&style=flat-square)](https://github.com/GaelGirodon/dirstat/blob/master/LICENSE)
[![build](https://img.shields.io/gitlab/pipeline/GaelGirodon/dirstat/develop?style=flat-square)](https://gitlab.com/GaelGirodon/dirstat/-/pipelines/latest)

Simple directory statistics

## About

**DirStat** is a lightweight command-line tool (< 1 MB). It allows to scan a directory that needs to
be cleaned up, collect statistics about it and make them easily browsable by generating an
[interactive graphical HTML report](#report).

Statistics about biggest files and directories (both in size and files count, recursively or not),
most used extensions, most frequent modification years and maximum level of nesting help to know
where the disk space has gone and make it easier to clean the directory.

> :warning: Scanning directories with many files can take a long time and leads to a large report.

## Usage

Download and extract the [latest release](https://github.com/GaelGirodon/dirstat/releases), open a
terminal and scan a directory using the `dirstat` binary:

```shell
dirstat [flags] <path>
```

### Arguments

| Argument      | Description                                                                   |
| ------------- | ----------------------------------------------------------------------------- |
| `<path>`      | Path to the directory to scan                                                 |
| `-out <path>` | Path to the directory to write reports to (defaults to the current directory) |
| `-v`          | Print the version number and exit                                             |
| `-h`          | Print the help message and exit                                               |

### Example

```shell
$ dirstat ./my/dir/
Scanning ./my/dir/
42 files scanned
Reports written to dirstat-report.*
```

### Report

**DirStat** generates two report files:

- `dirstat-report.html`: the interactive graphical HTML report
- `dirstat-report.json`: raw directory statistics

![HTML report screenshot](https://user-images.githubusercontent.com/10748287/130336551-a8629e4d-c50a-4c41-a13d-7230d6400e4a.png)

## License

**DirStat** is licensed under the GNU General Public License.
