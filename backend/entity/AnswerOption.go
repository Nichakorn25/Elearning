package entity

import (
	"gorm.io/gorm"
)

type AnswerOption struct {
	gorm.Model
	OptionText string `json:"OptionText"`
	IsCorrect  bool   `json:"IsCorrect"`

	QuestionID   uint         `json:"QuestionID"`
	QuizQuestion QuizQuestion `gorm:"foreignKey:QuestionID"`
}
