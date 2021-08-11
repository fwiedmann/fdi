package http

import (
	"encoding/json"
	"net/http"

	"github.com/gorilla/mux"

	"github.com/fwiedmann/fdi/backend/pkg/members/domain/members"

	"github.com/fwiedmann/fdi/backend/pkg/members/application"
)

const memberHttpPath = "/members"

type MemberHttp struct {
	Id      string `json:"id"`
	Name    string `json:"name"`
	Surname string `json:"surname"`
}

func AddRoute(mux *mux.Router, repo members.Repository) {
	res := MembersResource{
		service: application.NewService(repo),
	}
	mux.Methods(http.MethodPost).Path(memberHttpPath).HandlerFunc(res.Create)
	mux.Methods(http.MethodGet).Path(memberHttpPath).HandlerFunc(res.List)
}

type MembersResource struct {
	service application.Service
}

func (mr MembersResource) List(w http.ResponseWriter, r *http.Request) {
	defer func() {
		_ = r.Body.Close()
	}()

	membersList, err := mr.service.ListMembers(r.Context())
	if err != nil {
		http.Error(w, http.StatusText(http.StatusInternalServerError), http.StatusInternalServerError)
		return
	}

	membersResponse := make([]MemberHttp, 0)
	for _, m := range membersList {
		membersResponse = append(membersResponse, MemberHttp{
			Id:      m.Id,
			Name:    m.Name,
			Surname: m.Surname,
		})
	}
	err = json.NewEncoder(w).Encode(membersResponse)
	if err != nil {
		http.Error(w, http.StatusText(http.StatusInternalServerError), http.StatusInternalServerError)
		return
	}
}

func (mr MembersResource) Create(w http.ResponseWriter, r *http.Request) {
	defer func() {
		_ = r.Body.Close()
	}()

	member := MemberHttp{}
	err := json.NewDecoder(r.Body).Decode(&member)
	if err != nil {
		http.Error(w, http.StatusText(http.StatusUnprocessableEntity), http.StatusUnprocessableEntity)
		return
	}

	id, err := mr.service.CreateMember(r.Context(), application.CreateMemberInput{
		Name:    member.Name,
		Surname: member.Surname,
	})
	if err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}

	createResp := struct {
		Id string `json:"id"`
	}{
		Id: id,
	}

	err = json.NewEncoder(w).Encode(&createResp)
	if err != nil {
		http.Error(w, http.StatusText(http.StatusInternalServerError), http.StatusInternalServerError)
		return
	}
}
