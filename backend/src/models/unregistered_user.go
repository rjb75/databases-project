package models

type Unregistered_User struct {
	Email      string `json:"Email"`
	Token      string `json:"Token"`
	Attendee_id string `json:"Attendee_id"`
}
