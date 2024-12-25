package entity

import (
	"gorm.io/gorm"
	"time"
)

type Announcement struct {
	gorm.Model
	Title       string    `json:"title"`       // Title of the announcement
	Content     string    `json:"content"`     // Content of the announcement
	AnnounceDate  time.Time `json:"announce_date"` // Date the announcement will be made

	UserID uint `json:"user_id"`                // ID of the user who created the announcement
	User   User `gorm:"foreignKey:UserID"`     // Relation to the User entity
}
