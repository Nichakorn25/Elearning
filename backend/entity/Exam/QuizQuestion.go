package Exam

import (
	"gorm.io/gorm"
)

type QuizQuestion struct {
	gorm.Model
	QuestionText string `json:"QuestionText"`

	TestID uint `json:"TestID"`
	Test   Test `gorm:"foreignKey:TestID"`
}
