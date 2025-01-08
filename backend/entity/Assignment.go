package entity

import (
	"time"
	"gorm.io/gorm"
)
type Assignment struct {
	gorm.Model
	Title  		string `json:"title" valid:"required~Title is required"`
	Description	string `json:"description" valid:"required~Description is required"`
	Daedline 	time.Time `json:"deadline" valid:"required~Daedline is required"`

	Submission []Submission `gorm:"foreignKey:AssignmentID"`

	CourseID uint  `json:"course_id"`
	Course   Course `gorm:"foreignKey:CourseID"`
}