package main

import (
	"fmt"
	"log"
	"os"

	"github.com/gofiber/fiber/v2"
	"github.com/joho/godotenv"
	_ "github.com/lib/pq"
	"ucalgary.ca/cpsc441/eventmanagment/database"
	"ucalgary.ca/cpsc441/eventmanagment/routes"
)


func main() {
	app := fiber.New()

	err := godotenv.Load("../../.env")
	if err != nil {
		log.Fatal("Error loading .env file")
	}

	database.DBConnect()
	database.ExecuteSQLFile("./database/tables.sql")
	
	routes.RegisterRoutes(app);

	SERVER_PORT := os.Getenv("PORT")
	port := fmt.Sprintf(":%s", SERVER_PORT)
	app.Listen(port)
}