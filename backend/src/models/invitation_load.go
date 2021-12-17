package models

type InvitationLoad struct {
	Event_id    		string   	`json:"Event_id"`
	Stream_number       string   	`json:"Stream_number"`
	User_email        	string 		`json:"User_email"`
	Event_name      	string 		`json:"Event_name"`
	Stream_name 		string 		`json:"Stream_name"`
}
