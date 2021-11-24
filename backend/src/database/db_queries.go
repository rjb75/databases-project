package database

import (
	//"fmt"

	"github.com/gofiber/fiber/v2"
	_ "github.com/lib/pq"
	"ucalgary.ca/cpsc441/eventmanagment/models"
)

//Sample Posting Query
func PostPersons(c *fiber.Ctx) error{
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

func GetPersons(c *fiber.Ctx) error{
	
	//Call SQL
	rows, err := DATABASE.Query("SELECT * FROM person;")

	if err != nil {
		return c.Status(500).JSON(fiber.Map{"status": "fail", "type": "SQL: Querying Failed"}) //Returning success
	}

	var personsTable []models.Person
	for rows.Next() {
		var email string
		var F_name string
		var M_name string
		var L_name string
		var Pronouns string
		var Dietary_restriction string
		var Preferred_language string

		err = rows.Scan(&email, &F_name, &M_name, &L_name, &Pronouns, &Dietary_restriction, &Preferred_language)
		// if err != nil {
		// 	panic(err)
		// }

		personsTable = append(personsTable, models.Person{Email: email, F_name: F_name,
			M_name: M_name, L_name: L_name, Pronouns: Pronouns, Dietary_restriction: Dietary_restriction, Preferred_language: Preferred_language})
	}

	return c.Status(200).JSON(fiber.Map{"status": "success", "data": personsTable})
}
