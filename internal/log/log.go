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

// Fatalf formats according to a format specifier, writes to stderr and exits.
func Fatalf(format string, a ...interface{}) {
	Printf(format, a...)
	os.Exit(1)
}

// Fatalln formats using the default formats for its operands, writes to stderr and exits.
func Fatalln(a ...interface{}) {
	Println(a...)
	os.Exit(1)
}
