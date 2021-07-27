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

// MemberService defines all available actions on the members domain
type MemberService interface {
	CreateMember(ctx context.Context, input CreateMemberInput)
	ListMembers(ctx context.Context) []members.Member
}
