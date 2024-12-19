package entity

import (
	"gorm.io/gorm"
)

type QuizQuestion struct {
	gorm.Model
	QuestionText string `json:"QuestionText"`

	StudentAnswer []StudentAnswer `gorm:"foreignKey:QuestionID"`
	AnswerOption []AnswerOption `gorm:"foreignKey:QuestionID"`

	TestID uint `json:"TestID"`
	Test   Test `gorm:"foreignKey:TestID"`
}
