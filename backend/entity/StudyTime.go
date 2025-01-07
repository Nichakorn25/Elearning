package entity

import (
	"time"

	"gorm.io/gorm"
)

type StudyTime struct {
	gorm.Model
	StudyDay       string    `json:"StudyDay"`
	StudyTimeStart time.Time `json:"StudyTimeStart"`
	StudyTimeEnd   time.Time `json:"StudyTimeEnd"`

	CourseID uint   `json:"CourseID"`
	Course   Course `gorm:"foreignKey:CourseID;constraint:onUpdate:CASCADE,onDelete:SET NULL;"`
}
