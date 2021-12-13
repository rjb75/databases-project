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

	rows, err := DATABASE.Query("SELECT * From Stream Where event_id ='" + c.Params("event_id") +"';")
	
	if err != nil {
		return c.Status(500).JSON(fiber.Map{"status": "fail", "type": "SQL: Querying Failed"}) //Returning success
	}

	var streamsTable []models.Stream
	for rows.Next() {
		var stream models.Stream

		err = rows.Scan(&stream.Stream_number, &stream.Title, &stream.Event_id)
		if err != nil {
		//	return c.Status(500).JSON(fiber.Map{"status": "fail", "type": "SQL: Querying Failed"}) //Returning success
		}
		
		streamsTable = append(streamsTable, models.Stream{Stream_number: stream.Stream_number, Title: stream.Title,
			Event_id: stream.Event_id})
	}

	//Retrieve all Attendees Id
	var participatingInTable []models.Participating_In
	for i, s := range streamsTable{
		_ = i
		rows, err := DATABASE.Query("SELECT * From PARTICIPATING_IN Where stream_number ='" + s.Stream_number +"';")
		
		if err != nil {
			return c.Status(500).JSON(fiber.Map{"status": "fail", "type": "SQL: Querying Failed"}) //Returning success
		}

		for rows.Next() {
			var participating_in models.Participating_In

			err = rows.Scan(&participating_in.Stream_number, &participating_in.Attendee_id)
			if err != nil {
			//	return c.Status(500).JSON(fiber.Map{"status": "fail", "type": "SQL: Querying Failed"}) //Returning success
			}
			
			participatingInTable = append(participatingInTable, models.Participating_In{Stream_number: participating_in.Stream_number, Attendee_id: participating_in.Attendee_id})
		}
	}

	//Retrieve RegisteredUser
	var registeredUserTable []models.Registered_User
	for i, s := range participatingInTable{
		_ = i
		rows, err := DATABASE.Query("SELECT * From Registered_User Where attendee_id ='" + s.Attendee_id +"' and role!='Organizer';")
		
		if err != nil {
			return c.Status(500).JSON(fiber.Map{"status": "fail", "type": "SQL: Querying Failed"}) //Returning success
		}

		for rows.Next() {
			var registeredUser models.Registered_User

			err = rows.Scan(&registeredUser.Email, &registeredUser.Hashed_password, &registeredUser.Role, &registeredUser.Attendee_id)
			if err != nil {
			//	return c.Status(500).JSON(fiber.Map{"status": "fail", "type": "SQL: Querying Failed"}) //Returning success
			}
			
			registeredUserTable = append(registeredUserTable, models.Registered_User{Email: registeredUser.Email, Hashed_password: registeredUser.Hashed_password, Role: registeredUser.Role, Attendee_id: registeredUser.Attendee_id})
		}
	}

	//Retrieve all Person Info
	var personsTable []models.Person
	for i, s := range registeredUserTable{
		_ = i
		rows, err := DATABASE.Query("SELECT * From Person Where email ='" + s.Email +"';")
		
		if err != nil {
			return c.Status(500).JSON(fiber.Map{"status": "fail", "type": "SQL: Querying Failed"}) //Returning success
		}

		for rows.Next() {
			var person models.Person

			err = rows.Scan(&person.Email, &person.F_name, &person.M_name, &person.L_name, &person.Pronouns, &person.Preferred_language, &person.Dietary_restriction)
			if err != nil {
			//	return c.Status(500).JSON(fiber.Map{"status": "fail", "type": "SQL: Querying Failed"}) //Returning success
			}
			
			personsTable = append(personsTable, models.Person{Email: person.Email, F_name: person.F_name, M_name: person.M_name, L_name: person.L_name, Pronouns: person.Pronouns, Preferred_language: person.Preferred_language, Dietary_restriction: person.Dietary_restriction})
		}
	}

	return c.Status(200).JSON(fiber.Map{"status": "success", "data": personsTable})
}