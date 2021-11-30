package routes

import (
	//	"fmt"

	"github.com/gofiber/fiber/v2"
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
	userRoutes(v1)

	//Final MiddleWare
	app.Use(notFoundPage)
}

func authRoutes(v fiber.Router){
	v.Post("/login", database.Login)
	v.Post("/register", database.Register)
	v.Post("/refresh", database.Refresh)
	v.Post("/signout", database.SignOut)
}

func personRoutes(v fiber.Router){
	v.Get("/persons", database.GetPersons)

	v.Get("/person/:email", database.GetPerson)
	v.Post("/person/", database.CreatePerson)
	v.Delete("/person/:email", database.DeletePerson)
}

func userRoutes(v fiber.Router){
	v.Get("/reguser/:email", database.GetRegUser)
	v.Post("/reguser", database.CreateRegUser)

	v.Get("/unreguser/:email", database.GetUnRegUser)
	v.Post("/reguser", database.CreateUnRegUser)
}


func eventRoutes(v fiber.Router){
	v.Get("/ticket/:attendee_id", database.GetTicket)
	v.Post("/ticket", database.CreateTicket)
	v.Delete("/ticket/:attendee_id", database.DeleteTicket)

	v.Get("/form/:id", database.GetForm)
	v.Post("/form", database.CreateForm)
	v.Delete("/form/:id", database.DeleteForm)

    v.Get("/event/:id", database.GetEvent)
	v.Post("/event", database.CreateEvent)
	v.Delete("/event/:id", database.DeleteEvent)

	v.Get("/organizer/:email", database.GetOrganizer)
	v.Post("/organizer", database.CreateOrganizer)
	v.Delete("/organizer/:email", database.DeleteOrganizer)

	v.Get("/stream/:stream_number", database.GetStream)
	v.Post("/stream", database.CreateStream)
	v.Delete("/stream/:id", database.DeleteStream)
	v.Get("/streams", database.GetStreams)

	v.Get("/session/:session_number", database.GetSession)
	v.Post("/session", database.CreateSession)
	v.Delete("/session/:session_number", database.DeleteSession)
	// v.Get("/stream/session/:stream_number", database.GetSessionByStream)
}


func notFoundPage(c *fiber.Ctx) error {
	return c.SendStatus(404) // 404 "Not Found"
}