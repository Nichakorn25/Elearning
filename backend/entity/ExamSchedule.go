package entity

import (
	"time"
	"gorm.io/gorm"
)


type ExamSchedule struct {
	gorm.Model
	ExamDate 	time.Time `json:"ExamDate" valid:"required~ExamDate is required"`
	StartTime 	time.Time `json:"StartTime" valid:"required~StartTime is required"`
	EndTime		time.Time `json:"EndTime" valid:"required~EndTime is required"`

	CourseID uint 		`json:"CourseID" valid:"required~CourseID is required"`
	Course   Course 	`gorm:"foreignKey:CourseID"`

}