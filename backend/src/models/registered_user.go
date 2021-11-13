package models

type Registered_User struct {
	Email string `json:"Email"`
	// Hashed_password string `json:"Hashed_password"`
	Role       string `json:"Role"`
	Atendee_id string `json:"Atendee_id"`
}
