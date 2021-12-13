package models

type School struct {
	Id             string `json:"Id"`
	Name           string `json:"Name"`
	Capacity		int   `json:"Capacity"`
	Country        string `json:"Country"`
	Province       string `json:"Province"`
	Street_address string `json:"Street_address"`
	Postal_code    string `json:"Postal_code"`
}
