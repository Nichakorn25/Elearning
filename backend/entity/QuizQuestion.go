package entity

import (
	"gorm.io/gorm"
)
type QuizQuestion struct {
	gorm.Model
	QuestionText string `json:"question_text"`
	Point int `json:"point"`
	
	StudentAnswer []StudentAnswer `gorm:"foreignKey:QuestionID"`
	AnswerOption []AnswerOption `json:"answer_options" gorm:"foreignKey:QuestionID;constraint:OnDelete:CASCADE"`
	
	TestID uint `json:"test_id"`
	Test   Test `gorm:"foreignKey:TestID"`
}