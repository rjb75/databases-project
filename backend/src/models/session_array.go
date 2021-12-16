package models

type SessionArray struct {
	Title     string    `json:"Title"`
	Stream_id string    `json:"Stream_id"`
	Sessions  []Session `json:"Sessions"`
}