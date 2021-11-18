package authentication

import (
	"time"
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

	 accessToken, err := CreateAccessToken(loginLoad.Email)

	 if err != nil {
		c.Status(500).JSON(fiber.Map{"error": "sever error", "data": err})
		return
	 }

	 refreshToken, err := CreateRefreshToken(loginLoad.Email)

	 if err != nil {
		c.Status(500).JSON(fiber.Map{"error": "sever error", "data": err})
		return
	 }


	 c.Status(200).JSON(fiber.Map{"status": "success", "access": accessToken, "refresh": refreshToken})

	 c.Cookie(&fiber.Cookie{
        Name:     "access",
        Value:    accessToken,
        Expires:  time.Now().Add(time.Minute * ACCESS_EXPIRY_MINUTES),
        HTTPOnly: true,
        SameSite: "lax",
    })


	c.Cookie(&fiber.Cookie{
        Name:     "refresh",
        Value:    refreshToken,
        Expires:  time.Now().Add(time.Hour * 24 * REFRESH_EXPIRY_DAYS),
        HTTPOnly: true,
        SameSite: "lax",
    })
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


func Refresh(c *fiber.Ctx) {
	userRefreshToken :=c.Cookies("refresh")
	userId, expiry, err := ParseToken(userRefreshToken, false)

	if err != nil || userId == "" {
		c.Status(500).JSON(fiber.Map{"error": "sever error", "data": err})
		return
	}

	if expiry.Sub(time.Now()) > 0 {
		accessToken, err := CreateAccessToken(userId)
		if err != nil {
			c.Status(500).JSON(fiber.Map{"error": "sever error", "data": err})
			return
		}
		c.Cookie(&fiber.Cookie{
			Name:     "access",
			Value:    accessToken,
			Expires:  time.Now().Add(time.Minute * ACCESS_EXPIRY_MINUTES),
			HTTPOnly: true,
			SameSite: "lax",
		})
	}
}

