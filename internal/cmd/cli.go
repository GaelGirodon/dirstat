package cmd

import (
	"flag"
	"github.com/gaelgirodon/dirstat/internal/log"
	"github.com/gaelgirodon/dirstat/internal/meta"
	"os"
)

// handleCLI configures the CLI then parses, validates and returns flags and arguments.
func handleCLI() (string, string) {
	// Print version number
	if len(os.Args) == 2 && os.Args[1] == "-v" {
		println(meta.AppName + " version " + meta.Version)
		os.Exit(0)
	}
	// Configure the CLI
	outputDir := flag.String("o", ".", "the `path` to the directory to write reports to")
	flag.Usage = func() {
		println("Scan the given directory and write reports\n")
		println("Usage:\n  " + meta.AppName + " [flags] <path>\n\nFlags:")
		flag.PrintDefaults()
	}
	// Parse flags and arguments
	flag.Parse()
	// Validate output directory path
	if err := validateDirPath(*outputDir); err != nil {
		log.Fatalf("Error: invalid output directory path (%s)\n", err)
	}
	// Validate path to the directory to scan
	if flag.NArg() != 1 {
		log.Fatalln("Error: invalid number of arguments")
	}
	if err := validateDirPath(flag.Arg(0)); err != nil {
		log.Fatalf("Error: invalid path to the directory to scan (%s)\n", err)
	}
	return flag.Arg(0), *outputDir
}
