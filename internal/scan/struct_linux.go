package scan

import (
	"io/fs"
	"path/filepath"
)

// NewFileStat creates a new file statistics object for a regular file.
func NewFileStat(path string, info fs.FileInfo) *FileStat {
	name := info.Name()
	return &FileStat{
		Path: path, Name: name, Extension: filepath.Ext(name), Type: "file", Size: info.Size(),
		LastWriteTime: DateTime(info.ModTime()),
	}
}
