package ManageCourse

import (
	"gorm.io/gorm"
)
type Lesson struct {
	gorm.Model
	Title  string `json:"Title"`
	Sequence 		uint `json:"Sequence"`
	
    CourseID uint 		`json:"CourseID"`
	Course   Course 	`gorm:"foreignKey:CourseID"`
}