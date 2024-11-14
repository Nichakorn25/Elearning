package TradeSheet

import (
	"backend/entity/Profile"
	"time"
	"gorm.io/gorm"
)
type CartItem struct {
	gorm.Model
	AddedDate	time.Time `json:"AddedDate"`

	SheetID uint `json:"SheetID"`
	Sheet   Sheet `gorm:"foreignKey:SheetID"`

	UserID uint `json:"UserID"`
	Profile.User   User `gorm:"foreignKey:UserID"`

}