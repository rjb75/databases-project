package models

type User_signup_load struct {
	Email               string `json:"Email"`
	Password			string `json:"Password"`
	F_name              string `json:"F_name"`
	M_name              string `json:"M_name"`
	L_name              string `json:"L_name"`
	Pronouns            string `json:"Pronouns"`
	Dietary_restriction string `json:"Dietary_restriction"`
	Preferred_language  string `json:"Preferred_language"`
	Role  				string `json:"Role"`
	School_id			string `json:"School_id"`
	Job_title			string `json:"Job_title"`
}
