package members

import (
	"errors"
	"fmt"
)

var (
	InvalidMemberNameError    = errors.New("invalid member name")
	InvalidMemberSurnameError = errors.New("invalid member surname")
)

// Member represents a active member of a fire department which can be selected for invoices
type Member struct {
	id      string
	name    string
	surname string
}

// NewMember enforces the business rules related to a Member
func NewMember(name, surname string) (Member, error) {
	if len(name) == 0 {
		return Member{}, InvalidMemberNameError
	}

	if len(surname) == 0 {
		return Member{}, InvalidMemberSurnameError
	}

	return Member{
		id:      fmt.Sprintf("%s_%S", name, surname),
		name:    name,
		surname: surname,
	}, nil
}

// Id returns the Member Id
func (m Member) Id() string {
	return m.id
}

// Name returns the Member Name
func (m Member) Name() string {
	return m.name
}

// Surname returns the Member Surname
func (m Member) Surname() string {
	return m.surname
}
