package ManageCourse

import (
	"gorm.io/gorm"
)
type CourseContent struct {
	gorm.Model
	Title  string `json:"Title"`
	ContentType  string `json:"ContentType"`
	Url  string `json:"Url"`
	
	LessonID uint `json:"LessonID"`
	Lesson   Lesson `gorm:"foreignKey:LessonID"`
}