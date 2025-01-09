package entity

import (
	"gorm.io/gorm"
)

type ClassSchedule struct {
	gorm.Model
	SemesterID    uint       `json:"SemesterID"`
	Semester      Semester   `gorm:"foreignKey:SemesterID"`

	DayofWeekID   uint       `json:"DayofWeekID"`
	DayofWeek     DayofWeek  `gorm:"foreignKey:DayofWeekID"`

	CourseID      uint       `json:"CourseID"`
	Course        Course     `gorm:"foreignKey:CourseID"`

	SuggestionID  uint       `json:"SuggestionID"`
	Suggestion    EnrollmentSuggestion `gorm:"foreignKey:SuggestionID"`

	UserID        uint       `json:"UserID"`
	User          User       `gorm:"foreignKey:UserID"`

	TimeConflict []TimeConflict `gorm:"foreignKey:ClassScheduleID"`
	CreditSummary []CreditSummary `gorm:"foreignKey:ClassScheduleID"`

	// Additional fields if needed
}
