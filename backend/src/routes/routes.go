package routes

import (
//	"fmt"

	"github.com/gofiber/fiber/v2"
	"ucalgary.ca/cpsc441/eventmanagment/authentication"
	"ucalgary.ca/cpsc441/eventmanagment/database"
)

func RegisterRoutes(app *fiber.App) {
	//Site Routes
	PageRoutes(app)

	//Api Version Configuration
	api := app.Group("/api") 	// /api
	v1 := api.Group("/v1") 		// /api/v1

	//Api Routes
	authRoutes(v1)
	personRoutes(v1)

	//Final MiddleWare
	app.Use(notFoundPage)
}

func authRoutes(v fiber.Router){
	v.Post("/login", authentication.Login)
	v.Post("/register", authentication.Register)
	v.Post("/refresh", authentication.Refresh)
	v.Post("/signout", authentication.SignOut)
}

func personRoutes(v fiber.Router){
	v.Get("/persons", database.GetPersons)
	v.Post("/persons", database.PostPersons)

}

func notFoundPage(c *fiber.Ctx) error {
	return c.SendStatus(404) // 404 "Not Found"
}