package report

import (
	_ "embed"
	"encoding/json"
	"errors"
	"fmt"
	"github.com/gaelgirodon/dirstat/internal/log"
	"github.com/gaelgirodon/dirstat/internal/meta"
	"github.com/gaelgirodon/dirstat/internal/scan"
	"os"
	"path/filepath"
	"strings"
)

// reportName is the report name (without extension).
const reportName = "dirstat-report"

// reportTemplate is the HTML report template.
//go:embed template.html
var reportTemplate string

// WriteReports generates reports to the given dest directory.
func WriteReports(dest string, files []*scan.FileStat) error {
	// Marshal statistics to JSON
	filesJson, err := json.Marshal(files)
	if err != nil {
		return errors.New("unable to marshal files list")
	}
	// Generate the JSON report
	jsonReportPath := filepath.Join(dest, reportName+".json")
	if err := os.WriteFile(jsonReportPath, filesJson, 0666); err != nil {
		return errors.New("unable to write the JSON report file")
	}
	// Generate the HTML report
	htmlReportPath := filepath.Join(dest, reportName+".html")
	dataScript := fmt.Sprintf("<script>var files = %s, pathSeparator = \"%s\"</script>",
		filesJson, strings.Replace(string(os.PathSeparator), "\\", "\\\\", 1))
	htmlReport := reportTemplate
	htmlReport = strings.Replace(htmlReport, "<!-- {version} -->", meta.Version, 1)
	htmlReport = strings.Replace(htmlReport, "<!-- {path} -->", files[0].Path, 1)
	htmlReport = strings.Replace(htmlReport, "<!-- {data} -->", dataScript, 1)
	if err := os.WriteFile(htmlReportPath, []byte(htmlReport), 0666); err != nil {
		return errors.New("unable to write the HTML report file")
	}
	log.Printf("Reports written to %s", filepath.Join(dest, reportName+".*"))
	return nil
}
