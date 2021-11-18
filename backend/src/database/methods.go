package database

import (
	"fmt"

	"github.com/gofiber/fiber/v2"
	_ "github.com/lib/pq"
	"ucalgary.ca/cpsc441/eventmanagment/models"
)


func TestMethod(c *fiber.Ctx) error {
	fmt.Printf("WORKING WELL\n")
    return c.JSON(fiber.Map{"status": "success", "message": "Notes Found"})
}

func createPersons(){
	DATABASE.QueryRow("INSERT INTO Person(email, f_name, m_name, l_name, pronouns, dietary_restirction) VALUES('t.rjb1@gmail.com', 't', 'J', 'Brown', 'he/him', 'NA');")
}

func GetPersons(c *fiber.Ctx) error{
	// personModel := new(models.person)
	// err := c.BodyParser(personModel)
	// if err != nil {
	// 	c.Status(400).JSON(fiber.Map{"error": "failed to process inputs", "data": err})
	// 	return
	//  }

	rows, err := DATABASE.Query("SELECT * FROM person;")

	if err != nil {
		panic(err)
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
		//var Preferred_language string

		err = rows.Scan(&email, &F_name, &M_name, &L_name, &Pronouns, &Dietary_restriction, &Preferred_language)
		// if err != nil {
		// 	panic(err)
		// }

		personsTable = append(personsTable, models.Person{Email: email, F_name: F_name,
			M_name: M_name, L_name: L_name, Pronouns: Pronouns, Dietary_restriction: Dietary_restriction, Preferred_language: Preferred_language})
	}

	fmt.Printf("personsTable: %v\n", personsTable)
	return c.Status(200).JSON(fiber.Map{"status": "success", "data": personsTable})
}
