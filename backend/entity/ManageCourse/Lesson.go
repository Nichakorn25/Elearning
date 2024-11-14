package ManageCourse

import (
	"backend/entity/CreateCourse" 
	"gorm.io/gorm"
)
type Lesson struct {
	gorm.Model
	Title  string `json:"Title"`
	Sequence 		uint `json:"Sequence"`

	CourseContent []CourseContent `gorm:"foreignKey:LessonID"`

	Material []Material `gorm:"foreignKey:LessonID"`

	CourseVideo []CourseVideo `gorm:"foreignKey:LessonID"`
	
    CourseID uint 		`json:"CourseID"`
	Course   Course 	`gorm:"foreignKey:CourseID"`
}