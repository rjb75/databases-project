package models

type Session struct {
	Session_number int    `json:"Session_number"`
	Location       string `json:"Location"`
	Start_time     int64  `json:"Start_time"`
	Duration       int64  `json:"Duration"`
}
