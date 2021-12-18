package database

import (
	"fmt"

	"github.com/gofiber/fiber/v2"
	"github.com/google/uuid"
	_ "github.com/lib/pq"
	"ucalgary.ca/cpsc441/eventmanagment/models"
	"ucalgary.ca/cpsc441/eventmanagment/email"
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
		`INSERT INTO Ticket(Attendee_id, Ticket_number, Is_valid, Event_id) VALUES ($1, DEFAULT, $2, $3);`,
		ticket.Attendee_id, ticket.Is_valid, ticket.Event_id)

	//SQL Error Check
	if row.Err() != nil {
		fmt.Println(row.Err())
		return c.Status(500).JSON(fiber.Map{"status": "fail", "type": "SQL: Creating Ticket failed"}) //Returning success
	}

	//Success
	return c.Status(200).JSON(fiber.Map{"status": "success", "type": "Creating Ticket"}) //Returning success
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
	err := result.Scan(&form.Id, &form.Data, &form.Created_by, &form.Event_id, &form.Form_name)

	if err != nil {
		return c.Status(500).JSON(fiber.Map{"status": "fail", "type": "SQL: Querying Failed"}) //Returning success
	}

	return c.Status(200).JSON(fiber.Map{"status": "success", "data": form})
}

func GetFormForEvent(c *fiber.Ctx) error{
	//Call SQL
	if(CheckAuth(c) == true){ //Error Check
		return nil
	}

	rows, err := DATABASE.Query("SELECT * FROM Form Where Event_id ='" + c.Params("event_id")  +"';")

	if err != nil {
		return c.Status(500).JSON(fiber.Map{"status": "fail", "type": "SQL: Querying Failed"})
	}

	var formsTable []models.Form
	for rows.Next() {
		var form models.Form

		err = rows.Scan(&form.Id, &form.Data, &form.Created_by, &form.Event_id, &form.Form_name)
		
		formsTable = append(formsTable, form)
	}

	return c.Status(200).JSON(fiber.Map{"status": "success", "data": formsTable})
}


func GetOrganizerFormForEvent(c *fiber.Ctx) error {
	//Call SQL
	if(CheckAuth(c) == true){ //Error Check
		return nil
	}

	rows, err := DATABASE.Query(`SELECT ID, Form_name, Data, Created_by, Event_id
	FROM Form f 
	Where f.Event_id =$1;`, c.Params("event_id"))

	if err != nil {
		fmt.Println(err)
		return c.Status(500).JSON(fiber.Map{"status": "fail", "type": "SQL: Querying Failed"})
	}

	var formsTable []models.OrganizerForm
	for rows.Next() {
		var form models.OrganizerForm

		err = rows.Scan(&form.Id, &form.Form_name, &form.Data, &form.Created_by, &form.Event_id)

		result := DATABASE.QueryRow(`SELECT COUNT(Form_id) FROM COMPLETE_FORM
		 Where Form_id =$1;`, form.Id)

		result.Scan(&form.Responses)

		
		formsTable = append(formsTable, form)
	}

	return c.Status(200).JSON(fiber.Map{"status": "success", "data": formsTable})
}

func GetHeadDelegateFormForEvent(c *fiber.Ctx) error {
	//Call SQL
	if(CheckAuth(c) == true){ //Error Check
		return nil
	}

	rows, err := DATABASE.Query(`SELECT ID, Form_name, Data, Created_by, Event_id
	FROM Form f 
	Where f.Event_id =$1;`, c.Params("event_id"))

	if err != nil {
		fmt.Print("err: ")
		fmt.Println(err)
		return c.Status(500).JSON(fiber.Map{"status": "fail", "type": "SQL: Querying Failed"})
	}

	var formsTable []models.HeadDelegateForm
	for rows.Next() {
		var form models.HeadDelegateForm

		err = rows.Scan(&form.Id, &form.Form_name, &form.Data, &form.Created_by, &form.Event_id)

		result := DATABASE.QueryRow(`SELECT COUNT(Form_id) FROM COMPLETE_FORM
		 Where Form_id =$1 AND Attendee_id = $2;`, form.Id, c.Params("attendee_id"));

		result.Scan(&form.Head_response)

		var delegateResponseTable []models.DelegateResponse

		result2, err3 := DATABASE.Query(`SELECT p.F_name, p.M_name, p.L_name 
		FROM COMPLETE_FORM cf, REGISTERED_USER r, Person p 
		Where cf.Form_id =$1 AND cf.Attendee_id = r.Attendee_id AND r.Email = p.Email AND
		r.Role = 'DELEGATE';`, form.Id);

		 if err3 != nil {
			fmt.Print("err3: ")
			fmt.Println(err3)
			continue
		}

		for result2.Next() {
			var resp models.DelegateResponse
			var fName = ""
			var mName = ""
			var lName = ""
			result2.Scan(&fName, &mName, &lName)
			resp.Response = 1
			resp.Name = fName + " " + mName + " " + lName

			delegateResponseTable = append(delegateResponseTable, resp)
		}

		result3, err4 := DATABASE.Query(`SELECT p.F_name, p.M_name, p.L_name 
		FROM PARTICIPATING_IN pi, Stream s, REGISTERED_USER r, Person p 
		Where pi.Stream_number = s.Stream_number AND s.Event_id = $1 
		AND pi.Attendee_id = r.Attendee_id AND r.Email = p.Email AND r.Role = 'DELEGATE' AND
		p.Email NOT IN (
		SELECT p2.Email 
		FROM COMPLETE_FORM cf, REGISTERED_USER r2, Person p2 
		Where cf.Form_id =$2 AND cf.Attendee_id = r2.Attendee_id AND r2.Email = p2.Email
		);`, c.Params("event_id"), form.Id);

		if err4 != nil {
			fmt.Print("err4: ")
			fmt.Println(err4)
			continue
		}

		for result3.Next() {
			var resp models.DelegateResponse
			var fName = ""
			var mName = ""
			var lName = ""
			result3.Scan(&fName, &mName, &lName)
			resp.Response = 0
			resp.Name = fName + " " + mName + " " + lName

			delegateResponseTable = append(delegateResponseTable, resp)
		}

		

		form.Delegate_responses = delegateResponseTable
		
		formsTable = append(formsTable, form)
	}

	return c.Status(200).JSON(fiber.Map{"status": "success", "data": formsTable})
}


func GetDelegateFormForEvent(c *fiber.Ctx) error {
	//Call SQL
	if(CheckAuth(c) == true){ //Error Check
		return nil
	}

	rows, err := DATABASE.Query(`SELECT ID, Form_name, Data, Created_by, Event_id
	FROM Form f 
	Where f.Event_id =$1;`, c.Params("event_id"))

	if err != nil {
		fmt.Print("err: ")
		fmt.Println(err)
		return c.Status(500).JSON(fiber.Map{"status": "fail", "type": "SQL: Querying Failed"})
	}

	var formsTable []models.DelegateForm
	for rows.Next() {
		var form models.DelegateForm

		err = rows.Scan(&form.Id, &form.Form_name, &form.Data, &form.Created_by, &form.Event_id)

		result := DATABASE.QueryRow(`SELECT COUNT(Form_id) FROM COMPLETE_FORM 
		 Where Form_id =$1 AND Attendee_id = $2;`, form.Id, c.Params("attendee_id"));

		result.Scan(&form.Response)
		
		formsTable = append(formsTable, form)
	}

	return c.Status(200).JSON(fiber.Map{"status": "success", "data": formsTable})
}


func GetFormSubmissions(c *fiber.Ctx) error {
	//Call SQL
	if(CheckAuth(c) == true){ //Error Check
		return nil
	}

	rows, err := DATABASE.Query(`SELECT f.Data, cf.Filled_data, p.F_name, COALESCE (p.M_name, ''), COALESCE (p.L_name, ''), 
	COALESCE (p.Preferred_language, 'N/A') AS Preferred_language, COALESCE (p.Dietary_restriction, 'N/A'), s.Name, 
	st.Title, t.Is_valid::text
	FROM FORM f, COMPLETE_FORM cf, REGISTERED_USER r, PERSON p, IS_REPRESENTING ir, SCHOOL s, TICKET t, 
	PARTICIPATING_IN pi, Stream st
	Where cf.Form_id = $1 AND f.ID = cf.Form_id AND r.Attendee_id = cf.Attendee_id AND 
	r.Email = p.Email AND ir.Attendee_id = r.Attendee_id AND ir.School_id = s.ID AND 
	t.Attendee_id = r.Attendee_id AND t.Event_id = f.Event_id AND pi.Attendee_id = r.Attendee_id 
	AND pi.Stream_number = st.Stream_number;`, c.Params("form_id"))

	if err != nil {
		fmt.Println(err)
		return c.Status(500).JSON(fiber.Map{"status": "fail", "type": "SQL: Querying Failed"})
	}

	var formsTable []models.FormSubmission
	for rows.Next() {
		var form models.FormSubmission

		var fName = ""
		var mName = ""
		var lName = ""

		err = rows.Scan(&form.Data, &form.Answer_data, &fName, &mName, &lName, &form.Preferred_language, &form.Dietary_restriction, 
		&form.School_name, &form.Stream, &form.Registration_status)

		form.Name = fName + " " + mName + " " + lName
		if form.Registration_status == "1" {
			form.Registration_status = "Complete"
		} else {
			form.Registration_status = "Cancelled"
		}

		if form.Preferred_language == "" {
			form.Preferred_language = "N/A"
		}

		if form.Dietary_restriction == "" {
			form.Dietary_restriction = "N/A"
		}
		
		formsTable = append(formsTable, form)
	}

	return c.Status(200).JSON(fiber.Map{"status": "success", "data": formsTable})
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
		`INSERT INTO FORM(Id, Data, Created_by, Event_id, Form_name) VALUES (DEFAULT, $1, $2, $3, $4);`,
		form.Data, form.Created_by, form.Event_id, form.Form_name)

	//SQL Error Check
	if row.Err() != nil {
		return c.Status(500).JSON(fiber.Map{"status": "fail", "type": "SQL: Creating Form failed"}) //Returning success
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


func CreateCompleteForm(c *fiber.Ctx) error{
	if(CheckAuth(c) == true){ //Error Check
		return nil
	}
	
	//Load Model
	completeForm := new(models.CompleteForm)
	err := c.BodyParser(completeForm)

	//Handling Errors
	if err != nil {
		c.Status(400).JSON(fiber.Map{"error": "failed to process inputs", "data": err})
		return nil
	 }

	//Add to Database
	row := DATABASE.QueryRow(
		`INSERT INTO COMPLETE_FORM(Form_id, Attendee_id, Filled_data) VALUES ($1, $2, $3);`,
		completeForm.Form_id, completeForm.Attendee_id, completeForm.Filled_data)

	//SQL Error Check
	if row.Err() != nil {
		return c.Status(500).JSON(fiber.Map{"status": "fail", "type": "SQL: Creating Form failed"}) //Returning success
	}

	//Success
	return c.Status(200).JSON(fiber.Map{"status": "success", "type": "Creating Complete Form"}) //Returning success
}

func GetEvent(c *fiber.Ctx) error{

	result := DATABASE.QueryRow("SELECT * FROM EVENT Where Id ='" + c.Params("id")  +"';")

	var event models.Event
	err := result.Scan(&event.Id, &event.Name)

	if err != nil {
		return c.Status(500).JSON(fiber.Map{"status": "fail", "type": "SQL: Querying Failed"}) //Returning success
	}

	return c.Status(200).JSON(fiber.Map{"status": "success", "data": event})
}

func SendInvitation(c *fiber.Ctx) error{
	//Call SQL
	invitation := new(models.InvitationLoad)
	err := c.BodyParser(invitation)

	if err != nil {
		c.Status(400).JSON(fiber.Map{"error": "failed to process inputs", "data": err})
		return err
	 }

	 userToken, userErr := CreateUnRegisteredUser(invitation.User_email)

	 if userErr != nil || userToken == "" {
		return c.Status(500).JSON(fiber.Map{"status": "fail", "data": userErr})
		return userErr
	 }

	status, emailErr := email.SendMessage(invitation.Event_name, invitation.Stream_name, invitation.User_email,
	invitation.Event_id, invitation.Stream_number, userToken)

	if status != 202 {
		return c.Status(500).JSON(fiber.Map{"status": "fail", "data": emailErr})
	}

	return c.Status(200).JSON(fiber.Map{"status": "success", "type": "Email being processed"})
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
		`INSERT INTO Event(Id, name) VALUES (DEFAULT, $2) RETURNING ID;`,event.Name)

	var addedEventId = "";	

	//SQL Error Check
	if row.Err() != nil {
		return c.Status(500).JSON(fiber.Map{"status": "fail", "type": "SQL: Creating Person failed"}) //Returning success
	}

	row.Scan(&addedEventId)

	//Success
	return c.Status(200).JSON(fiber.Map{"status": "success", "type": "Creating Organizer", "data": addedEventId}) //Returning success
}

func CreateOrganizerEvent(c *fiber.Ctx) error{
	if(CheckAuth(c) == true){ //Error Check
		return nil
	}

	//Load Model
	event := new(models.CreateEventLoad)
	err := c.BodyParser(event)

	//Handling Errors
	if err != nil {
		c.Status(400).JSON(fiber.Map{"error": "failed to process inputs", "data": err})
		return nil
	 }

	//Add to Database
	row := DATABASE.QueryRow(
		`INSERT INTO Event(Id, name) VALUES (DEFAULT, $1) RETURNING ID;`, event.Name)

	var addedEventId = "";	

	//SQL Error Check
	if row.Err() != nil {
		return c.Status(500).JSON(fiber.Map{"status": "fail", "type": "SQL: Creating event failed"}) //Returning success
	}

	row.Scan(&addedEventId)

	row2 := DATABASE.QueryRow(`INSERT INTO IS_ORGANIZING(Organizer_email, Event_id) VALUES ($1, $2);`, event.Email, addedEventId)

	if row2.Err() != nil {
		return c.Status(500).JSON(fiber.Map{"status": "fail", "type": "SQL: Creating Is Organizing failed"}) //Returning success
	}

	//Success
	return c.Status(200).JSON(fiber.Map{"status": "success", "type": "Creating Organizer", "data": addedEventId}) //Returning success
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
	err := result.Scan(&organizer.Email)

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
		`INSERT INTO Organizer(email) VALUES ($1);`,
		organizer.Email)

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

	result := DATABASE.QueryRow("SELECT * FROM Stream Where stream_number='" + c.Params("stream_number")  +"';")

	var stream models.Stream
	err := result.Scan(&stream.Stream_number, &stream.Title, &stream.Event_id)

	if err != nil {
		fmt.Println(err)
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
	stream.Stream_number = uuid.New().String()

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
	return c.Status(200).JSON(fiber.Map{"status": "success", "type": "Creating Stream", "stream_number": stream.Stream_number}) //Returning success
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


func GetStreamsFromEvent(c *fiber.Ctx) error {
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

		if err != nil {
			return c.Status(500).JSON(fiber.Map{"status": "fail", "type": "SQL: Querying Failed with Session"}) //Returning success
		}

		eventTable = append(eventTable, stream)
	}

	return c.Status(200).JSON(fiber.Map{"status": "success", "data": eventTable})
}

//-------------------------------Session----------------------------------

func GetSession(c *fiber.Ctx) error{
	//Call SQL
	if(CheckAuth(c) == true){ //Error Check
		return nil
	}

	result := DATABASE.QueryRow("SELECT * FROM Session Where session_number::text='" + c.Params("stream_number")  +"';")

	var session models.Session
	err := result.Scan(&session.Session_number, &session.Location, &session.Start_time, &session.Duration_minutes, &session.Title, &session.Description)

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
	session.Session_number = uuid.New().String()

	//Handling Errors
	if err != nil {
		c.Status(400).JSON(fiber.Map{"error": "failed to process inputs", "data": err})
		return nil
	 }

	//Add to Database
	row := DATABASE.QueryRow(
		`INSERT INTO Session(session_number, location, start_time, duration_minutes, title, description) VALUES ($1, $2, $3, $4, $5, $6);`,
		session.Session_number, session.Location, session.Start_time, session.Duration_minutes, session.Title, session.Description)

	//SQL Error Check
	if row.Err() != nil {
		return c.Status(500).JSON(fiber.Map{"status": "fail", "type": "SQL: Creating Session failed"}) //Returning success
	}

	//Success
	return c.Status(200).JSON(fiber.Map{"status": "success", "type": "Creating Session", "session_number": session.Session_number}) //Returning success
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
		err := result.Scan(&session.Session_number, &session.Location, &session.Start_time, &session.Duration_minutes, 
			&session.Title, &session.Description)
	
		if err != nil {
			return c.Status(500).JSON(fiber.Map{"status": "fail", "type": "SQL: Querying Failed"}) //Returning success
		}

		sessionsTables = append(sessionsTables, session)
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
	err := result.Scan(&accommodation.Room_number, &accommodation.Capacity, &accommodation.Country, &accommodation.Province, &accommodation.Street_address, &accommodation.Postal_code, &accommodation.Event_id)

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
	accommodation.Room_number = uuid.New().String()

	//Handling Errors
	if err != nil {
		c.Status(400).JSON(fiber.Map{"error": "failed to process inputs", "data": err})
		return nil
	 }

	//Add to Database
	row := DATABASE.QueryRow(
		`INSERT INTO Accomodation(Room_number, Capacity, Country, Province, Street_address, Postal_code, Event_id) VALUES ($1, $2, $3, $4, $5, $6, $7);`,
		accommodation.Room_number, accommodation.Capacity, accommodation.Country, accommodation.Province, accommodation.Street_address, accommodation.Postal_code, accommodation.Event_id)

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


//----IS_PARTICIPATING



func AddIsParticipating(c *fiber.Ctx) error{	
	//Load Model
	participating_In := new(models.Participating_In)
	err := c.BodyParser(participating_In)

	//Handling Errors
	if err != nil {
		c.Status(400).JSON(fiber.Map{"error": "failed to process inputs", "data": err})
		return nil
	 }

	//Add to Database
	row := DATABASE.QueryRow(
		`INSERT INTO Participating_In(Stream_number, Attendee_id) VALUES ($1, $2);`,
		participating_In.Stream_number, participating_In.Attendee_id)

	//SQL Error Check
	if row.Err() != nil {
		fmt.Println(row.Err())
		return c.Status(500).JSON(fiber.Map{"status": "fail", "type": "SQL: Creating Participating Relationship failed"}) //Returning success
	}

	//Success
	return c.Status(200).JSON(fiber.Map{"status": "success", "type": "Creating Participating Relationship"}) //Returning success
}

func DeleteStayingAt(c *fiber.Ctx) error{
	//Call SQL
	if(CheckAuth(c) == true){ //Error Check
		return nil
	}

	rows, err := DATABASE.Query(`DELETE FROM Staying_at Where Attendee_id ='` + c.Params("attendee_id")  +`';`)

	if err != nil {
		return c.Status(500).JSON(fiber.Map{"status": "fail", "type": "SQL: Querying Failed", "data": rows}) //Returning Fail
	}

	return c.Status(200).JSON(fiber.Map{"status": "success"})
}

func GetCountIsParticipating(c *fiber.Ctx) error{
	result := DATABASE.QueryRow(`SELECT COUNT(Stream_number) FROM PARTICIPATING_IN 
	WHERE Stream_number = $1 AND Attendee_id = $2;`,c.Params("stream_number"), c.Params("attendee_id"))

	var count = 0
	err := result.Scan(&count)

	if err != nil {
		return c.Status(500).JSON(fiber.Map{"status": "fail", "type": "SQL: Querying Failed"}) //Returning success
	}

	return c.Status(200).JSON(fiber.Map{"status": "success", "data": count})
}

func GetCountIsParticipatingFromEvent(c *fiber.Ctx) error{
	result := DATABASE.QueryRow(`SELECT COUNT(pi.Stream_number) FROM PARTICIPATING_IN pi
	WHERE pi.Attendee_id = $1 AND pi.Stream_number IN (
		SELECT s.Stream_number
		FROM STREAM s
		WHERE s.Event_id = $2
	);`,c.Params("attendee_id"), c.Params("event_id"));

	var count = 0
	err := result.Scan(&count)

	if err != nil {
		return c.Status(500).JSON(fiber.Map{"status": "fail", "type": "SQL: Querying Failed"}) //Returning success
	}

	return c.Status(200).JSON(fiber.Map{"status": "success", "data": count})
}
