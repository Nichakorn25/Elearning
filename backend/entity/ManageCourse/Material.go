package ManageCourse

import (
	"gorm.io/gorm"
)
type Material struct {
	gorm.Model
	MaterialType  string `json:"MaterialType"`
	FilePath	  string`json:"FilePath"`
	
	LessonID uint `json:"LessonID"`
	Lesson   Lesson `gorm:"foreignKey:LessonID"`
}