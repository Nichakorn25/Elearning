package entity

import (
	"gorm.io/gorm"
	"time"
)


type Test struct {
	gorm.Model
	Title       string    `json:"title" valid:"required~Title is required"`
	Description string    `json:"description" valid:"required~Description is required"`
	DueDate     time.Time `json:"due_date" valid:"required~DueDate is required"`
	Timeout     time.Time `json:"time_out"`

	QuizQuestion []QuizQuestion `json:"quiz_questions" gorm:"foreignKey:TestID;constraint:OnDelete:CASCADE"`

	CourseID uint   `json:"course_id"`
	Course   Course `gorm:"foreignKey:CourseID"` // ใช้ Course จาก package CreateCourse
}