package entity

import (
	"time"
	"gorm.io/gorm"
)


type ExamSchedule struct {
	gorm.Model
	ExamDate 	time.Time `json:"ExamDate"`
	StartTime 	time.Time `json:"StartTime"`
	EndTime		time.Time `json:"EndTime"`

	CourseID uint 		`json:"CourseID"`
	Course   Course 	`gorm:"foreignKey:CourseID"`

}