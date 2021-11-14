package main

import (
	"fmt"
	"log"
	"net/http"

	"github.com/gorilla/mux"
	"github.com/joho/godotenv"
	_ "github.com/lib/pq"
	"ucalgary.ca/cpsc441/eventmanagment/database"
)

func main() {
	err := godotenv.Load("../../.env")
	if err != nil {
		log.Fatal("Error loading .env file")
	}

	database.DBConnect()
	database.ExecuteSQLFile("./database/tables.sql")

	router := mux.NewRouter()

	buildHandler := http.FileServer((http.Dir("../../frontend/build")))

	router.PathPrefix("/").Handler(buildHandler)

	fmt.Println("Server at 8000")
	log.Fatal(http.ListenAndServe(":8000", router))
}
