package entity

import (
	"gorm.io/gorm"
)

type EnrollmentSuggestion struct {
	gorm.Model

	UserID uint `json:"UserID" valid:"required~UserID is required, matches(^\\d+$)"`
	User   User `gorm:"foreignKey:UserID"`

	SemesterID uint     `json:"SemesterID" valid:"required~Semester is required, matches(^\\d+$)"`
	Semester   Semester `gorm:"foreignKey:SemesterID"`

	CourseID uint
	Course   Course `gorm:"foreignKey:CourseID"`
}