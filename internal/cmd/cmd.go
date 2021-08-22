package cmd

import (
	"github.com/gaelgirodon/dirstat/internal/log"
	"github.com/gaelgirodon/dirstat/internal/report"
	"github.com/gaelgirodon/dirstat/internal/scan"
	"os"
)

// Run handles the command-line, scans the directory and generates reports.
func Run() {
	// Enable interactive mode if DirStat was called without any argument
	interactive := len(os.Args) <= 1
	// Read input parameters
	dirToScan, outputDir := "", "."
	if !interactive {
		dirToScan, outputDir = handleCLI()
	} else {
		// Print startup banner
		log.Println("   ___  _     ______       __\n" +
			"  / _ \\(_)___/ __/ /____ _/ /_\n" +
			" / // / / __/\\ \\/ __/ _ `/ __/\n" +
			"/____/_/_/ /___/\\__/\\_,_/\\__/\n")
		dirToScan = readDirToScanPath()
	}
	// Scan the directory and write reports
	if files, err := scan.Scan(dirToScan); err != nil {
		log.Fatalf("Error: an error occurred scanning the directory (%v)\n", err)
	} else if reportPath, err := report.WriteReports(outputDir, files); err != nil {
		log.Fatalf("Error: unable to write reports (%v)\n", err)
	} else if interactive {
		// Open the report
		openReport(reportPath)
	}
}
