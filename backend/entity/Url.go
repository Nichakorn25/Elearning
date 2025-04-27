package entity

import (
	"gorm.io/gorm"
)

type Url struct {
	gorm.Model
	Title  string `json:"Title" valid:"required~Title is required"`
	Url    string `json:"Url" valid:"required~Url is required,matches(^https?://)~Url must start with 'http://' or 'https://'"`
	Status string `json:"Status" valid:"required~Status is required"`

	LessonID uint   `json:"LessonID" valid:"required~LessonID is required"`
	Lesson   Lesson `gorm:"foreignKey:LessonID"`
}