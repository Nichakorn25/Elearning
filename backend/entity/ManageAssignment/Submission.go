package ManageAssignment

import (
	"time"
	"gorm.io/gorm"
)
type Submission struct {
	gorm.Model
	CourseDate	time.Time `json:"CourseDate"`

	Grade []Grade `gorm:"foreignKey:SubmissionID"`
	
	UserID uint `json:"UserID"`
	User   User `gorm:"foreignKey:UserID"`

	AssignmentID uint `json:"AssignmentID"`
	Assignment   Assignment `gorm:"foreignKey:AssignmentID"`


	
}