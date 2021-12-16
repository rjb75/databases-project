package models

type FormSubmission struct {
	Data                string `json:"Data"`
	Answer_data                string `json:"Answer_data"`
	Name                string `json:"Name"`
	Dietary_restriction string `json:"Dietary_restriction"`
	Preferred_language  string `json:"Preferred_language"`
	School_name         string `json:"School_name"`
	Stream              string `json:"Stream"`
	Registration_status string `json:"Registration_status"`
}
