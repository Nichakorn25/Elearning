package entity

import (
	"gorm.io/gorm"
	"time"
)

type Test struct {
	gorm.Model
	Title       string    `json:"Title"`
	Description string    `json:"Description"`
	DueDate     time.Time `json:"DueDate"`

	QuizQuestion []QuizQuestion `gorm:"foreignKey:TestID"`

	CourseID uint                `json:"CourseID"`
	Course   Course `gorm:"foreignKey:CourseID"` // ใช้ Course จาก package CreateCourse
}
