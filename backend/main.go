package main

import (
	"net/http"
	"os"
	"time"

	"github.com/fwiedmann/fdi/backend/pkg/log"

	"github.com/gorilla/handlers"

	"github.com/fwiedmann/fdi/backend/pkg/members/infrastructure/members"
	membersHttp "github.com/fwiedmann/fdi/backend/pkg/members/interfaces/public/http"
	"github.com/gorilla/mux"
)

func main() {
	logger, err := log.InitDefaultLogger("debug")
	if err != nil {
		panic(err)
	}

	membersRepo, err := members.NewBoltDBRepository("fdi.db")
	if err != nil {
		panic(err)
	}
	router := mux.NewRouter()
	membersHttp.AddRoute(logger, router, membersRepo)
	corsHandler := handlers.CORS(handlers.AllowedOrigins([]string{"http://localhost:4200"}), handlers.AllowedMethods([]string{http.MethodGet, http.MethodPost, http.MethodDelete, http.MethodOptions, http.MethodHead}), handlers.AllowedHeaders([]string{"content-type"}), handlers.AllowCredentials())

	server := http.Server{
		Addr:         "localhost:8080",
		Handler:      handlers.LoggingHandler(os.Stdout, corsHandler(router)),
		WriteTimeout: time.Second * 10,
		ReadTimeout:  time.Second * 10,
	}

	panic(server.ListenAndServe())
}
