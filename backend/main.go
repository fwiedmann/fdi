package main

import (
	"net/http"
	"time"

	"github.com/gorilla/handlers"

	"github.com/fwiedmann/fdi/backend/pkg/members/infrastructure/members"
	membersHttp "github.com/fwiedmann/fdi/backend/pkg/members/interfaces/public/http"
	"github.com/gorilla/mux"
)

func main() {
	membersRepo, err := members.NewBoltDBRepository("fdi.db")
	if err != nil {
		panic(err)
	}

	router := mux.NewRouter()
	membersHttp.AddRoute(router, membersRepo)

	corsHandler := handlers.CORS(handlers.AllowedOrigins([]string{"http://localhost:4200"}), handlers.AllowedMethods([]string{http.MethodGet, http.MethodPost, http.MethodDelete, http.MethodOptions, http.MethodHead}), handlers.AllowedHeaders([]string{"content-type"}), handlers.AllowCredentials())

	server := http.Server{
		Addr:         ":8080",
		Handler:      corsHandler(router),
		WriteTimeout: time.Second * 10,
		ReadTimeout:  time.Second * 10,
	}

	panic(server.ListenAndServe())
}
