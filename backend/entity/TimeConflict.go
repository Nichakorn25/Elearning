package entity

import (
	"gorm.io/gorm"
)
type TimeConflict struct {
	gorm.Model

	UserID          uint          `json:"UserID"`
	User            User          `gorm:"foreignKey:UserID"`

	// ClassScheduleID uint          `json:"ClassScheduleID"`
	// ClassSchedule   ClassSchedule `gorm:"foreignKey:ClassScheduleID"`

	ConflictTypeID  uint          `json:"ConflictTypeID"`
	ConflictType    ConflictType  `gorm:"foreignKey:ConflictTypeID"`

	Message         string        `json:"Message"`
}
