package routes

import (
	"github.com/gofiber/fiber/v2"
	"github.com/gofiber/fiber/v2/middleware/cors"
)

func PageRoutes(app *fiber.App) {
	const frontendBuildPath = "../../frontend/build"
	app.Use(cors.New())

	app.Static("/", frontendBuildPath)
	app.Static("/signup", frontendBuildPath)
	app.Static("/form-cards", frontendBuildPath)
	app.Static("/main", frontendBuildPath)
	app.Static("/form", frontendBuildPath)
	app.Static("/form-builder", frontendBuildPath)
	app.Static("/view-form-submission", frontendBuildPath)
	app.Static("/test", frontendBuildPath)
	app.Static("/sessions", frontendBuildPath)
	app.Static("/organizer-form-table", frontendBuildPath)
	app.Static("/dashboard", frontendBuildPath)
	app.Static("/invite/*", frontendBuildPath)
}
