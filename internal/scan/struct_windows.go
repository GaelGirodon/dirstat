package scan

import (
	"io/fs"
	"path/filepath"
	"syscall"
	"time"
)

// NewFileStat creates a new file statistics object for a regular file.
func NewFileStat(path string, info fs.FileInfo) *FileStat {
	stat := info.Sys().(*syscall.Win32FileAttributeData)
	name := info.Name()
	lastWriteTime := time.Unix(0, stat.CreationTime.Nanoseconds())
	if info.ModTime().After(lastWriteTime) {
		lastWriteTime = info.ModTime()
	}
	return &FileStat{
		Path: path, Name: name, Extension: filepath.Ext(name), Type: "file", Size: info.Size(),
		LastWriteTime: DateTime(lastWriteTime),
	}
}
