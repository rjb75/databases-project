package main

import (
	"fmt"
	"log"

	"github.com/gofiber/fiber"
	"github.com/joho/godotenv"
	_ "github.com/lib/pq"
	"ucalgary.ca/cpsc441/eventmanagment/authentication"
	"ucalgary.ca/cpsc441/eventmanagment/database"
)

func setUpRouteHandlers(app *fiber.App) {
	app.Post("/api/v1/login", authentication.Login)
	app.Post("/api/v1/register", authentication.Register)
	app.Post("/api/v1/refresh", authentication.Refresh)
}

func main() {
	app := fiber.New()

	err := godotenv.Load("../../.env")
	if err != nil {
		log.Fatal("Error loading .env file")
	}

	database.DBConnect()
	database.ExecuteSQLFile("./database/tables.sql")

	setUpRouteHandlers(app)

	// router := mux.NewRouter()

	// buildHandler := http.FileServer((http.Dir("../../frontend/build")))

	// router.PathPrefix("/").Handler(buildHandler)

	fmt.Println("Server at 8000")
	// log.Fatal(http.ListenAndServe(":8000", router))
	app.Listen(8000)
}
