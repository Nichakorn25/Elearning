package entity

import (
	"gorm.io/gorm"
)

type Material struct {
	gorm.Model
	MaterialName string `json:"MaterialName" valid:"required~MaterialName is required"`
	FilePath     string `json:"FilePath" valid:"required~FilePath is required"`
	Status       string `json:"Status" valid:"required~Status is required"`

	LessonID uint   `json:"LessonID" valid:"required~LessonID is required"`
	Lesson   Lesson `gorm:"foreignKey:LessonID"`
}