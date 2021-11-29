package models

type Person struct {
	Email               string `json:"Email"`
	F_name              string `json:"F_name"`
	M_name              string `json:"M_name"`
	L_name              string `json:"L_name"`
	Pronouns            string `json:"Pronouns"`
	Preferred_language  string `json:"Preferred_language"`
	Dietary_restriction string `json:"Dietary_restriction"`
}
