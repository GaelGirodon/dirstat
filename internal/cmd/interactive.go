package cmd

import (
	"bufio"
	"fmt"
	"github.com/gaelgirodon/dirstat/internal/log"
	"os"
	"os/exec"
	"runtime"
	"strings"
)

// readDirToScanPath reads the path to the directory to scan from standard input
// and returns it or prompts the user to exit if the path is invalid.
func readDirToScanPath() string {
	log.Printf("Type or paste the path to the directory to scan and press the Enter key:\n> ")
	scanner := bufio.NewScanner(os.Stdin)
	ok := scanner.Scan()
	path := strings.TrimSpace(scanner.Text())
	if !ok || len(path) == 0 || validateDirPath(path) != nil {
		log.Println("Error: invalid path to the directory to scan")
		pause("exit")
		os.Exit(1)
		return ""
	}
	fmt.Println()
	return path
}

// openReport opens the specified report file in the default browser of the user.
func openReport(path string) {
	fmt.Println()
	pause("open the report and exit")
	var cmd string
	var args []string
	switch runtime.GOOS {
	case "windows":
		cmd = "cmd"
		args = []string{"/c", "start"}
	case "darwin":
		cmd = "open"
	default: // "linux", "freebsd", "openbsd", "netbsd"
		cmd = "xdg-open"
	}
	args = append(args, path)
	_ = exec.Command(cmd, args...).Start()
}

// pause prompts (and waits for) the user to press the Enter key to continue.
func pause(action string) {
	log.Printf("Press the Enter key to %s...\n", action)
	_, _ = fmt.Scanln()
}
