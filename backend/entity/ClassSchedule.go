package entity

import (
	"gorm.io/gorm"
)

type ClassSchedule struct {
	gorm.Model

	CourseID      uint       `json:"CourseID"`
	Course        Course     `gorm:"foreignKey:CourseID"`

	UserID        uint       `json:"UserID"`
	User          User       `gorm:"foreignKey:UserID"`

	CreditSummary []CreditSummary `gorm:"foreignKey:ClassScheduleID"`

	// SemesterID    uint       `json:"SemesterID"`
	// Semester      Semester   `gorm:"foreignKey:SemesterID"`

	// DayofWeekID   uint       `json:"DayofWeekID"`
	// DayofWeek     DayofWeek  `gorm:"foreignKey:DayofWeekID"`

	
	// SuggestionID  uint       `json:"SuggestionID"`
	// Suggestion    EnrollmentSuggestion `gorm:"foreignKey:SuggestionID"`



	// TimeConflict []TimeConflict `gorm:"foreignKey:ClassScheduleID"`
	

	
}
