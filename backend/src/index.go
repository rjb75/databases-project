package main

import (
	"fmt"
	"log"

	"github.com/gofiber/fiber/v2"
	"github.com/joho/godotenv"
	_ "github.com/lib/pq"
	"ucalgary.ca/cpsc441/eventmanagment/authentication"
	"ucalgary.ca/cpsc441/eventmanagment/database"
)

func setUpRouteHandlers(app *fiber.App) {
	app.Post("/api/v1/login", authentication.Login)
	app.Post("/api/v1/register", authentication.Register)
	app.Get("/api/v1/persons", database.GetPersons)
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
	app.Static("/", "../../frontend/build")

	fmt.Println("Server at 8000")
	app.Listen(":8000")
}
