package database

import (
	"time"

	"github.com/gofiber/fiber/v2"
	"ucalgary.ca/cpsc441/eventmanagment/models"
)

func Login(c *fiber.Ctx) error {
	loginLoad := new(models.Login_load)
	err := c.BodyParser(loginLoad)
	if err != nil {
		return c.Status(400).JSON(fiber.Map{"error": "failed to process inputs", "data": err})
	}

	userHashedPassword, err := GetPassowrd(loginLoad.Email)

	if userHashedPassword == "" {
		return c.Status(404).JSON(fiber.Map{"error": "user not found", "data": err})
	}

	isPassowrdValid := CheckInputPassword(loginLoad.Password, userHashedPassword)
	if !isPassowrdValid {
		return c.Status(401).JSON(fiber.Map{"error": "wrong password"})
	}

	accessToken, err := CreateAccessToken(loginLoad.Email)

	if err != nil {
		return c.Status(500).JSON(fiber.Map{"error": "server error", "data": err})
	}

	refreshToken, err := CreateRefreshToken(loginLoad.Email)

	if err != nil {
		return c.Status(500).JSON(fiber.Map{"error": "server error", "data": err})
	}

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

	return c.Status(200).JSON(fiber.Map{"status": "success", "access": accessToken, "refresh": refreshToken})
}

func RegisterDelegate(c *fiber.Ctx) error {
	signupLoad := new(models.Delegate_signup_load)
	err := c.BodyParser(signupLoad)
	if err != nil {
		return c.Status(400).JSON(fiber.Map{"error": "failed to process inputs", "data": err})
	}

	hashedPassword, err := HashAndSaltPassword(signupLoad.Password)

	if err != nil {
		return c.Status(500).JSON(fiber.Map{"error": "server error", "data": err})
	}

	insertErr := RegisterUser(signupLoad.Email, hashedPassword, signupLoad.F_name, signupLoad.M_name,
		signupLoad.L_name, signupLoad.Pronouns, signupLoad.Dietary_restriction, signupLoad.Preferred_language, signupLoad.Role)

	if insertErr != nil {
		return c.Status(500).JSON(fiber.Map{"error": "server error", "data": insertErr})
	}

	return c.Status(200).JSON(fiber.Map{"status": "success", "data": c.Body()})
}

func Refresh(c *fiber.Ctx) error {
	userRefreshToken := c.Cookies("refresh")
	userId, expiry, err := ParseToken(userRefreshToken, false)

	if err != nil || userId == "" {
		return c.Status(500).JSON(fiber.Map{"error": "server error", "data": err})
	}

	if expiry.Sub(time.Now()) > 0 {
		accessToken, err := CreateAccessToken(userId)
		if err != nil {
			return c.Status(500).JSON(fiber.Map{"error": "server error", "data": err})
		}
		c.Cookie(&fiber.Cookie{
			Name:     "access",
			Value:    accessToken,
			Expires:  time.Now().Add(time.Minute * ACCESS_EXPIRY_MINUTES),
			HTTPOnly: true,
			SameSite: "lax",
		})
	}

	return nil
}


func SignOut(c *fiber.Ctx) error {
	c.Cookie(&fiber.Cookie{
        Name:     "access",
        Expires:  time.Now().Add(-(time.Hour * 2)),
        HTTPOnly: true,
        SameSite: "lax",
    })
	c.Cookie(&fiber.Cookie{
        Name:     "refresh",
        Expires:  time.Now().Add(-(time.Hour * 2)),
        HTTPOnly: true,
        SameSite: "lax",
    })
	return c.Status(200).JSON(fiber.Map{"status": "success"})
}

func TestAuth(c *fiber.Ctx) error {
	userAccessToken := c.Cookies("access")
	tokerErr := CheckAccess(userAccessToken)
	if tokerErr != nil {
		return c.Status(401).JSON(fiber.Map{"data": "Unauthorized"})
	}
	return GetPersons(c);
}

func CheckAuth(c *fiber.Ctx) bool {
	userAccessToken := c.Cookies("access")
	err := CheckAccess(userAccessToken)
	c.Status(401).JSON(fiber.Map{"data": "Unauthorized"})
	return err == nil
}
