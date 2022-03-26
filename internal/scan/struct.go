package scan

import (
	"io/fs"
)

// FileStat stores basic information and statistics about a file.
type FileStat struct {
	// Path is the path to the file (absolute for the root directory, relative for other).
	Path string `json:"p"`
	// Name is the name of the file.
	Name string `json:"n"`
	// Extension is the extension part of the file name, including the leading dot.
	Extension string `json:"e"`
	// Type is the type of the file (regular file or directory).
	Type string `json:"t"`
	// Size is the size of the file, in bytes.
	Size int64 `json:"s"`
	// LastWriteTime is the time the current file was last written (contents changed).
	LastWriteTime DateTime `json:"m"`
	// Direct is the statistics object about direct child files.
	Direct *DirectStats `json:"d,omitempty"`
	// Recursive is the statistics object about direct and indirect child files.
	Recursive *RecursiveStats `json:"r,omitempty"`
}

// CountSize indicates a number of files and a size, in bytes.
type CountSize struct {
	// Count is the number of files.
	Count int `json:"fc"`
	// Size the size of files, in bytes.
	Size int64 `json:"s"`
}

// add count and size to the current CountSize object.
func (cs *CountSize) add(count int, size int64) {
	cs.Count += count
	cs.Size += size
}

// CommonDirStats are common statistics between direct and recursive directory statistics.
type CommonDirStats struct {
	// Size is the total size of children, in bytes.
	Size int64 `json:"s"`
	// Files is the number of child regular files.
	Files int `json:"fc"`
	// Directories is the number of child directories.
	Directories int `json:"dc"`
	// Extensions is the size and number of children, grouped by file extension.
	Extensions map[string]*CountSize `json:"e"`
	// ModificationYears is the size and number of children, grouped by modification year.
	ModificationYears map[int]*CountSize `json:"y"`
}

// Range is a range of item indexes.
type Range struct {
	// Start is the start index (inclusive).
	Start int `json:"s"`
	// End is the end index (exclusive).
	End int `json:"e"`
}

// DirectStats are directory statistics about direct child files.
type DirectStats struct {
	CommonDirStats
	// Children is the list of direct child files indexes.
	Children []int `json:"c"`
}

// RecursiveStats are directory statistics about direct and indirect child files.
type RecursiveStats struct {
	CommonDirStats
	// Depth is the maximum level of nesting in the current directory.
	Depth int `json:"d"`
	// Children is the range of direct and indirect child files.
	Children Range `json:"c"`
}

// NewDirectoryStat creates a new file statistics object for a directory.
func NewDirectoryStat(path string, info fs.FileInfo) (stat *FileStat) {
	stat = NewFileStat(path, info)
	stat.Type = "dir"
	stat.Size = 0
	stat.Direct = &DirectStats{
		CommonDirStats: CommonDirStats{
			Extensions:        map[string]*CountSize{},
			ModificationYears: map[int]*CountSize{},
		},
		Children: []int{},
	}
	stat.Recursive = &RecursiveStats{
		CommonDirStats: CommonDirStats{
			Extensions:        map[string]*CountSize{},
			ModificationYears: map[int]*CountSize{},
		},
		Children: Range{},
	}
	return
}

// Ext returns the file extension (without the dot) if it is short (<= 15 chars).
func (stat *FileStat) Ext() string {
	if len(stat.Extension) == 0 || len(stat.Extension) > 15 {
		return ""
	}
	return stat.Extension[1:]
}

// combineStat adds child file statistics to the current directory statistics.
func (stat *FileStat) combineStat(child FileStat, i int) {
	stat.Direct.Children = append(stat.Direct.Children, i)
	if child.Type == "file" {
		stat.Direct.Files += 1
		stat.Recursive.Files += 1
		stat.Direct.Size += child.Size
		stat.Recursive.Size += child.Size
		if _, exists := stat.Direct.Extensions[child.Ext()]; !exists {
			stat.Direct.Extensions[child.Ext()] = &CountSize{}
		}
		stat.Direct.Extensions[child.Ext()].add(1, child.Size)
		if _, exists := stat.Recursive.Extensions[child.Ext()]; !exists {
			stat.Recursive.Extensions[child.Ext()] = &CountSize{}
		}
		stat.Recursive.Extensions[child.Ext()].add(1, child.Size)
		if _, exists := stat.Direct.ModificationYears[child.LastWriteTime.Year()]; !exists {
			stat.Direct.ModificationYears[child.LastWriteTime.Year()] = &CountSize{}
		}
		stat.Direct.ModificationYears[child.LastWriteTime.Year()].add(1, child.Size)
		if _, exists := stat.Recursive.ModificationYears[child.LastWriteTime.Year()]; !exists {
			stat.Recursive.ModificationYears[child.LastWriteTime.Year()] = &CountSize{}
		}
		stat.Recursive.ModificationYears[child.LastWriteTime.Year()].add(1, child.Size)
	} else if child.Type == "dir" {
		stat.Direct.Directories += 1
		stat.Recursive.Files += child.Recursive.Files
		stat.Recursive.Directories += child.Recursive.Directories + 1
		stat.Recursive.Size += child.Recursive.Size
		if stat.Recursive.Depth <= child.Recursive.Depth {
			stat.Recursive.Depth = child.Recursive.Depth + 1
		}
		for ext, cs := range child.Recursive.Extensions {
			if _, exists := stat.Recursive.Extensions[ext]; !exists {
				stat.Recursive.Extensions[ext] = &CountSize{}
			}
			stat.Recursive.Extensions[ext].add(cs.Count, cs.Size)
		}
		for year, cs := range child.Recursive.ModificationYears {
			if _, exists := stat.Recursive.ModificationYears[year]; !exists {
				stat.Recursive.ModificationYears[year] = &CountSize{}
			}
			stat.Recursive.ModificationYears[year].add(cs.Count, cs.Size)
		}
	}
}
