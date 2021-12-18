package models

type Ticket struct {
	Attendee_id    	string  `json:"Attendee_id"`
	Ticket_number 	int  `json:"Ticket_number"`
	Is_valid      	string  `json:"Is_valid"`
	Event_id      	string  `json:"Event_id"`
}
