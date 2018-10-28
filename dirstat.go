package main

import (
	"encoding/json"
	"errors"
	"flag"
	"fmt"
	"github.com/gobuffalo/packr"
	"io/ioutil"
	"log"
	"net/http"
	"os/exec"
	fp "path/filepath"
	"runtime"
	"time"
)

func main() {
	// CLI flags
	portFlag := flag.Int("port", 8080, "HTTP server port")
	flag.Parse()

	// HTTP server address
	port := *portFlag
	addr := fmt.Sprintf("127.0.0.1:%d", port)
	url := fmt.Sprintf("http://%s", addr)

	// Static file server
	box := packr.NewBox("./web")
	fs := http.FileServer(box)
	http.Handle("/", fs)

	// Backend
	http.HandleFunc("/stat", statHandler)

	// Open the browser when the server is ready
	go func() {
		for i := 0; i < 10; i++ {
			time.Sleep(time.Second)
			if resp, err := http.Get(url); err != nil {
				continue
			} else if resp.Body.Close(); resp.StatusCode != http.StatusOK {
				continue
			}
			// Server is up and running
			log.Printf("Available on %s", url)
			log.Println("Opening browser...")
			openBrowser(url)
			break
		}
	}()

	// Start the HTTP server
	log.Println("Starting up DirStat HTTP server...")
	log.Fatal(http.ListenAndServe(addr, nil))
}

//
// HTTP server
//

// Handle GET /stat
// Calculate directory statistics and return them as JSON
func statHandler(res http.ResponseWriter, req *http.Request) {
	// Get path query param
	path := req.URL.Query().Get("path")
	if path == "" {
		sendError(res, http.StatusBadRequest, "The path can't be empty")
		return
	} // else
	// Calculate statistics for the given directory path
	log.Printf("Scanning directory '%s'...", path)
	if stat, err := scanDir(path); err != nil { // Scan failed
		sendError(res, http.StatusBadRequest, "Failed scanning directory ("+err.Error()+")")
	} else if output, err := json.Marshal(stat); err != nil { // Marshalling failed
		sendError(res, http.StatusInternalServerError, "Failed encoding statistics to JSON ("+err.Error()+")")
	} else { // Success: sending results
		sendSuccess(res, output)
	}
}

// Send a success response with a body content
func sendSuccess(res http.ResponseWriter, body []byte) {
	log.Println("OK")
	res.Header().Set("Content-Type", "application/json")
	res.WriteHeader(http.StatusOK)
	res.Write(body)
}

// Send an error response with a custom status code and an error message
func sendError(res http.ResponseWriter, statusCode int, error string) {
	log.Println(error)
	res.Header().Set("Content-Type", "application/json")
	res.WriteHeader(statusCode)
	if body, err := json.Marshal(ErrorMessage{Message: error}); err == nil {
		res.Write(body)
	}
}

// Error message structure.
type ErrorMessage struct {
	Message string `json:"message"`
}

//
// Directory statistics
//

// Directory statistics structure.
type DirStat struct {
	Path     string    `json:"path"`
	Name     string    `json:"name"`
	Count    int       `json:"count"`
	Size     int64     `json:"size"`
	Depth    int       `json:"depth"`
	Children []DirStat `json:"children"`
}

// Create a new directory statistics object
// from a directory path and set default values.
func NewDirStat(path string) *DirStat {
	return &DirStat{Path: path, Name: fp.Base(path), Count: 0, Size: 0,
		Depth: 0, Children: []DirStat{}}
}

// Append a child directory statistics object
// to the current directory statistics.
func (stat *DirStat) append(childStat DirStat) {
	stat.Children = append(stat.Children, childStat)
	stat.Size += childStat.Size
	stat.Count += childStat.Count
}

// Calculate directory statistics recursively.
func scanDir(path string) (stat *DirStat, err error) {
	stat = NewDirStat(path)
	files, err := ioutil.ReadDir(path)
	if err != nil {
		msg := fmt.Sprintf("Failed reading directory '%s'", path)
		log.Println(msg)
		return nil, errors.New(msg)
	} // else: compute stats
	for _, file := range files {
		// Count entries in directory
		stat.Count += 1
		childPath := fp.Join(path, file.Name())
		if file.IsDir() {
			// Recursive call for directories
			if childStat, err := scanDir(childPath); err == nil {
				// Error is ignored
				stat.append(*childStat)
			}
		} else if file.Mode().IsRegular() {
			// Append file size
			stat.Size += file.Size()
		}
	}
	// Compute directory depth
	if len(stat.Children) > 0 {
		maxDepth := 0
		for _, s := range stat.Children {
			if s.Depth > maxDepth {
				maxDepth = s.Depth
			}
		}
		stat.Depth = 1 + maxDepth
	}
	return
}

//
// Util
//

// Open the specified URL in the default browser of the user.
func openBrowser(url string) error {
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
	args = append(args, url)
	return exec.Command(cmd, args...).Start()
}
