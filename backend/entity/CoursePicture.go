package entity

import (
	"gorm.io/gorm"
)

type CoursePicture struct {
	gorm.Model
	Picture string `json:"Picture" `

	CourseID uint   `json:"CourseID" valid:"required~CourseID is required"`
	Course   Course `gorm:"foreignKey:CourseID"`
}