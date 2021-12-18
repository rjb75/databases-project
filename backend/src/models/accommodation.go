package models

type Accommodation struct {
	Room_number    string `json:"Room_number"`
	Capacity       int    `json:"Capacity"`
	Country        string `json:"Country"`
	Province       string `json:"Province"`
	Street_address string `json:"Street_address"`
	Postal_code    string `json:"Postal_code"`
	Event_id       string `json:"Event_id"`
	Room_code      string `json:"Room_code"`
}
