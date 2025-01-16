package entity

import (
	"gorm.io/gorm"
)
type CreditSummary struct {
	gorm.Model
	TotalCredit     int            `json:"TotalCredit"`
	
	ClassScheduleID uint           `json:"ClassScheduleID"`
	ClassSchedule   ClassSchedule  `gorm:"foreignKey:ClassScheduleID"`

	
	MaximumCredit   int            `json:"MaximumCredit"`
	TimeConflict   []TimeConflict `gorm:"foreignKey:CreditSummaryID"`
}
