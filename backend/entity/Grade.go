package entity

import (
	"gorm.io/gorm"
)

type Grade struct {
	gorm.Model
	Status     string  `json:"status"`
	Score  		uint `json:"score"`
	Feedback	string `json:"feedback"`
	SubmissionID uint `json:"submission_id"`
}