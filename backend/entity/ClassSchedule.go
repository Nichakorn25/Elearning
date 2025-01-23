package entity

import (
	"gorm.io/gorm"
)

type ClassSchedule struct {
	gorm.Model
	CourseID    uint      `json:"CourseID" gorm:"not null"`
	Course      Course    `gorm:"foreignKey:CourseID"`

	UserID      uint      `json:"UserID" gorm:"not null"`
	User        User      `gorm:"foreignKey:UserID"`
	
	DayofWeekID uint      `json:"DayofWeekID" gorm:"not null"`
	DayofWeek   DayofWeek `gorm:"foreignKey:DayofWeekID"`
}
