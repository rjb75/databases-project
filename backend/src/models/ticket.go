package models

type Ticket struct {
	Atendee_id    int  `json:"Atendee_id"`
	Ticket_number int  `json:"Ticket_number"`
	Is_valid      bool `json:"Is_valid"`
	Event_id      int  `json:"Event_id"`
}
