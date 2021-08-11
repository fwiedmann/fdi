package application

import (
	"context"

	"github.com/fwiedmann/fdi/backend/pkg/members/domain/members"
)

// CreateMemberInput is the required input in order to create a new Member
type CreateMemberInput struct {
	Name    string
	Surname string
}

// Service defines all available actions on the members domain
type Service interface {
	CreateMember(ctx context.Context, input CreateMemberInput) (string, error)
	ListMembers(ctx context.Context) ([]members.Member, error)
}

func NewService(repo members.Repository) Service {
	return MembersService{repo: repo}
}

type MembersService struct {
	repo members.Repository
}

func (m MembersService) CreateMember(ctx context.Context, input CreateMemberInput) (string, error) {
	member, err := members.NewMember(input.Name, input.Surname)
	if err != nil {
		return "", err
	}
	err = m.repo.Save(member)
	if err != nil {
		return "", err
	}
	return member.Id, nil
}

func (m MembersService) ListMembers(ctx context.Context) ([]members.Member, error) {
	return m.repo.List()
}
