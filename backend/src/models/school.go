package models

type School struct {
	Id             int    `json:"Id"`
	Name           string `json:"Name"`
	Delegates      int    `json:"Delegates"`
	Country        string `json:"Country"`
	Province       string `json:"Province"`
	Street_address string `json:"Street_address"`
	Postal_code    string `json:"Postal_code"`
}
