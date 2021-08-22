package members

import (
	"errors"
	"fmt"

	"github.com/google/uuid"
)

var (
	InvalidMemberNameError    = errors.New("invalid member name")
	InvalidMemberSurnameError = errors.New("invalid member surname")
	IdCreationError           = errors.New("could not create member id")
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

	id, err := uuid.NewUUID()
	if err != nil {
		fmt.Println(err)
		return Member{}, IdCreationError
	}

	return Member{
		Id:      id.String(),
		Name:    name,
		Surname: surname,
	}, nil
}
