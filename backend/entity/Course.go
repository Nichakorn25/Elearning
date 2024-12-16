package entity

import (
	"time"
	"gorm.io/gorm"
)
type Course struct {
	gorm.Model
	CourseName  string `json:"CourseName"`
	CourseDate	time.Time `json:"CourseDate"`
	Credit 		uint `json:"Credit"`
	Description string `json:"Description"`

	ExamSchedule []ExamSchedule `gorm:"foreignKey:CourseID"`

	Sheet []Sheet `gorm:"foreignKey:CourseID"`

	Lesson []Lesson `gorm:"foreignKey:CourseID"`

	Test []Test `gorm:"foreignKey:CourseID"`

	Assignment []Assignment `gorm:"foreignKey:CourseID"`

	CategoryID uint `json:"CategoryID"`
	Category   Category `gorm:"foreignKey:CategoryID"`

	UserID uint `json:"UserID"`
	User   User `gorm:"foreignKey:UserID"`

	SemesterID uint `json:"SemesterID"`
	Semester   Semester `gorm:"foreignKey:SemesterID"`

	DayofWeekID uint `json:"DayofWeekID"`
	DayofWeek   DayofWeek `gorm:"foreignKey:DayofWeekID"`
}