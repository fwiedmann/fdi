package shared

import "time"

type DateService interface {
	Now() time.Time
}

type Date struct {
}

func (d Date) Now() time.Time {
	return time.Now()
}
