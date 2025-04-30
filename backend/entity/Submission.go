package entity

import (
	"time"
	"gorm.io/gorm"
)
type Submission struct { 
	gorm.Model
	SubmissionDate	time.Time `json:"submission_date"`
	FileName string `json:"file_name"`
    FilePath string `json:"file_path"`
	Grade Grade `gorm:"foreignKey:SubmissionID"`
	
	UserID uint `json:"user_id"`
	User   User `gorm:"foreignKey:UserID"`

	AssignmentID uint `json:"assignment_id"`
	Assignment   Assignment `gorm:"foreignKey:AssignmentID"`
}