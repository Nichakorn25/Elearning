package entity

import (
	"gorm.io/gorm"
	"time"
)

type Annoucement struct {
	gorm.Model
	Title    string    `json:"Title"`
	Content  string    `json:"Content"`
	CreateAt time.Time `json:"CreateAt"`

	UserID uint         `json:"UserID"`
	User   User `gorm:"foreignKey:UserID"`
}
