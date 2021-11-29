package database

import (
	"golang.org/x/crypto/bcrypt"
)

func HashAndSaltPassword(password string) (string, error) {
    bytes, err := bcrypt.GenerateFromPassword([]byte(password), bcrypt.MinCost) // hashing salt rounds are set to 4, we can increase
																				// it up to 31 to make passwords more secure (but more time)
																				
    return string(bytes), err
}

func CheckInputPassword(input_password, stored_hash string) bool {
    err := bcrypt.CompareHashAndPassword([]byte(stored_hash), []byte(input_password))
    return err == nil
}