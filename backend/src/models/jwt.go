package models

type Jwt_tokens struct {
	Access  string  `json:"access"`
	Refresh string  `json:"refresh"`
}
