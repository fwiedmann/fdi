package domain

import (
	"github.com/fwiedmann/fdi/backend/pkg/shared"
	"time"
)

type RequiredInvoiceParameters struct {
	StartDate  time.Time
	EndDate    time.Time
	TimeRanges []TimeRange
}

func NewInvoice(ds shared.DateService, invoice RequiredInvoiceParameters) (Invoice, error) {
	return Invoice{
		StartDate:  invoice.StartDate,
		EndDate:    invoice.EndDate,
		TimeRanges: invoice.TimeRanges,
	}, nil
}

type Invoice struct {
	StartDate  time.Time
	EndDate    time.Time
	TimeRanges []TimeRange
}

type TimeRange struct {
	StartDate time.Time
	EndDate   time.Time
	Members   []Member
}

type Member struct {
	Id            string
	dirtAllowance bool
}
