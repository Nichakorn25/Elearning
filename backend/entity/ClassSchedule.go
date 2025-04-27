package entity

import (
	"gorm.io/gorm"
)

type ClassSchedule struct {
	gorm.Model
	CourseID    uint      `json:"CourseID" valid:"required~CourseID is required"`
	Course      Course    `gorm:"foreignKey:CourseID"`

	UserID      uint      `json:"UserID" valid:"required~UserID is required"`
	User        User      `gorm:"foreignKey:UserID"`

	DayofWeekID uint      `json:"DayofWeekID" valid:"required~DayofWeekID is required"`
	DayofWeek   DayofWeek `gorm:"foreignKey:DayofWeekID"`

	StudyTimeID uint      `json:"StudyTimeID" valid:"required~StudyTimeID is required"`
	StudyTime   StudyTime `gorm:"foreignKey:StudyTimeID"`
}