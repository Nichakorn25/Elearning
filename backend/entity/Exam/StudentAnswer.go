package Exam

import (
	"gorm.io/gorm"
)
type Course struct {
	gorm.Model
	SelectedOption 		uint `json:"SelectedOption"`

	UserID uint `json:"UserID"`
	User   User `gorm:"foreignKey:UserID"`

	QuestionID uint `json:"QuestionID"`
	QuizQuestion   QuizQuestion `gorm:"foreignKey:QuestionID"`
}