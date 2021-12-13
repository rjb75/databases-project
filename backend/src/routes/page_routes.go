package routes

import (
	//	"fmt"

	"github.com/gofiber/fiber/v2"
	"github.com/gofiber/fiber/v2/middleware/cors"
)

func PageRoutes(app *fiber.App) {
	const frontendBuildPath = "../../frontend/build"
	app.Use(cors.New())

	app.Static("/", frontendBuildPath)
	app.Static("/signup", frontendBuildPath)
	app.Static("/main", frontendBuildPath)
	app.Static("/form", frontendBuildPath)
	app.Static("/form-builder", frontendBuildPath)
	app.Static("/test", frontendBuildPath)
	app.Static("/sessions", frontendBuildPath)
}
