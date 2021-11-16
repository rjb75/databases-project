package authentication

import (
	"github.com/gofiber/fiber"
	"ucalgary.ca/cpsc441/eventmanagment/database"
	"ucalgary.ca/cpsc441/eventmanagment/models"
)


func Login(c *fiber.Ctx) {
	loginLoad := new(models.Login_load)
	err := c.BodyParser(loginLoad)
	if err != nil {
		c.Status(400).JSON(fiber.Map{"error": "failed to process inputs", "data": err})
		return
	 }

	 userHashedPassword, err := database.GetPassowrd(loginLoad.Email)

	 if userHashedPassword == "" {
		c.Status(404).JSON(fiber.Map{"error": "user not found", "data": err})
		return
	 }

	 isPassowrdValid := CheckInputPassword(loginLoad.Password, userHashedPassword)
	 if !isPassowrdValid {
		c.Status(401).JSON(fiber.Map{"error": "wrong password"})
		return
	 }

	 accessToken, refreshToken, err := CreateTokens(loginLoad.Email)

	 if err != nil {
		c.Status(500).JSON(fiber.Map{"error": "sever error", "data": err})
		return
	 }


	 c.Status(200).JSON(fiber.Map{"status": "success", "access": accessToken, "refresh": refreshToken})
}


func Register(c *fiber.Ctx) {
	signupLoad := new(models.Signup_load)
	err := c.BodyParser(signupLoad)
	if err != nil {
		c.Status(400).JSON(fiber.Map{"error": "failed to process inputs", "data": err})
		return
	 }

	 hashedPassword, err := HashAndSaltPassword(signupLoad.Password)

	 if err != nil {
		c.Status(500).JSON(fiber.Map{"error": "sever error", "data": err})
		return
	 }

	insertErr := database.RegisterUser(signupLoad.Email, hashedPassword, signupLoad.F_name, signupLoad.M_name,
		signupLoad.L_name, signupLoad.Pronouns, signupLoad.Dietary_restriction, signupLoad.Preferred_language, signupLoad.Role)

	if insertErr != nil {
		c.Status(500).JSON(fiber.Map{"error": "sever error", "data": insertErr})
		return
	}
	
	c.Status(200).JSON(fiber.Map{"status": "success", "data": c.Body()})
	
		

}