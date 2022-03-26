package scan

import (
	"fmt"
	"github.com/gaelgirodon/dirstat/internal/log"
	"io/fs"
	"os"
	"path/filepath"
	"strings"
)

// Scan lists all files and directories in the given directory and collect statistics.
func Scan(dir string) (files []*FileStat, err error) {
	var stack []int
	dirPath, err := filepath.Abs(dir)
	if err != nil {
		return nil, fmt.Errorf("invalid root directory: %v", dir)
	}
	log.Printf("Scanning %s\n", dir)
	err = filepath.Walk(dirPath, func(path string, info fs.FileInfo, err error) error {
		// Skip unreadable file or directory
		if err != nil {
			log.Printf("Skipping %q due to error: %v\n", path, err)
			return filepath.SkipDir
		}
		// Update the stack
		i := len(files)
		for len(stack) > 1 && !strings.Contains(path, files[stack[len(stack)-1]].Path+string(os.PathSeparator)) {
			// Navigate up to the parent directory and combine stats
			dirIndex := stack[len(stack)-1]
			files[dirIndex].Recursive.Children.End = i
			stack = stack[:len(stack)-1]
			files[stack[len(stack)-1]].combineStat(*(files[dirIndex]), dirIndex)
		}
		// Get directory/file statistics
		p := path
		if i > 0 {
			// Relative path for non-root files and directories (to avoid too much duplication)
			p, _ = filepath.Rel(files[0].Path, path)
		}
		if info.IsDir() {
			stat := NewDirectoryStat(p, info)
			stat.Recursive.Children.Start = i + 1
			files = append(files, stat) // Append the directory to the files list
			stack = append(stack, i)    // Navigate down to the child directory
		} else if info.Mode().IsRegular() {
			stat := NewFileStat(p, info)
			files = append(files, stat)                      // Append the file to the files list
			files[stack[len(stack)-1]].combineStat(*stat, i) // Update current directory statistics
		} else {
			log.Printf("Skipping %q (not a directory nor a regular file)\n", path)
			return filepath.SkipDir
		}
		log.Printf("%d files scanned\r", len(files))
		return nil
	})
	if err != nil {
		log.Printf("error scanning the path %q: %v\n", dir, err)
		return
	}
	// Navigate back up to the root directory
	for len(stack) > 1 {
		dirIndex := stack[len(stack)-1]
		files[dirIndex].Recursive.Children.End = len(files)
		stack = stack[:len(stack)-1]
		files[stack[len(stack)-1]].combineStat(*(files[dirIndex]), dirIndex)
	}
	files[stack[len(stack)-1]].Recursive.Children.End = len(files)
	log.Printf("%d files scanned\n", len(files))
	return
}
