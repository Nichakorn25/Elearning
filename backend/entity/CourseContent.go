package entity

import (
	"gorm.io/gorm"
)
type CourseContent struct {
	gorm.Model
	Title  string `json:"Title"`
	Content  string `json:"Content"`
	Status  string `json:"Status" valid:"required~Status is required"`
	
	LessonID uint `json:"LessonID" valid:"required~LessonID is required"`
	Lesson   Lesson `gorm:"foreignKey:LessonID"`
}