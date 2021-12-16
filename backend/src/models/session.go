package models

type Session struct {
	Session_number   string `json:"Session_number"`
	Location         string `json:"Location"`
	Start_time       int64  `json:"Start_time"`
	Duration_minutes int64  `json:"Duration_minutes"`
	Title            string `json:"Title"`
	Description      string `json:"Description"`
}
