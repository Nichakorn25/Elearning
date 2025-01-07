package entity

import (
	"time"
	"gorm.io/gorm"
)

type Assignment struct {
	gorm.Model
	Title  string `json:"Title"`
	Description	string`json:"Description"`
	DaedLine 	time.Time `json:"DaedLine"`

	Submission []Submission `gorm:"foreignKey:AssignmentID"`
	
	Attachment []Attachment `gorm:"foreignKey:AssignmentID"`

	CourseID uint                `json:"CourseID"`
	Course   Course `gorm:"foreignKey:CourseID"` // ใช้ Course จาก package CreateCourse
}