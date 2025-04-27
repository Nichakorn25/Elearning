package entity

import (
	"time"

	"gorm.io/gorm"
)

type Semester struct {
	gorm.Model
	Year      uint      `json:"Year"  valid:"required~Year is required, matches(^[2]\\d{3}$)"`
	Term      uint      `json:"Term"  valid:"required~Term is required, matches(^[1-3]$)"`
	StartDate time.Time `json:"StartDate" valid:"required~StartDate is required"`
	EndDate   time.Time `json:"EndDate" valid:"required~EndDate is required"`

	Course []Course `gorm:"foreignKey:SemesterID"`
}