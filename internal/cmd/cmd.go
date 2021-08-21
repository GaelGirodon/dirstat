package cmd

import (
	"flag"
	"github.com/gaelgirodon/dirstat/internal/log"
	"github.com/gaelgirodon/dirstat/internal/meta"
	"github.com/gaelgirodon/dirstat/internal/report"
	"github.com/gaelgirodon/dirstat/internal/scan"
	"github.com/gaelgirodon/dirstat/internal/util"
	"os"
)

// Run handles the command-line, scans the directory and generates reports.
func Run() {
	// Print version number
	if len(os.Args) == 2 && os.Args[1] == "-v" {
		println(meta.AppName + " version " + meta.Version)
		os.Exit(0)
	}
	// Configure the CLI
	outDir := flag.String("out", ".", "the `path` to the directory to write reports to")
	flag.Usage = func() {
		println("Scan the given directory and write reports\n")
		println("Usage:\n  " + meta.AppName + " [flags] <path>\n\nFlags:")
		flag.PrintDefaults()
	}
	// Parse flags & args
	flag.Parse()
	// Validate output directory path
	if err := util.ValidateDirPath(*outDir); err != nil {
		log.Fatalf(1, "Error: invalid output directory path (%s)\n", err)
	}
	// Validate path to the directory to scan
	if flag.NArg() != 1 {
		log.Fatalln(2, "Error: missing path to the directory to scan")
	}
	if err := util.ValidateDirPath(flag.Arg(0)); err != nil {
		log.Fatalf(3, "Error: invalid path to the directory to scan (%s)\n", err)
	}
	// Scan the directory and write reports
	if files, err := scan.Scan(flag.Arg(0)); err != nil {
		log.Fatalf(4, "Error: an error occurred scanning the directory (%v)\n", err)
	} else if err := report.WriteReports(*outDir, files); err != nil {
		log.Fatalf(5, "Error: unable to write reports (%v)\n", err)
	}
}
