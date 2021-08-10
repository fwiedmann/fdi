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
	Id      string
	Name    string
	Surname string
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
		Id:      fmt.Sprintf("%s_%s", name, surname),
		Name:    name,
		Surname: surname,
	}, nil
}
