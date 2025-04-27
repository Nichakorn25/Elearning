package entity

import (
	"gorm.io/gorm"
)

type Lesson struct {
	gorm.Model
	Title    string `json:"Title" valid:"required~Title is required"`
	Sequence uint   `json:"Sequence"`

	CourseContent []CourseContent `gorm:"foreignKey:LessonID"`

	Material []Material `gorm:"foreignKey:LessonID"`

	CourseVideo []Url `gorm:"foreignKey:LessonID"`

	CourseID uint   `json:"CourseID" valid:"required~CourseID is required"`
	Course   Course `gorm:"foreignKey:CourseID"`
}