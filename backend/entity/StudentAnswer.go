package entity

import (
	"gorm.io/gorm"
)

type StudentAnswer struct {
	gorm.Model
	SelectedOption 	uint `json:"selected_option"`
	Correct int `json:"correct"`
 
	UserID uint `json:"user_id"`
	User   User `gorm:"foreignKey:UserID"`

	QuestionID uint `json:"question_id"`
	QuizQuestion   QuizQuestion `gorm:"foreignKey:QuestionID"`
}