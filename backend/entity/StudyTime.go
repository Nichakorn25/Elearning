package entity

import (
	"gorm.io/gorm"
	"time"
)

type StudyTime struct {
	gorm.Model
	StudyTimeStart time.Time `json:"StudyTimeStart" valid:"required~StudyTimeStart is required"`
	StudyTimeEnd   time.Time `json:"StudyTimeEnd" valid:"required~StudyTimeEnd is required"`

	CourseID uint   `json:"CourseID" valid:"required~CourseID is required"`
	Course   Course `gorm:"foreignKey:CourseID;constraint:onUpdate:CASCADE,onDelete:SET NULL;"`

	DayofWeekID uint      `json:"DayofWeekID" valid:"required~DayofWeekID is required"`
	DayofWeek   DayofWeek `gorm:"foreignKey:DayofWeekID"`

	ClassSchedule []ClassSchedule `gorm:"foreignKey:StudyTimeID"`
}