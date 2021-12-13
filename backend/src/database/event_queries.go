package database

import (
	"github.com/gofiber/fiber/v2"
	_ "github.com/lib/pq"
	"ucalgary.ca/cpsc441/eventmanagment/models"
)
func GetTicket(c *fiber.Ctx) error{
	//Call SQL
	if(CheckAuth(c) == true){ //Error Check
		return nil
	}

	result := DATABASE.QueryRow("SELECT * FROM Ticket Where attendee_id ='" + c.Params("attendee_id")  +"';")

	var ticket models.Ticket
	err := result.Scan(&ticket.Attendee_id, &ticket.Ticket_number, &ticket.Is_valid, &ticket.Event_id)

	if err != nil {
		return c.Status(500).JSON(fiber.Map{"status": "fail", "type": "SQL: Querying Failed"}) //Returning success
	}

	return c.Status(200).JSON(fiber.Map{"status": "success", "data": ticket})
}

func CreateTicket(c *fiber.Ctx) error{
	if(CheckAuth(c) == true){ //Error Check
		return nil
	}
	
	//Load Model
	ticket := new(models.Ticket)
	err := c.BodyParser(ticket)

	//Handling Errors
	if err != nil {
		c.Status(400).JSON(fiber.Map{"error": "failed to process inputs", "data": err})
		return nil
	 }

	//Add to Database
	row := DATABASE.QueryRow(
		`INSERT INTO Ticket(Attendee_id, Ticket_number, Is_valid, Event_id) VALUES ($1, $2, $3, $4);`,
		ticket.Attendee_id, ticket.Ticket_number, ticket.Is_valid, ticket.Event_id)

	//SQL Error Check
	if row.Err() != nil {
		return c.Status(500).JSON(fiber.Map{"status": "fail", "type": "SQL: Creating Person failed"}) //Returning success
	}

	//Success
	return c.Status(200).JSON(fiber.Map{"status": "success", "type": "Creating Person"}) //Returning success
}

func DeleteTicket(c *fiber.Ctx) error{
	//Call SQL
	if(CheckAuth(c) == true){ //Error Check
		return nil
	}

	rows, err := DATABASE.Query("DELETE FROM Ticket Where Attendee_id ='" + c.Params("Attendee_id")  +"';")

	if err != nil {
		return c.Status(500).JSON(fiber.Map{"status": "fail", "type": "SQL: Querying Failed", "data": rows}) //Returning success
	}

	return c.Status(200).JSON(fiber.Map{"status": "success"})
}



func GetForm(c *fiber.Ctx) error{
	//Call SQL
	if(CheckAuth(c) == true){ //Error Check
		return nil
	}

	result := DATABASE.QueryRow("SELECT * FROM Form Where Id ='" + c.Params("id")  +"';")

	var form models.Form
	err := result.Scan(&form.Id, &form.Data, &form.Created_by)

	if err != nil {
		return c.Status(500).JSON(fiber.Map{"status": "fail", "type": "SQL: Querying Failed"}) //Returning success
	}

	return c.Status(200).JSON(fiber.Map{"status": "success", "data": form})
}

func CreateForm(c *fiber.Ctx) error{
	if(CheckAuth(c) == true){ //Error Check
		return nil
	}
	
	//Load Model
	form := new(models.Form)
	err := c.BodyParser(form)

	//Handling Errors
	if err != nil {
		c.Status(400).JSON(fiber.Map{"error": "failed to process inputs", "data": err})
		return nil
	 }

	//Add to Database
	row := DATABASE.QueryRow(
		`INSERT INTO Ticket(Id, Data, Created_by) VALUES ($1, $2, $3);`,
		form.Id, form.Data, form.Created_by)

	//SQL Error Check
	if row.Err() != nil {
		return c.Status(500).JSON(fiber.Map{"status": "fail", "type": "SQL: Creating Person failed"}) //Returning success
	}

	//Success
	return c.Status(200).JSON(fiber.Map{"status": "success", "type": "Creating Form"}) //Returning success
}


func DeleteForm(c *fiber.Ctx) error{
	//Call SQL
	if(CheckAuth(c) == true){ //Error Check
		return nil
	}

	rows, err := DATABASE.Query("DELETE FROM Form Where Id ='" + c.Params("id")  +"';")

	if err != nil {
		return c.Status(500).JSON(fiber.Map{"status": "fail", "type": "SQL: Querying Failed", "data": rows}) //Returning success
	}

	return c.Status(200).JSON(fiber.Map{"status": "success"})
}

func GetEvent(c *fiber.Ctx) error{
	//Call SQL
	if(CheckAuth(c) == true){ //Error Check
		return nil
	}

	result := DATABASE.QueryRow("SELECT * FROM Form Where Id ='" + c.Params("id")  +"';")

	var event models.Event
	err := result.Scan(&event.Id, &event.Name)

	if err != nil {
		return c.Status(500).JSON(fiber.Map{"status": "fail", "type": "SQL: Querying Failed"}) //Returning success
	}

	return c.Status(200).JSON(fiber.Map{"status": "success", "data": event})
}

func CreateEvent(c *fiber.Ctx) error{
	if(CheckAuth(c) == true){ //Error Check
		return nil
	}
	
	//Load Model
	event := new(models.Event)
	err := c.BodyParser(event)

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
	return c.Status(200).JSON(fiber.Map{"status": "success", "type": "Creating Organizer"}) //Returning success
}


func DeleteEvent(c *fiber.Ctx) error{
	//Call SQL
	if(CheckAuth(c) == true){ //Error Check
		return nil
	}

	rows, err := DATABASE.Query("DELETE FROM Event Where Id ='" + c.Params("id")  +"';")

	if err != nil {
		return c.Status(500).JSON(fiber.Map{"status": "fail", "type": "SQL: Querying Failed", "data": rows}) //Returning success
	}

	return c.Status(200).JSON(fiber.Map{"status": "success"})
}

//-------------------------------Organizer----------------------------------

func GetOrganizer(c *fiber.Ctx) error{
	//Call SQL
	if(CheckAuth(c) == true){ //Error Check
		return nil
	}

	result := DATABASE.QueryRow("SELECT * FROM Form Where email ='" + c.Params("email")  +"';")

	var organizer models.Organizer
	err := result.Scan(&organizer.Email, &organizer.Event_id)

	if err != nil {
		return c.Status(500).JSON(fiber.Map{"status": "fail", "type": "SQL: Querying Failed"}) //Returning success
	}

	return c.Status(200).JSON(fiber.Map{"status": "success", "data": organizer})
}

func CreateOrganizer(c *fiber.Ctx) error{
	if(CheckAuth(c) == true){ //Error Check
		return nil
	}
	
	//Load Model
	organizer := new(models.Organizer)
	err := c.BodyParser(organizer)

	//Handling Errors
	if err != nil {
		c.Status(400).JSON(fiber.Map{"error": "failed to process inputs", "data": err})
		return nil
	 }

	//Add to Database
	row := DATABASE.QueryRow(
		`INSERT INTO Organizer(email, event_id) VALUES ($1, $2);`,
		organizer.Email, organizer.Event_id)

	//SQL Error Check
	if row.Err() != nil {
		return c.Status(500).JSON(fiber.Map{"status": "fail", "type": "SQL: Creating Organizer failed"}) //Returning success
	}

	//Success
	return c.Status(200).JSON(fiber.Map{"status": "success", "type": "Creating Event"}) //Returning success
}

func DeleteOrganizer(c *fiber.Ctx) error{
	//Call SQL
	if(CheckAuth(c) == true){ //Error Check
		return nil
	}

	rows, err := DATABASE.Query("DELETE FROM Event Where email ='" + c.Params("email")  +"';")

	if err != nil {
		return c.Status(500).JSON(fiber.Map{"status": "fail", "type": "SQL: Querying Failed", "data": rows}) //Returning success
	}

	return c.Status(200).JSON(fiber.Map{"status": "success"})
}

//-------------------------------Stream----------------------------------

func GetStream(c *fiber.Ctx) error{
	//Call SQL
	if(CheckAuth(c) == true){ //Error Check
		return nil
	}

	result := DATABASE.QueryRow("SELECT * FROM Stream Where stream_number='" + c.Params("stream_number")  +"';")

	var stream models.Stream
	err := result.Scan(&stream.Stream_number, &stream.Title, &stream.Event_id)

	if err != nil {
		return c.Status(500).JSON(fiber.Map{"status": "fail", "type": "SQL: Querying Failed"}) //Returning success
	}

	return c.Status(200).JSON(fiber.Map{"status": "success", "data": stream})
}

func CreateStream(c *fiber.Ctx) error{
	if(CheckAuth(c) == true){ //Error Check
		return nil
	}
	
	//Load Model
	stream := new(models.Stream)
	err := c.BodyParser(stream)

	//Handling Errors
	if err != nil {
		c.Status(400).JSON(fiber.Map{"error": "failed to process inputs", "data": err})
		return nil
	 }

	//Add to Database
	row := DATABASE.QueryRow(
		`INSERT INTO Stream(stream_number, title, event_id) VALUES ($1, $2, $3);`,
		stream.Stream_number, stream.Title, stream.Event_id)

	//SQL Error Check
	if row.Err() != nil {
		return c.Status(500).JSON(fiber.Map{"status": "fail", "type": "SQL: Creating Stream failed"}) //Returning success
	}

	//Success
	return c.Status(200).JSON(fiber.Map{"status": "success", "type": "Creating Event"}) //Returning success
}

func DeleteStream(c *fiber.Ctx) error{
	//Call SQL
	if(CheckAuth(c) == true){ //Error Check
		return nil
	}

	rows, err := DATABASE.Query("DELETE FROM Stream Where Stream_number ='" + c.Params("email")  +"';")

	if err != nil {
		return c.Status(500).JSON(fiber.Map{"status": "fail", "type": "SQL: Querying Failed", "data": rows}) //Returning success
	}

	return c.Status(200).JSON(fiber.Map{"status": "success"})
}


func GetStreams(c *fiber.Ctx) error{
	//Call SQL
	if(CheckAuth(c) == true){ //Error Check
		return nil
	}
	rows, err := DATABASE.Query("SELECT * FROM Stream;")

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

	return c.Status(200).JSON(fiber.Map{"status": "success", "data": streamsTable})
}

//-------------------------------Session----------------------------------

func GetSession(c *fiber.Ctx) error{
	//Call SQL
	if(CheckAuth(c) == true){ //Error Check
		return nil
	}

	result := DATABASE.QueryRow("SELECT * FROM Session Where session_number::text='" + c.Params("stream_number")  +"';")

	var session models.Session
	err := result.Scan(&session.Session_number, &session.Location, &session.Start_time, &session.Duration_minutes)

	if err != nil {
		return c.Status(500).JSON(fiber.Map{"status": "fail", "type": "SQL: Querying Failed"}) //Returning success
	}

	return c.Status(200).JSON(fiber.Map{"status": "success", "data": session})
}


func CreateSession(c *fiber.Ctx) error{
	if(CheckAuth(c) == true){ //Error Check
		return nil
	}
	
	//Load Model
	session := new(models.Session)
	err := c.BodyParser(session)

	//Handling Errors
	if err != nil {
		c.Status(400).JSON(fiber.Map{"error": "failed to process inputs", "data": err})
		return nil
	 }

	//Add to Database
	row := DATABASE.QueryRow(
		`INSERT INTO Session(session_number, location, start_time, duration_minutes) VALUES ($1, $2, $3, $4);`,
		session.Session_number, session.Location, session.Start_time, session.Duration_minutes)

	//SQL Error Check
	if row.Err() != nil {
		return c.Status(500).JSON(fiber.Map{"status": "fail", "type": "SQL: Creating Session failed"}) //Returning success
	}

	//Success
	return c.Status(200).JSON(fiber.Map{"status": "success", "type": "Creating Session"}) //Returning success
}

func DeleteSession(c *fiber.Ctx) error{
	//Call SQL
	if(CheckAuth(c) == true){ //Error Check
		return nil
	}

	rows, err := DATABASE.Query("DELETE FROM Session Where Session_number::text ='" + c.Params("session_number")  +"';")

	if err != nil {
		return c.Status(500).JSON(fiber.Map{"status": "fail", "type": "SQL: Querying Failed", "data": rows}) //Returning success
	}

	return c.Status(200).JSON(fiber.Map{"status": "success"})
}

func GetSessionByStream(c *fiber.Ctx) error{
	//Call SQL
	if(CheckAuth(c) == true){ //Error Check
		return nil
	}
	rows, err := DATABASE.Query("SELECT * FROM COMPOSED_OF Where stream_number::text='" + c.Params("stream_number")  +"';")

	if err != nil {
		return c.Status(500).JSON(fiber.Map{"status": "fail", "type": "SQL: Querying Failed"}) //Returning success
	}

	var sessionsTables []models.Session
	for rows.Next() {
		var composed_Of models.Composed_Of

		err = rows.Scan(&composed_Of.Stream_number, &composed_Of.Session_number)
		if err != nil {
		//	return c.Status(500).JSON(fiber.Map{"status": "fail", "type": "SQL: Querying Failed"}) //Returning success
		}

		result := DATABASE.QueryRow("SELECT * FROM Session Where session_number::text='" + composed_Of.Session_number  +"';")

		var session models.Session
		err := result.Scan(&session.Session_number, &session.Location, &session.Start_time, &session.Duration_minutes)
	
		if err != nil {
			return c.Status(500).JSON(fiber.Map{"status": "fail", "type": "SQL: Querying Failed"}) //Returning success
		}

		sessionsTables = append(sessionsTables, models.Session{Session_number: session.Session_number, Location: session.Location, Start_time: session.Start_time, Duration_minutes: session.Duration_minutes})
	}


	return c.Status(200).JSON(fiber.Map{"status": "success", "data": sessionsTables})
}


//-------------------------------Accomodations----------------------------------

func GetAccommodation(c *fiber.Ctx) error{
	//Call SQL
	if(CheckAuth(c) == true){ //Error Check
		return nil
	}

	result := DATABASE.QueryRow("SELECT * FROM Accomodation Where room_number::text='" + c.Params("room_number")  +"';")

	var accommodation models.Accommodation
	err := result.Scan(&accommodation.Room_number, &accommodation.Capacity, &accommodation.Country, &accommodation.Province, &accommodation.Street_address, &accommodation.Postal_code)

	if err != nil {
		return c.Status(500).JSON(fiber.Map{"status": "fail", "type": "SQL: Querying Failed"}) //Returning success
	}

	return c.Status(200).JSON(fiber.Map{"status": "success", "data": accommodation})
}


func CreateAccommodation(c *fiber.Ctx) error{
	if(CheckAuth(c) == true){ //Error Check
		return nil
	}
	
	//Load Model
	accommodation := new(models.Accommodation)
	err := c.BodyParser(accommodation)

	//Handling Errors
	if err != nil {
		c.Status(400).JSON(fiber.Map{"error": "failed to process inputs", "data": err})
		return nil
	 }

	//Add to Database
	row := DATABASE.QueryRow(
		`INSERT INTO Accomodation(Room_number, Capacity, Country, Province, Street_address, Postal_code) VALUES ($1, $2, $3, $4, $5, $6);`,
		accommodation.Room_number, accommodation.Capacity, accommodation.Country, accommodation.Province, accommodation.Street_address, accommodation.Postal_code)

	//SQL Error Check
	if row.Err() != nil {
		return c.Status(500).JSON(fiber.Map{"status": "fail", "type": "SQL: Creating Accommodations failed"}) //Returning success
	}

	//Success
	return c.Status(200).JSON(fiber.Map{"status": "success", "type": "Creating Accommodations"}) //Returning success
}


//-------------------------------School----------------------------------

func GetSchool(c *fiber.Ctx) error{
	//Call SQL
	if(CheckAuth(c) == true){ //Error Check
		return nil
	}

	result := DATABASE.QueryRow("SELECT * FROM School Where id::text='" + c.Params("id")  +"';")

	var school models.School
	err := result.Scan(&school.Id, &school.Name, &school.Country, &school.Province, &school.Street_address, &school.Postal_code)

	if err != nil {
		return c.Status(500).JSON(fiber.Map{"status": "fail", "type": "SQL: Querying Failed"}) //Returning success
	}

	return c.Status(200).JSON(fiber.Map{"status": "success", "data": school})
}

func GetSchools(c *fiber.Ctx) error{
	rows, err := DATABASE.Query("SELECT * FROM school;")

	if err != nil {
		return c.Status(500).JSON(fiber.Map{"status": "fail", "type": "SQL: Querying Failed"}) //Returning success
	}

	var schoolsTable []models.School
	for rows.Next() {
		var school models.School

		err = rows.Scan(&school.Id, &school.Name, &school.Capacity, &school.Country, &school.Province, &school.Street_address, &school.Postal_code)
		if err != nil {
		//	return c.Status(500).JSON(fiber.Map{"status": "fail", "type": "SQL: Querying Failed"}) //Returning success
		}
		
		schoolsTable = append(schoolsTable, models.School{Id: school.Id, Name: school.Name, Capacity: school.Capacity, Country: school.Country, 
		Province: school.Province, Street_address: school.Street_address, Postal_code: school.Postal_code})
	}

	return c.Status(200).JSON(fiber.Map{"status": "success", "data": schoolsTable})
}


func CreateSchool(c *fiber.Ctx) error{	
	//Load Model
	school := new(models.School)
	err := c.BodyParser(school)

	//Handling Errors
	if err != nil {
		c.Status(400).JSON(fiber.Map{"error": "failed to process inputs", "data": err})
		return nil
	 }

	//Add to Database
	row := DATABASE.QueryRow(
		`INSERT INTO School(Id, Name, Capacity, Country, Province, Street_address, Postal_code) VALUES (DEFAULT, $1, $2, $3, $4, $5, $6);`,
		school.Name, school.Capacity, school.Country, school.Province, school.Street_address, school.Postal_code)

	//SQL Error Check
	if row.Err() != nil {
		return c.Status(500).JSON(fiber.Map{"status": "fail", "type": "SQL: Creating School failed"}) //Returning success
	}

	//Success
	return c.Status(200).JSON(fiber.Map{"status": "success", "type": "Creating School"}) //Returning success
}

func DeleteSchool(c *fiber.Ctx) error{
	//Call SQL
	if(CheckAuth(c) == true){ //Error Check
		return nil
	}

	rows, err := DATABASE.Query("DELETE FROM School Where id::text ='" + c.Params("id")  +"';")

	if err != nil {
		return c.Status(500).JSON(fiber.Map{"status": "fail", "type": "SQL: Querying Failed", "data": rows}) //Returning success
	}

	return c.Status(200).JSON(fiber.Map{"status": "success"})
}