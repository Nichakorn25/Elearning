package entity

import (
	"gorm.io/gorm"
)

type Attachment struct {
	gorm.Model
	FileName  string `json:"FileName"`
	FilePath  string `json:"FilePath"`
	
	AssignmentID uint `json:"AssignmentID"`
	Assignment   Assignment `gorm:"foreignKey:AssignmentID"`

	
}