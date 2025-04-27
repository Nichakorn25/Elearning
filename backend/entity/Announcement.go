package entity

import (
	"gorm.io/gorm"
	"time"
)

type Announcement struct {
    gorm.Model
    Title        string    `json:"title" valid:"required~Title is required"`
    Content      string    `json:"content" valid:"required~Content is required, stringlength(10|200)~Content must be between 10 and 255 characters long"`
    AnnounceDate time.Time `json:"announce_date" valid:"required~AnnounceDate is required"`
    
    UserID       uint      `json:"user_id" valid:"required~UserID is required"`
    User         User      `gorm:"foreignKey:UserID"`
}