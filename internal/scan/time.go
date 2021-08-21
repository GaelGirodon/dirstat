package scan

import (
	"fmt"
	"time"
)

// DateTime is the time structure with a custom marshal format.
type DateTime time.Time

// Year returns the year in which t occurs.
func (t DateTime) Year() int {
	return time.Time(t).Year()
}

// MarshalJSON marshals the time with the RFC3339 format.
func (t DateTime) MarshalJSON() ([]byte, error) {
	return []byte(fmt.Sprintf("\"%s\"", time.Time(t).UTC().Format(time.RFC3339))), nil
}
