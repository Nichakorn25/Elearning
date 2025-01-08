package entity

import (
	"gorm.io/gorm"
)

type Attachment struct {
	gorm.Model
	FileName  string `json:"file_name"`
	FilePath  string `json:"file_path"`
	SubmissionID uint `json:"submissiom_id"`
}