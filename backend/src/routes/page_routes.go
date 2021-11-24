package routes

import (
//	"fmt"

	"github.com/gofiber/fiber/v2"
	"github.com/gofiber/fiber/v2/middleware/cors"
)


func PageRoutes(app *fiber.App){
	app.Use(cors.New())
	app.Static("/", "../../frontend/build")
	app.Static("/main", "../../frontend/build")
}
