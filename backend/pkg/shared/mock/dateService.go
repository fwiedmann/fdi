package mock

import "time"

type DateServiceMock struct {
	Time time.Time
}

func (d DateServiceMock) Now() time.Time {
	return d.Time
}
