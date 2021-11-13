package models

type Form struct {
	Id         int    `json:"Id"`
	Data       string `json:"Data"`
	Created_by string `json:"Created_by"`
}
