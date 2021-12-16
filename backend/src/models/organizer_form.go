package models

type OrganizerForm struct {
	Id         string    `json:"Id"`
	Data       string 	 `json:"Data"`
	Created_by string 	 `json:"Created_by"`
	Event_id   string 	 `json:"Event_id"`
	Form_name  string 	 `json:"Form_name"`
	Responses  int 	 	 `json:"Responses"`
}
