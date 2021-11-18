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

func CreateAccessToken(user_email string) (string, error) {
	accessTokenClaims := jwt.MapClaims{}
	accessTokenClaims["user_id"] = user_email
	accessTokenClaims["exp"] = time.Now().Add(time.Minute * ACCESS_EXPIRY_MINUTES).Unix()
	
	access := jwt.NewWithClaims(jwt.SigningMethodHS256, accessTokenClaims)
	
	accessToken, err := access.SignedString([]byte(ACCESS_SIGNING_KEY))
	
	if err != nil {
     return "", err
	}

	return accessToken, nil
}


func CreateRefreshToken(user_email string) (string, error) {
	refreshTokenClaims := jwt.MapClaims{}
	refreshTokenClaims["user_id"] = user_email
	refreshTokenClaims["exp"] = time.Now().Add(time.Hour * 24 * REFRESH_EXPIRY_DAYS).Unix()
	
	refresh := jwt.NewWithClaims(jwt.SigningMethodHS256, refreshTokenClaims)
	
	refreshToken, err := refresh.SignedString([]byte(REFRESH_SIGNING_KEY))
	
	if err != nil {
     return "", err
	}

	return refreshToken, nil
}


func ParseToken(inputToken string, tokenType bool) (string, time.Time, error){ // access is TRUE and refresh is FALSE
	var signingKey = ""
	if tokenType {
		signingKey = ACCESS_SIGNING_KEY
	} else {
		signingKey = REFRESH_SIGNING_KEY
	}
	outputClaims := jwt.MapClaims{}
	_, err := jwt.ParseWithClaims(inputToken, outputClaims , func(token *jwt.Token) (interface{}, error) {
		return []byte(signingKey), nil
	})

	if err != nil {
		return "", time.Now(), err
	}

	userId, ok := outputClaims["user_id"].(string)
     if !ok {
        return "", time.Now(), nil
     }

	 expiry, ok := outputClaims["exp"].(float64)
     if !ok {
        return "", time.Now(), nil
     }

	return userId, time.Unix(int64(expiry), 0), nil
}