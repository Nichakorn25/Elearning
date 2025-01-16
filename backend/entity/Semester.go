package entity

import (
	"time"
	"gorm.io/gorm"
)

type Semester struct {
	gorm.Model
	Year	uint `json:"Year"`
	Term	uint `json:"Term"`
	StartDate	time.Time `json:"StartDate"`
	EndDate		time.Time `json:"EndDate"`

	Course []Course `gorm:"foreignKey:SemesterID"`
	// ClassSchedule []ClassSchedule `gorm:"foreignKey:SemesterID"`
}