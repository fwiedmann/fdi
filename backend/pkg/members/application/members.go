package application

import (
	"context"
	"errors"

	"github.com/fwiedmann/fdi/backend/pkg/log"

	"github.com/fwiedmann/fdi/backend/pkg/members/domain/members"
)

var (
	AllReadyExistsError = errors.New("member already exists")
	NotExistsError      = errors.New("member does not exists")
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
	ListMembers(ctx context.Context, options members.ListOptions) ([]members.Member, error)
	DeleteMember(ctx context.Context, input DeleteMemberInput) error
}

func NewService(log log.Logger, repo members.Repository) Service {
	return MembersService{
		log:  log,
		repo: repo,
	}
}

// MembersService implements Service
type MembersService struct {
	log  log.Logger
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
	m.log.Debugf("delete member with id %s", input.Id)
	return m.repo.DeleteById(input.Id)
}

// CreateMember if the member with the given input does not exist in the repository
func (m MembersService) CreateMember(ctx context.Context, input CreateMemberInput) (string, error) {
	member, err := members.NewMember(m.log, input.Name, input.Surname)
	if err != nil {
		return "", err
	}

	found, err := m.repo.FindById(member.Id)
	if err != nil {
		return "", err
	}

	if found != nil {
		return "", AllReadyExistsError
	}

	err = m.repo.Save(member)
	if err != nil {
		return "", err
	}
	m.log.Debugf("created member with id %s", member.Id)
	return member.Id, nil
}

// ListMembers which are stored in the repository
func (m MembersService) ListMembers(ctx context.Context, options members.ListOptions) ([]members.Member, error) {
	return m.repo.List(options)
}
