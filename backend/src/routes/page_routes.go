package routes

import (
//	"fmt"

	"github.com/gofiber/fiber/v2"
	"github.com/gofiber/fiber/v2/middleware/cors"
)


func PageRoutes(app *fiber.App){
	const frontendBuildPath =  "../../frontend/build"
	app.Use(cors.New())

	app.Static("/",frontendBuildPath)
	app.Static("/main", frontendBuildPath)
}
