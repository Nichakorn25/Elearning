package entity

import (
	"gorm.io/gorm"
)


type Grade struct {
	gorm.Model
	Score  uint `json:"Score"`
	Feedback	string `json:"Feedback"`
	Credit 		uint `json:"Credit"`

	SubmissionID uint `json:"SubmissionID"`
	Submission   Submission `gorm:"foreignKey:SubmissionID"`

}