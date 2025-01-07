package entity

import (
	"gorm.io/gorm"
)
type CourseVideo struct {
	gorm.Model
	VideoTitle  string `json:"VideoTitle"`
	VideoUrl  string `json:"VideoUrl"`
	
	LessonID uint `json:"LessonID"`
	Lesson   Lesson `gorm:"foreignKey:LessonID"`
	
}