package main

import (
	"database/sql"
	"encoding/json"
	"fmt"
	"log"
	"net/http"

	// "github.com/joho/godotenv"
	"github.com/gorilla/mux"
	_ "github.com/lib/pq"
)

const (
	DB_USER     = "postgres"
	DB_PASSWORD = "F0rdEdge!"
	DB_NAME     = "postgres"
)

type Movie struct {
	MovieID   string `json:"movieid"`
	MovieName string `json:"moviename"`
}

type JsonResponse struct {
	Type    string  `json:"type"`
	Data    []Movie `json:"data"`
	Message string  `json:"message"`
}

func setupDB() *sql.DB {
	dbinfo := fmt.Sprintf("user=%s password=%s dbname=%s sslmode=disable", DB_USER, DB_PASSWORD, DB_NAME)
	db, err := sql.Open("postgres", dbinfo)

	checkErr(err)

	return db
}

func main() {
	router := mux.NewRouter()

	router.HandleFunc("/movies/", GetMovies).Methods("GET")

	router.HandleFunc("/movies/", CreateMovie).Methods("POST")

	router.HandleFunc("/movies/{movieid}", DeleteMovie).Methods("DELETE")

	router.HandleFunc("/movies/", DeleteMovies).Methods("DELETE")

	buildHandler := http.FileServer((http.Dir("../../frontend/build")))

	router.PathPrefix("/").Handler(buildHandler)

	fmt.Println("Server at 8000")
	log.Fatal(http.ListenAndServe(":8000", router))
}

func printMessage(message string) {
	fmt.Println("")
	fmt.Println(message)
	fmt.Println("")
}

func checkErr(err error) {
	if err != nil {
		panic(err)
	}
}

func GetMovies(w http.ResponseWriter, r *http.Request) {
	db := setupDB()

	printMessage("Getting movies...")

	rows, err := db.Query("SELECT * FROM movies")

	checkErr(err)

	var movies []Movie
	for rows.Next() {
		var id int
		var movieID string
		var movieName string

		err = rows.Scan(&id, &movieID, &movieName)

		checkErr(err)

		movies = append(movies, Movie{MovieID: movieID, MovieName: movieName})
	}
	var response = JsonResponse{Type: "success", Data: movies}

	json.NewEncoder(w).Encode(response)
}

func CreateMovie(w http.ResponseWriter, r *http.Request) {
	movieID := r.FormValue("movieid")
	movieName := r.FormValue("moviename")

	var response = JsonResponse{}

	if movieID == "" || movieName == "" {
		response = JsonResponse{Type: "error", Message: "You are missing a paramater"}
	} else {
		db := setupDB()

		printMessage("Inserting movie into DB")

		fmt.Println("Inserting new movie with ID: " + movieID + " and name: " + movieName)

		var lastInsertID int

		err := db.QueryRow("INSERT INTO movies(movieID, movieName) VALUES($1, $2) returning id;", movieID, movieName).Scan(&lastInsertID)

		checkErr(err)

		response = JsonResponse{Type: "success", Message: "The movie has been inserted successfully"}

		json.NewEncoder(w).Encode(response)
	}
}

func DeleteMovie(w http.ResponseWriter, r *http.Request) {
	params := mux.Vars(r)

	movieID := params["movieid"]

	var response = JsonResponse{}

	if movieID == "" {
		response = JsonResponse{Type: "error", Message: "You are missing movieID paramater."}
	} else {
		db := setupDB()

		printMessage("Deleting movie from DB")

		_, err := db.Exec("DELETE FROM movies where movieID = $1", movieID)

		checkErr(err)

		response = JsonResponse{Type: "success", Message: "The movie has been deleted successfully"}
	}

	json.NewEncoder(w).Encode(response)
}

func DeleteMovies(w http.ResponseWriter, r *http.Request) {
	db := setupDB()

	printMessage("Deleting all movies...")

	_, err := db.Exec("DELETE FROM movies")

	checkErr(err)

	printMessage("ALL movies have been deleted successfully!")

	var response = JsonResponse{Type: "success", Message: "All movies have been deleted successfully"}

	json.NewEncoder(w).Encode(response)
}
