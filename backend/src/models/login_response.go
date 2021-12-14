package models

type Login_response struct {
	Email               string `json:"Email"`
	F_name              string `json:"F_name"`
	M_name              string `json:"M_name"`
	L_name              string `json:"L_name"`
	Pronouns            string `json:"Pronouns"`
	Dietary_restriction string `json:"Dietary_restriction"`
	Preferred_language  string `json:"Preferred_language"`
	Role  				string `json:"Role"`
	Attendee_id			string `json:"Attendee_id"`
	Job_title 			string `json:"Job_title"`
}
