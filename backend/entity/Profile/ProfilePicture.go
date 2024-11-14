package Profile

import (
	"gorm.io/gorm"
)
type ProfilePicture struct {
	gorm.Model
	FilePath  string `json:"FilePath"`

	UserID uint `json:"UserID"`
	User   User `gorm:"foreignKey:UserID"`

}