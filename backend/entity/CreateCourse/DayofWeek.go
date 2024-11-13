package CreateCourse

import (
	"gorm.io/gorm"
)
type DayofWeek struct {
	gorm.Model
	DayName  string `json:"DayName"`

	Course []Course `gorm:"foreignKey:DayofWeekID"`
}