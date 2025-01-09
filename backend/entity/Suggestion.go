package entity

import (
	"gorm.io/gorm"
)

type EnrollmentSuggestion struct {
	gorm.Model
	SuggestedCourse string         `json:"SuggestedCourse"`

	UserID          uint           `json:"UserID"`
	User            User           `gorm:"foreignKey:UserID"`

	SemesterID      uint           `json:"SemesterID"`
	Semester        Semester       `gorm:"foreignKey:SemesterID"`

	CourseID        uint           `json:"CourseID"`
	Course          Course         `gorm:"foreignKey:CourseID"`

	ClassSchedules  []ClassSchedule `gorm:"foreignKey:SuggestionID"`
}
