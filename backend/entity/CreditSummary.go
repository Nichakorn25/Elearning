package entity

import (
	"gorm.io/gorm"
)
type CreditSummary struct {
	gorm.Model
	TotalCredit     int            `json:"TotalCredit"`
	MaximumCredit   int            `json:"MaximumCredit"`
	ClassScheduleID uint           `json:"ClassScheduleID"`
	ClassSchedule   ClassSchedule  `gorm:"foreignKey:ClassScheduleID"`

	TimeConflict   []TimeConflict `gorm:"foreignKey:CreditSummaryID"`
}
