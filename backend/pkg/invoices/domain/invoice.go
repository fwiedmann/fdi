package domain

import (
	"time"

	"github.com/fwiedmann/fdi/backend/pkg/shared"
)

// RequiredInvoiceParameters used for creating a new invoice. These parameters are the minimal required properties.
type RequiredInvoiceParameters struct {
	StartDate  time.Time
	EndDate    time.Time
	TimeRanges []TimeRange
}

// NewInvoice constructs an invoice. The DateService will be used for setting the correct date stamps for the entity
func NewInvoice(ds shared.DateService, invoice RequiredInvoiceParameters) (Invoice, error) {

	if len(invoice.TimeRanges) < 1 {
		return Invoice{}, MissingRequiredInput("given time ranges are empty, should be a minimum of one")
	}

	if invoice.StartDate.Unix() >= invoice.EndDate.Unix() {
		return Invoice{}, InvalidInputError("given start date is greater or equal then the given end date")
	}

	return Invoice{
		TimeRanges:     invoice.TimeRanges,
		CreatedAt:      ds.Now(),
		ModifiedAt:     ds.Now(),
		LastAccessedAt: ds.Now(),
		StartDate:      invoice.StartDate,
		EndDate:        invoice.EndDate,
	}, nil
}

type Invoice struct {
	TimeRanges     []TimeRange
	CreatedAt      time.Time
	ModifiedAt     time.Time
	LastAccessedAt time.Time
	StartDate      time.Time
	EndDate        time.Time
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
