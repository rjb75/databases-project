package database

import (
	"github.com/gofiber/fiber/v2"
	"github.com/google/uuid"
	_ "github.com/lib/pq"
	"ucalgary.ca/cpsc441/eventmanagment/models"
)


func CreateEvent_CC(c *fiber.Ctx) error{
	if(CheckAuth(c) == true){ //Error Check
		return nil
	}
	
	//Load Model
	event := new(models.Event)
	err := c.BodyParser(event)

	event.Id = uuid.New().String()

	//Handling Errors
	if err != nil {
		c.Status(400).JSON(fiber.Map{"error": "failed to process inputs", "data": err})
		return nil
	 }

	//Add to Database
	row := DATABASE.QueryRow(
		`INSERT INTO Event(Id, name) VALUES ($1, $2);`,
		event.Id, event.Name)

	//SQL Error Check
	if row.Err() != nil {
		return c.Status(500).JSON(fiber.Map{"status": "fail", "type": "SQL: Creating Person failed"}) //Returning success
	}

	//Success
	return c.Status(200).JSON(fiber.Map{"status": "success", "type": "Creating Event", "id": event.Id}) //Returning success
}


func GenerateAttendeeId_CC(c *fiber.Ctx) error{
	if(CheckAuth(c) == true){ //Error Check
		return nil
	}
	
	//Load Model
	x := new(models.Attendee)
	x.Attendee_id = uuid.New().String()

	//Add to Database
	row := DATABASE.QueryRow(
		`INSERT INTO Attendee(Attendee_id) VALUES ($1);`,
		x.Attendee_id)

	//SQL Error Check
	if row.Err() != nil {
		return c.Status(500).JSON(fiber.Map{"status": "fail", "type": "SQL: Creating Attendee ID failed"}) //Returning success
	}

	//Success
	return c.Status(200).JSON(fiber.Map{"status": "success", "type": "Creating Attendee	", "Attendee_id": x}) //Returning success
}


func GetAttendeesByEventId_CC(c *fiber.Ctx) error{
	//Call SQL
	if(CheckAuth(c) == true){ //Error Check
		return nil
	}

	rows, err := DATABASE.Query(`SELECT * FROM Person where email in (
		SELECT email FROM Registered_user where attendee_id in (
			SELECT attendee_id FROM Participating_in where stream_number in (
				SELECT stream_number FROM Stream where event_id='`+ c.Params("event_id") + `')));`)

	if err != nil {
		return c.Status(500).JSON(fiber.Map{"status": "fail", "type": "SQL: Querying Failed"}) //Returning success
	}

	var personsTable []models.Person
	for rows.Next() {
		var person models.Person

		err = rows.Scan(&person.Email, &person.F_name, &person.M_name, &person.L_name,  &person.Pronouns,  &person.Preferred_language, &person.Dietary_restriction)
		if err != nil {
		//	return c.Status(500).JSON(fiber.Map{"status": "fail", "type": "SQL: Querying Failed"}) //Returning success
		}
		
		personsTable = append(personsTable, models.Person{Email: person.Email, F_name: person.F_name, M_name: person.M_name,
			L_name: person.L_name, Pronouns: person.Pronouns, 
			Preferred_language: person.Preferred_language,
			Dietary_restriction: person.Dietary_restriction})
	}

	return c.Status(200).JSON(fiber.Map{"status": "success", "data": personsTable})
}




func GetStreamsAndSessions(c *fiber.Ctx) error{
	//Call SQL
	if(CheckAuth(c) == true){ //Error Check
		return nil
	}

	streamRows, err := DATABASE.Query(`SELECT * FROM Stream where event_id='`+ c.Params("event_id") + `';`)

	if err != nil {
		return c.Status(500).JSON(fiber.Map{"status": "fail", "type": "SQL: Querying Failed with Stream"}) //Returning success
	}

	var eventTable [] interface {}
	for streamRows.Next() {
		var stream models.Stream

		err = streamRows.Scan(&stream.Stream_number, &stream.Title, &stream.Event_id)

		sessionRows, err := DATABASE.Query(`SELECT * FROM Session where session_number in (
			SELECT session_number FROM Composed_of where stream_number='`+ stream.Stream_number+ `');
`)

		if err != nil {
			return c.Status(500).JSON(fiber.Map{"status": "fail", "type": "SQL: Querying Failed with Session"}) //Returning success
		}
		var sessionsTable [] models.Session

		for sessionRows.Next(){
			var session models.Session

			err = sessionRows.Scan(&session.Session_number, &session.Location, &session.Start_time, &session.Duration_minutes, &session.Title, &session.Description)

			sessionsTable = append(sessionsTable, models.Session{Session_number: session.Session_number, Location: session.Location, Start_time: session.Start_time, Duration_minutes: session.Duration_minutes, Title: session.Title, Description: session.Description  })
		}

		eventTable = append(eventTable, SessionArray{Title: stream.Title, Stream_id: stream.Stream_number, Sessions: sessionsTable})
	}

	return c.Status(200).JSON(fiber.Map{"status": "success", "data": eventTable})
}

type SessionArray struct{
	Title	string `json:"Title"`
	Stream_id	string `json:"Stream_id"`
	Sessions	[]models.Session `json:"Sessions"`
}


func GetAllEvents(c *fiber.Ctx) error{
	//Call SQL
	if(CheckAuth(c) == true){ //Error Check
		return nil
	}

	rows, err := DATABASE.Query(`SELECT * FROM Event;`)

	if err != nil {
		return c.Status(500).JSON(fiber.Map{"status": "fail", "type": "SQL: Querying Failed"}) //Returning success
	}

	var eventsTable []models.Event
	for rows.Next() {
		var event models.Event

		err = rows.Scan(&event.Id, &event.Name)
		if err != nil {
		//	return c.Status(500).JSON(fiber.Map{"status": "fail", "type": "SQL: Querying Failed"}) //Returning success
		}
		
		eventsTable = append(eventsTable, models.Event{Id: event.Id, Name: event.Name })
	}

	return c.Status(200).JSON(fiber.Map{"status": "success", "data": eventsTable})
}

