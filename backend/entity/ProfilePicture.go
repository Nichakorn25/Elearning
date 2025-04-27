package entity

import (
	"gorm.io/gorm"
)

type ProfilePicture struct {
	gorm.Model
	FilePath  string `json:"FilePath" valid:"required~FilePath is required, url~FilePath is invalid"`

	UserID uint `json:"UserID" valid:"required~UserID is required"`
	User   User `gorm:"foreignKey:UserID"`

}