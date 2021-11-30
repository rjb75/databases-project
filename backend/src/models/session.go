package models

type Session struct {
	Session_number   int    `json:"Session_number"`
	Location         string `json:"Location"`
	Start_time       int64  `json:"Start_time"`
	Duration_minutes int64  `json:"Duration_minutes"`
}
