package shared

import "fmt"

func NewNotFoundError(err error) NotFoundError {
	return NotFoundError{err}
}

type NotFoundError struct {
	error error
}

func (n NotFoundError) Error() string {
	return fmt.Sprintf("not found: %s", n.error)
}

func (n NotFoundError) Unwrap() error {
	return n.error
}

func NewInvalidInputError(err error) InvalidInputError {
	return InvalidInputError{err}

}

type InvalidInputError struct {
	error error
}

func (i InvalidInputError) Error() string {
	return fmt.Sprintf("invalid input: %s", i.error)
}

func (i InvalidInputError) Unwrap() error {
	return i.error
}

func NewMissingRequiredInput(err error) MissingRequiredInput {
	return MissingRequiredInput{err}

}

type MissingRequiredInput struct {
	error error
}

func (m MissingRequiredInput) Error() string {
	return fmt.Sprintf("missing input: %s", m.error)
}

func (m MissingRequiredInput) Unwrap() error {
	return m.error
}
