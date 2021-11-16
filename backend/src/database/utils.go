package database

import (
	"database/sql"
	"fmt"
	"io/ioutil"
	"os"
	_ "github.com/lib/pq"
)

var DATABASE *sql.DB

func DBConnect() {
	DB_NAME := os.Getenv("DB_NAME")
	DB_PASS := os.Getenv("DB_PASS")
	DB_USER := os.Getenv("DB_USER")
	DB_HOST := os.Getenv("DB_HOST")
	DB_PORT := os.Getenv("DB_PORT")

	dbinfo := fmt.Sprintf("host=%s port=%s user=%s password=%s dbname=%s sslmode=require", DB_HOST, DB_PORT, DB_USER, DB_PASS, DB_NAME)
	db, err := sql.Open("postgres", dbinfo)

	if err != nil {
		fmt.Println("Failed to connect to database.")
		panic(err)
	}

	DATABASE = db
}

func ExecuteSQLFile(filePath string) {
	fileContent, err := ioutil.ReadFile(filePath)

	if err != nil {
		panic(err)
	}

	if _, err := DATABASE.Exec(string(fileContent)); err != nil {
		panic(err)
	}
}
