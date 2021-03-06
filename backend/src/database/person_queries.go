package database

import (
	"github.com/gofiber/fiber/v2"
	_ "github.com/lib/pq"
	"ucalgary.ca/cpsc441/eventmanagment/models"
)

//Sample Posting Query
func CreatePerson(c *fiber.Ctx) error{
	if(CheckAuth(c) == true){ //Error Check
		return nil
	}
	
	//Load Model
	person := new(models.Person)
	err := c.BodyParser(person)

	//Handling Errors
	if err != nil {
		c.Status(400).JSON(fiber.Map{"error": "failed to process inputs", "data": err})
		return nil
	 }

	//Add to Database
	row := DATABASE.QueryRow(
		`INSERT INTO PERSON(Email, F_name, M_name, L_name, Pronouns, Dietary_restriction, Preferred_Language) VALUES ($1, $2, $3, $4, $5, $6, $7);`,
		person.Email, person.F_name, person.M_name, person.L_name, person.Pronouns, person.Dietary_restriction, person.Preferred_language)

	//SQL Error Check
	if row.Err() != nil {
		return c.Status(500).JSON(fiber.Map{"status": "fail", "type": "SQL: Creating Person failed"}) //Returning success
	}

	//Success
	return c.Status(200).JSON(fiber.Map{"status": "success", "type": "Creating Person"}) //Returning success
}


func GetUserFromToken(c *fiber.Ctx) error {
	result:= DATABASE.QueryRow(`SELECT p.Email, COALESCE(p.F_name, ''), COALESCE(p.M_name, ''), 
	COALESCE(p.L_name, ''),  COALESCE(p.Pronouns, ''), 
	COALESCE(p.Preferred_language, ''), COALESCE(p.Dietary_restriction, ''), u.Attendee_id
	FROM person p, UNREGISTERED_USER u
	WHERE u.Token = $1 AND u.Email = p.Email;`,  c.Params("token"))

	if result.Err() != nil {
		return c.Status(500).JSON(fiber.Map{"status": "fail", "type": "SQL: Querying Failed"}) //Returning success
	}

	var person models.UnregisteredTokenUser
	err := result.Scan(&person.Email, &person.F_name, &person.M_name, &person.L_name, &person.Pronouns, &person.Preferred_language,
		  &person.Dietary_restriction, &person.Attendee_id)

	if err != nil {
		return c.Status(500).JSON(fiber.Map{"status": "fail", "type": "SQL: Querying Failed"}) //Returning success
	}

	return c.Status(200).JSON(fiber.Map{"status": "success", "data": person})
}


func UpdatePerson(c *fiber.Ctx) error{	
	//Load Model
	person := new(models.Person)
	err := c.BodyParser(person)

	//Handling Errors
	if err != nil {
		c.Status(400).JSON(fiber.Map{"error": "failed to process inputs", "data": err})
		return nil
	 }


	//Add to Database
	row := DATABASE.QueryRow(`UPDATE PERSON
	SET F_name = $1,
		M_name = $2,
		L_name = $3,
		Pronouns = $4,
		Preferred_language = $5,
		Dietary_restriction = $6 WHERE Email = $7;`, person.F_name, person.M_name, person.L_name, person.Pronouns,
		person.Preferred_language, person.Dietary_restriction, person.Email)

	//SQL Error Check
	if row.Err() != nil {
		return c.Status(500).JSON(fiber.Map{"status": "fail", "type": "SQL: Creating Person failed"}) //Returning success
	}

	//Success
	return c.Status(200).JSON(fiber.Map{"status": "success", "type": "Updating Person"}) //Returning success
}

func GetPersons(c *fiber.Ctx) error{
	//Call SQL
	if(CheckAuth(c) == true){ //Error Check
		return nil
	}
	rows, err := DATABASE.Query("SELECT * FROM person;")

	if err != nil {
		rows.Close()
		return c.Status(500).JSON(fiber.Map{"status": "fail", "type": "SQL: Querying Failed"}) //Returning success
	}

	var personsTable []models.Person
	for rows.Next() {
		var person models.Person

		err = rows.Scan(&person.Email, &person.F_name, &person.M_name, &person.L_name, &person.Pronouns, &person.Preferred_language,  &person.Dietary_restriction)
		if err != nil {
		//	return c.Status(500).JSON(fiber.Map{"status": "fail", "type": "SQL: Querying Failed"}) //Returning success
		}
		
		personsTable = append(personsTable, models.Person{Email: person.Email, F_name: person.F_name,
			M_name: person.M_name, L_name: person.L_name, Pronouns: person.Pronouns, Preferred_language: person.Preferred_language, Dietary_restriction: person.Dietary_restriction})
	}
	rows.Close()

	return c.Status(200).JSON(fiber.Map{"status": "success", "data": personsTable})
}


func GetPerson(c *fiber.Ctx) error{
	//Call SQL
	if(CheckAuth(c) == true){ //Error Check
		return nil
	}

	result := DATABASE.QueryRow("SELECT * FROM Person Where email ='" + c.Params("email")  +"';")

	var person models.Person
	err := result.Scan(&person.Email, &person.F_name, &person.M_name, &person.L_name, &person.Pronouns, &person.Preferred_language,  &person.Dietary_restriction)

	if err != nil {
		return c.Status(500).JSON(fiber.Map{"status": "fail", "type": "SQL: Querying Failed"}) //Returning success
	}

	return c.Status(200).JSON(fiber.Map{"status": "success", "data": person})
}

func DeletePerson(c *fiber.Ctx) error{
	//Call SQL
	if(CheckAuth(c) == true){ //Error Check
		return nil
	}

	rows, err := DATABASE.Query("DELETE FROM Person Where email ='" + c.Params("email")  +"';")

	if err != nil {
		return c.Status(500).JSON(fiber.Map{"status": "fail", "type": "SQL: Querying Failed", "data": rows}) //Returning success
	}

	return c.Status(200).JSON(fiber.Map{"status": "success"})
}

