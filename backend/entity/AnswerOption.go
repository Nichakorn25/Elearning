
package entity

import (
	"gorm.io/gorm"
)

type AnswerOption struct {
	gorm.Model
	OptionText string `json:"option_text"`
	IsCorrect  bool   `json:"is_correct"`

	QuestionID   uint         `json:"question_id"`
	QuizQuestion QuizQuestion `gorm:"foreignKey:QuestionID"`
}
