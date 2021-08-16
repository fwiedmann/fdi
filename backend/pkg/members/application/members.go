package application

import (
	"context"
	"errors"

	"github.com/fwiedmann/fdi/backend/pkg/members/domain/members"
)

var (
	NotExistsError = errors.New("member does not exists")
)

// CreateMemberInput is the required input in order to create a new Member
type CreateMemberInput struct {
	Name    string
	Surname string
}

// DeleteMemberInput is the required input in order to delete a existing member
type DeleteMemberInput struct {
	Id string
}

// Service defines all available actions on the members domain
type Service interface {
	CreateMember(ctx context.Context, input CreateMemberInput) (string, error)
	ListMembers(ctx context.Context) ([]members.Member, error)
	DeleteMember(ctx context.Context, input DeleteMemberInput) error
}

func NewService(repo members.Repository) Service {
	return MembersService{repo: repo}
}

// MembersService implements Service
type MembersService struct {
	repo members.Repository
}

// DeleteMember only if the member with the given id exists
func (m MembersService) DeleteMember(ctx context.Context, input DeleteMemberInput) error {
	found, err := m.repo.FindById(input.Id)
	if err != nil {
		return err
	}

	if found == nil {
		return NotExistsError
	}

	return m.repo.DeleteById(input.Id)
}

// CreateMember if the member with the given input does not exist in the repository
func (m MembersService) CreateMember(ctx context.Context, input CreateMemberInput) (string, error) {
	member, err := members.NewMember(input.Name, input.Surname)
	if err != nil {
		return "", err
	}

	found, err := m.repo.FindById(member.Id)
	if err != nil {
		return "", err
	}

	if found == nil {
		return "", NotExistsError
	}

	err = m.repo.Save(member)
	if err != nil {
		return "", err
	}
	return member.Id, nil
}

// ListMembers which are stored in the repository
func (m MembersService) ListMembers(ctx context.Context) ([]members.Member, error) {
	return m.repo.List()
}
