package http

import (
	"encoding/json"
	"errors"
	"net/http"

	"github.com/fwiedmann/fdi/backend/pkg/log"

	"github.com/gorilla/mux"

	"github.com/fwiedmann/fdi/backend/pkg/members/domain/members"

	"github.com/fwiedmann/fdi/backend/pkg/members/application"
)

const membersHttpPath = "/members"
const membersHttpPathWithId = membersHttpPath + "/{id}"

type MemberHttp struct {
	Id      string `json:"id"`
	Name    string `json:"name"`
	Surname string `json:"surname"`
}

func AddRoute(log log.Logger, mux *mux.Router, repo members.Repository) {
	res := MembersResource{
		log:     log,
		service: application.NewService(log, repo),
	}
	mux.Methods(http.MethodPost).Path(membersHttpPath).HandlerFunc(res.Create)
	mux.Methods(http.MethodGet).Path(membersHttpPath).HandlerFunc(res.List)
	mux.Methods(http.MethodDelete).Path(membersHttpPathWithId).HandlerFunc(res.DeleteById)
}

type MembersResource struct {
	log     log.Logger
	service application.Service
}

func (mr MembersResource) List(w http.ResponseWriter, r *http.Request) {
	defer func() {
		_ = r.Body.Close()
	}()

	listOptions := members.ListOptions{}
	if val := r.URL.Query().Get("sort"); val != "" {
		if val == "true" {
			listOptions.SortAlphabetically = true
		}
	}

	membersList, err := mr.service.ListMembers(r.Context(), listOptions)
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
		if errors.Is(err, application.AllReadyExistsError) {
			http.Error(w, err.Error(), http.StatusConflict)
			return
		}
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

func (mr MembersResource) DeleteById(w http.ResponseWriter, r *http.Request) {
	defer func() {
		_ = r.Body.Close()
	}()
	params := mux.Vars(r)
	id, ok := params["id"]
	if !ok {
		http.Error(w, http.StatusText(http.StatusBadRequest), http.StatusBadRequest)
		return
	}

	err := mr.service.DeleteMember(r.Context(), application.DeleteMemberInput{Id: id})
	if err != nil {
		if errors.Is(err, application.NotExistsError) {
			http.NotFound(w, r)
			return
		}
		http.Error(w, http.StatusText(http.StatusInternalServerError), http.StatusInternalServerError)
		return
	}
	w.WriteHeader(http.StatusOK)
}
