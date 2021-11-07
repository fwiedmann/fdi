package domain

import (
	"fmt"

	"github.com/fwiedmann/fdi/backend/pkg/shared"
)

type InvoiceError struct {
	error error
}

func (i InvoiceError) Error() string {
	return fmt.Sprintf("Invoice error: %s", i.error)
}

func (i InvoiceError) Unwrap() error {
	return i.error
}

func InvalidInputError(message string) error {
	return InvoiceError{shared.NewInvalidInputError(fmt.Errorf("%s", message))}
}

func MissingRequiredInput(message string) error {
	return InvoiceError{shared.NewMissingRequiredInput(fmt.Errorf("%s", message))}
}
