package database

import (
	//	"fmt"

	"github.com/gofiber/fiber/v2"
	_ "github.com/lib/pq"
	"ucalgary.ca/cpsc441/eventmanagment/models"
)

func GetRegUser(c *fiber.Ctx) error{
	if(CheckAuth(c) == true){ //Error Check
		return nil
	}
	//Call SQL
	result := DATABASE.QueryRow(
		`SELECT * 
	FROM REGISTERED_USER Where Email = $1;`, c.Params("email") )

	var user models.Registered_User

	err := result.Scan(&user.Email, &user.Hashed_password, &user.Role, &user.Attendee_id)

	if err != nil {
		return c.Status(500).JSON(fiber.Map{"status": "fail", "type": "SQL: Querying Failed"}) //Returning success
	}
	
	return c.Status(200).JSON(fiber.Map{"status": "success", "data": user})
}

func CreateRegUser(c *fiber.Ctx) error{
	if(CheckAuth(c) == true){ //Error Check
		return nil
	}

	user := new(models.Registered_User)
	err := c.BodyParser(user)

	//Handling Errors
	if err != nil {
		c.Status(400).JSON(fiber.Map{"error": "failed to process inputs", "data": err})
		return nil
		}

	//Call SQL
	result := DATABASE.QueryRow(
		`INSERT INTO REGISTERED_USER(Email, Hashed_password, Role, Attendee_id) VALUES ($1, $2, $3, $4);`,
		user.Email, user.Hashed_password, user.Role, user.Attendee_id)

	if result.Err() != nil {
		return c.Status(500).JSON(fiber.Map{"status": "fail", "type": "SQL: Querying Failed"}) //Returning success
	}
	
	return c.Status(200).JSON(fiber.Map{"status": "success", "type": "Creating Registered User"}) //Returning success
}


func GetUnRegUser(c *fiber.Ctx) error{
	if(CheckAuth(c) == true){ //Error Check
		return nil
	}
	//Call SQL
	result := DATABASE.QueryRow(
		`SELECT * 
	FROM UNREGISTERED_USER
	WHERE Email = $1;`, c.Params("email"))

	var user models.Unregistered_User

	err:=result.Scan(&user.Email, &user.Token, &user.Attendee_id)
	if err != nil {
			return c.Status(500).JSON(fiber.Map{"status": "fail", "type": "SQL: Querying Failed"}) //Returning success
	}

	return c.Status(200).JSON(fiber.Map{"status": "success", "data": user})
}

func CreateUnRegUser(c *fiber.Ctx) error{
	if(CheckAuth(c) == true){ //Error Check
		return nil
	}

	user := new(models.Unregistered_User)
	err := c.BodyParser(user)

	//Handling Errors
	if err != nil {
		c.Status(400).JSON(fiber.Map{"error": "failed to process inputs", "data": err})
		return nil
		}

	//Call SQL
	result := DATABASE.QueryRow(
		`INSERT INTO REGISTERED_USER(Email, Token, Attendee_id) VALUES ($1, $2, $3);`,
		user.Email, user.Token, user.Attendee_id)

	if result.Err() != nil {
		return c.Status(500).JSON(fiber.Map{"status": "fail", "type": "SQL: Querying Failed"}) //Returning success
	}
	
	return c.Status(200).JSON(fiber.Map{"status": "success", "type": "Creating Registered User"}) //Returning success
}