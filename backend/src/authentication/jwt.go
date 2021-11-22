package authentication

import (
	"github.com/dgrijalva/jwt-go"
	"time"
	"os"
)

var
(
	ACCESS_SIGNING_KEY = os.Getenv("ACCESS_SIGNING_KEY")
	REFRESH_SIGNING_KEY = os.Getenv("REFRESH_SIGNING_KEY")
)

const
(
	ACCESS_EXPIRY_MINUTES = 15
	REFRESH_EXPIRY_DAYS = 7
)


func CreateTokens(user_email string) (string, string , error) {
	accessTokenClaims := jwt.MapClaims{}
	accessTokenClaims["user_id"] = user_email
	accessTokenClaims["exp"] = time.Now().Add(time.Minute * ACCESS_EXPIRY_MINUTES).Unix()
	
	access := jwt.NewWithClaims(jwt.SigningMethodHS256, accessTokenClaims)
	
	accessToken, err := access.SignedString([]byte(ACCESS_SIGNING_KEY))
	
	if err != nil {
     return "", "", err
	}


	refreshTokenClaims := jwt.MapClaims{}
	refreshTokenClaims["user_id"] = user_email
	refreshTokenClaims["exp"] = time.Now().Add(time.Hour * 24 * REFRESH_EXPIRY_DAYS).Unix()
	
	refresh := jwt.NewWithClaims(jwt.SigningMethodHS256, refreshTokenClaims)
	
	refreshToken, err := refresh.SignedString([]byte(REFRESH_SIGNING_KEY))
	
	if err != nil {
     return "", "", err
	}

	return accessToken, refreshToken, nil
}