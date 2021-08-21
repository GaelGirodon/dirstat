package log

import (
	"fmt"
	"os"
)

// Printf formats according to a format specifier and writes to stderr.
func Printf(format string, a ...interface{}) {
	_, _ = fmt.Fprintf(os.Stderr, format, a...)
}

// Println formats using the default formats for its operands and writes to stderr.
func Println(a ...interface{}) {
	_, _ = fmt.Fprintln(os.Stderr, a...)
}

// Fatalf formats according to a format specifier, writes to stderr and exits with code.
func Fatalf(code int, format string, a ...interface{}) {
	Printf(format, a...)
	os.Exit(code)
}

// Fatalln formats using the default formats for its operands, writes to stderr and exits with code.
func Fatalln(code int, a ...interface{}) {
	Println(a...)
	os.Exit(code)
}
