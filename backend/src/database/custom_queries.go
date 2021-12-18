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




func GetStreamsAndSessions_CC(c *fiber.Ctx) error{
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


func GetAllEvents_CC(c *fiber.Ctx) error{
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


func AssignSessionToStream_CC(c *fiber.Ctx) error{
	if(CheckAuth(c) == true){ //Error Check
		return nil
	}
	
	//Load Model
	composed_of := new(models.Composed_Of)
	err := c.BodyParser(composed_of)

	//Handling Errors
	if err != nil {
		c.Status(400).JSON(fiber.Map{"error": "failed to process inputs", "data": err})
		return nil
	 }

	//Add to Database
	row := DATABASE.QueryRow(
		`INSERT INTO Composed_Of(Stream_number, Session_number) VALUES ($1, $2);`,
		composed_of.Stream_number, composed_of.Session_number)

	//SQL Error Check
	if row.Err() != nil {
		return c.Status(500).JSON(fiber.Map{"status": "fail", "type": "SQL: Creating Person failed"}) //Returning success
	}

	//Success
	return c.Status(200).JSON(fiber.Map{"status": "success", "type": "Assigned Session to stream!"}) //Returning success
}

func GetAllAssociatedEvents_CC(c *fiber.Ctx) error{
    //Call SQL
    if(CheckAuth(c) == true){ //Error Check
        return nil
    }

    rows, err := DATABASE.Query(`SELECT e.id, e.name FROM EVENT as e, REGISTERED_USER as ru
    WHERE ru.email = '` + c.Params("email") + `' 
        and (ru.role = 'ORGANIZER'
        and e.id in (
        SELECT io.event_id FROM IS_ORGANIZING as io
            WHERE io.organizer_email=ru.email)
        or ( not (ru.role = 'null')
        and e.id IN (
        SELECT s.event_id FROM STREAM as s
            WHERE s.stream_number in (
                SELECT pi.stream_number From PARTICIPATING_IN as pi
                    WHERE pi.attendee_id = ru.attendee_id))));`)

    if err != nil {
        return c.Status(500).JSON(fiber.Map{"status": "fail", "type": "SQL: Querying Failed"}) //Returning success
    }

    var eventsTable []models.Event
    for rows.Next() {
        var event models.Event

        err = rows.Scan(&event.Id, &event.Name)
        
        eventsTable = append(eventsTable, models.Event{Id: event.Id, Name: event.Name })
    }

    return c.Status(200).JSON(fiber.Map{"status": "success", "data": eventsTable})
}

func GetEventRegisteredTo_CC(c *fiber.Ctx) error{
	//Call SQL
	if(CheckAuth(c) == true){ //Error Check
		return nil
	}

	rows, err := DATABASE.Query(`SELECT e.id, e.name FROM EVENT as e
	WHERE e.id in (
		SELECT s.event_id FROM STREAM as s
			WHERE s.stream_number in (
				SELECT pi.stream_number FROM PARTICIPATING_IN as pi
					WHERE attendee_id='` + c.Params("attendee_id") + `'));`)

	if err != nil {
		return c.Status(500).JSON(fiber.Map{"status": "fail", "type": "SQL: Querying Failed"}) //Returning success
	}

	var eventsTable []models.Event
	for rows.Next() {
		var event models.Event

		err = rows.Scan(&event.Id, &event.Name)
		
		eventsTable = append(eventsTable, models.Event{Id: event.Id, Name: event.Name })
	}

	return c.Status(200).JSON(fiber.Map{"status": "success", "data": eventsTable})
}



func AssignAttendeeToAccommodation_CC(c *fiber.Ctx) error{
	// if(CheckAuth(c) == true){ //Error Check
	// 	return nil
	// }
	
	//Load Model
	staying_at := new(models.Staying_At)
	err := c.BodyParser(staying_at)

	//Handling Errors
	if err != nil {
		c.Status(400).JSON(fiber.Map{"error": "failed to process inputs", "data": err})
		return nil
	 }

	//Add to Database
	row := DATABASE.QueryRow(
		`INSERT INTO Staying_At(attendee_id, accomodation_id) VALUES ($1, $2);`,
		staying_at.Attendee_id, staying_at.Accommodation_id)

	//SQL Error Check
	if row.Err() != nil {
		return c.Status(500).JSON(fiber.Map{"status": "fail", "type": "SQL: Assigning Attendee to Accommodation Failed"}) //Returning success
	}

	//Success
	return c.Status(200).JSON(fiber.Map{"status": "success", "type": "Creating Staying at"}) //Returning success
}

func GetAccommodationBasedOnEventId_CC(c *fiber.Ctx) error{
	//Call SQL
	if(CheckAuth(c) == true){ //Error Check
		return nil
	}

	rows, err := DATABASE.Query(`SELECT DISTINCT a.Room_Number, p.F_name, p.L_name, s.Name as School, a.capacity as Room_Total, a.Room_code FROM Accomodation as a, STAYING_AT as sa, IS_REPRESENTING as IR, SCHOOL as s, REGISTERED_USER as ru, PERSON as p
	WHERE a.event_id = '` + c.Params("event_id") + `' and
				p.email = ru.email and
				ru.attendee_id = sa.attendee_id and
				sa.accomodation_id = a.room_number and
				s.id = ir.school_id and
				ir.attendee_id = ru.attendee_id;
`)

	if err != nil {
		return c.Status(500).JSON(fiber.Map{"status": "fail", "type": "SQL: Querying Failed"}) //Returning success
	}


	var roomsTable [] interface{}
	for rows.Next() {
		var room RoomArray

		err = rows.Scan(&room.Room_number, &room.F_name, &room.L_name, &room.School, &room.Room_Total, &room.Room_code)
		roomsTable = append(roomsTable, RoomArray{Room_number: room.Room_number, Room_code: room.Room_code, F_name: room.F_name, L_name: room.L_name, School: room.School, Room_Total: room.Room_Total})
	}

	return c.Status(200).JSON(fiber.Map{"status": "success", "data": roomsTable})
}

type RoomArray struct{
	Room_number	string `json:"Room_number"`
	F_name 		string `json: "F_name"`
	L_name 		string `json: "L_name"`
	School 		string `json: "School"`
	Room_Total int64 `json: Room_Total`
	Room_code	int64 `json: Room_code`
}

func GetRoomCapacity_CC(c *fiber.Ctx) error{
	//Call SQL
	if(CheckAuth(c) == true){ //Error Check
		return nil
	}

	rows, err := DATABASE.Query(`SELECT a.room_number, a.Capacity, COUNT(room_number) as Current_total FROM ACCOMODATION as a, Person as p
	WHERE a.event_id = '` + c.Params("event_id") +`' and
				a.room_number in (
				SELECT accomodation_id FROM STAYING_AT
					WHERE attendee_id in (
					SELECT attendee_id FROM REGISTERED_USER
						WHERE email in (
						SELECT DISTINCT email FROM PERSON as p2
							WHERE p.F_name = p2.F_Name and
								p.L_name = p2.L_Name)))
	GROUP BY a.room_number;`)

	if err != nil {
		return c.Status(500).JSON(fiber.Map{"status": "fail", "type": "SQL: Querying Failed"}) //Returning success
	}

	var roomsTable [] interface{}
	for rows.Next() {
		var room RoomCapacity

		err = rows.Scan(&room.Room_number, &room.Room_Total, &room.Room_Current)

		roomsTable = append(roomsTable, RoomCapacity{Room_number: room.Room_number, Room_Total: room.Room_Total, Room_Current: room.Room_Current})
	}

	return c.Status(200).JSON(fiber.Map{"status": "success", "data": roomsTable})
}

type RoomCapacity struct{
	Room_number	string `json:"Room_number"`
	Room_Total int64 `json: Room_Total`
	Room_Current int64 `json: Room_Current`
}


func GetAccomodationsWithSchool_CC(c *fiber.Ctx) error{
		//Call SQL
	if(CheckAuth(c) == true){ //Error Check
		return nil
	}

	rows, err := DATABASE.Query(`SELECT a.room_number, s.name FROM ACCOMODATION as a, School as s
	WHERE a.event_id = '`+ c.Params("event_id")+ `' and
				a.room_number in (
				SELECT DISTINCT accomodation_id FROM STAYING_AT
					WHERE attendee_id in (
					SELECT DISTINCT  attendee_id FROM IS_REPRESENTING
						WHERE school_id = '`+ c.Params("school_id")+ `' and
									school_id = s.id));`)

	if err != nil {
		return c.Status(500).JSON(fiber.Map{"status": "fail", "type": "SQL: Querying Failed With Accomodations"}) //Returning success
	}


	var roomsTable [] interface{}
	for rows.Next() {
		var school SchoolRooms

		err = rows.Scan(&school.Room_number, &school.Name)

		rowsNew, err := DATABASE.Query(`
		SELECT p.email, p.f_name, p.m_name, p.l_name, p.pronouns, p.preferred_language, p.dietary_restriction FROM STAYING_AT as sa, REGISTERED_USER as ru, Person as p
		WHERE sa.accomodation_id = '` + school.Room_number + `' and
					ru.attendee_id= sa.attendee_id and
					ru.email = p.email;`)

		if err != nil {
			return c.Status(500).JSON(fiber.Map{"status": "fail", "type": "SQL: Querying Failed"}) //Returning success
		}
		var personsTable [] models.Person		
		for rowsNew.Next(){
			var person models.Person
			err = rowsNew.Scan(&person.Email, &person.F_name,&person.M_name,&person.L_name,&person.Pronouns,&person.Preferred_language, &person.Dietary_restriction)
			personsTable = append(personsTable, models.Person{Email: person.Email, F_name: person.F_name, M_name: person.M_name, L_name: person.L_name, Pronouns: person.Pronouns, Preferred_language: person.Preferred_language, Dietary_restriction: person.Dietary_restriction})
		}

		roomsTable = append(roomsTable, SchoolRooms{Room_number: school.Room_number, Name: school.Name, Persons: personsTable})
	}

	return c.Status(200).JSON(fiber.Map{"status": "success", "data": roomsTable})
}


type SchoolRooms struct{
	Room_number	string `json:"Room_number"`
	Name string `json: "Name"`
	Persons []models.Person `json:"Persons"`
}


func GetSchoolWithAttendeeId_CC(c *fiber.Ctx) error{
	//Call SQL
	if(CheckAuth(c) == true){ //Error Check
		return nil
	}

	row := DATABASE.QueryRow(`
	SELECT * FROM SCHOOL
		WHERE id in (
		SELECT school_id FROM IS_REPRESENTING
			WHERE attendee_id='` +  c.Params("attendee_id") +`');`)

	if row.Err() != nil {
		return c.Status(500).JSON(fiber.Map{"status": "fail", "type": "SQL: Querying Failed"}) //Returning success
	}

	var school models.School
	row.Scan(&school.Id, &school.Name, &school.Capacity, &school.Country, &school.Province, &school.Street_address,&school.Postal_code)

	return c.Status(200).JSON(fiber.Map{"status": "success", "data": school})
}


