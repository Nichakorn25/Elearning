package Admin

import (
	"backend/entity/Profile"
	"time"
	"gorm.io/gorm"
)
type Log struct {
	gorm.Model
	Action  string `json:"Action"`
	CreateAt	time.Time `json:"CreateAt"`
	
	UserID uint `json:"UserID"`
	User   User `gorm:"foreignKey:UserID"`
}