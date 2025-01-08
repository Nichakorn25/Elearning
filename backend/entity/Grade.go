package entity

import (
	"gorm.io/gorm"
)

type Grade struct {
	gorm.Model
	Score  		uint `json:"score"`
	Feedback	string `json:"feedback"`
	Credit 		uint `json:"credit"`
	SubmissionID uint `json:"submission_id"`
}