package models

type HeadDelegateForm struct {
	Id                 string             `json:"Id"`
	Data               string             `json:"Data"`
	Created_by         string             `json:"Created_by"`
	Event_id           string             `json:"Event_id"`
	Form_name          string             `json:"Form_name"`
	Head_response      int                `json:"Head_response"`
	Delegate_responses []DelegateResponse `json:"Delegate_responses"`
}

type DelegateResponse struct {
	Name   string `json:"Name"`
	Response int `json:"Response"`
}
