package cmd

import (
	"errors"
	"fmt"
	"os"
)

// validateDirPath checks that path is a valid path to a directory.
func validateDirPath(path string) error {
	if len(path) == 0 {
		return errors.New("directory path is required")
	} else if stat, err := os.Stat(path); err != nil {
		return errors.New(fmt.Sprintf("directory %q doesn't exist", path))
	} else if !stat.IsDir() {
		return errors.New(fmt.Sprintf("%q is not a directory", path))
	}
	return nil
}