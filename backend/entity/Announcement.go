package entity

import (
	"gorm.io/gorm"
	"time"
)

type Announcement struct {
	gorm.Model
	Title       string    `json:"Title"`       // Title of the announcement
	Content     string    `json:"Content"`     // Content of the announcement
	AnnounceDate time.Time `json:"AnnounceDate"` // Date the announcement will be made

	UserID uint `json:"UserID"`                // ID of the user who created the announcement
	User   User `gorm:"foreignKey:UserID"`     // Relation to the User entity
}
