package models

type CompleteForm struct {
	Form_id         string  `json:"Form_id"`
	Attendee_id     string	`json:"Attendee_id"`
	Filled_data 	string 	`json:"Filled_data"`
}
