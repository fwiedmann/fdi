package members

import (
	"errors"

	"github.com/fwiedmann/fdi/backend/pkg/log"
	"github.com/google/uuid"
)

var (
	InvalidMemberNameError    = errors.New("invalid member name")
	InvalidMemberSurnameError = errors.New("invalid member surname")
	IdCreationError           = errors.New("could not create member id")
)

// Member represents an active member of a fire department which can be selected for invoices
type Member struct {
	Id      string
	Name    string
	Surname string
}

// NewMember enforces the business rules related to a Member
func NewMember(log log.Logger, name, surname string) (Member, error) {
	if len(name) == 0 {
		return Member{}, InvalidMemberNameError
	}

	if len(surname) == 0 {
		return Member{}, InvalidMemberSurnameError
	}

	id, err := uuid.NewUUID()
	if err != nil {
		log.Errorf("could not create member because uuid creation failed: %s", err)
		return Member{}, IdCreationError
	}

	return Member{
		Id:      id.String(),
		Name:    name,
		Surname: surname,
	}, nil
}
