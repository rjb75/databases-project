package authentication

import (
	"github.com/gofiber/fiber/v2"
	"ucalgary.ca/cpsc441/eventmanagment/database"
	"ucalgary.ca/cpsc441/eventmanagment/models"
)


func Login(c *fiber.Ctx) error {
	loginLoad := new(models.Login_load)
	err := c.BodyParser(loginLoad)
	if err != nil {
		return c.Status(400).JSON(fiber.Map{"error": "failed to process inputs", "data": err})
		
	 }

	 userHashedPassword, err := database.GetPassowrd(loginLoad.Email)

	 if userHashedPassword == "" {
		return c.Status(404).JSON(fiber.Map{"error": "user not found", "data": err})
	 }

	 isPassowrdValid := CheckInputPassword(loginLoad.Password, userHashedPassword)
	 if !isPassowrdValid {
		return c.Status(401).JSON(fiber.Map{"error": "wrong password"})
	 }

	 accessToken, refreshToken, err := CreateTokens(loginLoad.Email)

	 if err != nil {
		return c.Status(500).JSON(fiber.Map{"error": "sever error", "data": err})
	 }


	 return c.Status(200).JSON(fiber.Map{"status": "success", "access": accessToken, "refresh": refreshToken})
}


func Register(c *fiber.Ctx) error {
	signupLoad := new(models.Signup_load)
	err := c.BodyParser(signupLoad)
	if err != nil {
		return c.Status(400).JSON(fiber.Map{"error": "failed to process inputs", "data": err})
	 }

	 hashedPassword, err := HashAndSaltPassword(signupLoad.Password)

	 if err != nil {
		return c.Status(500).JSON(fiber.Map{"error": "sever error", "data": err})
	 }

	insertErr := database.RegisterUser(signupLoad.Email, hashedPassword, signupLoad.F_name, signupLoad.M_name,
		signupLoad.L_name, signupLoad.Pronouns, signupLoad.Dietary_restriction, signupLoad.Preferred_language, signupLoad.Role)

	if insertErr != nil {
		return c.Status(500).JSON(fiber.Map{"error": "sever error", "data": insertErr})
	}
	
	return c.Status(200).JSON(fiber.Map{"status": "success", "data": c.Body()})
}