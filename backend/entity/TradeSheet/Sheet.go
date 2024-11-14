package TradeSheet

import (
	"elearing/backend/entity/CreateCourse"

	"gorm.io/gorm"
)

type Sheet struct {
	gorm.Model
	Title         string  `json:"Title"`
	Description   string  `json:"Description"`
	Price         float32 `json:"Price"`
	Rating        float32 `json:"Rating"`
	PurchaseCount uint    `json:"PurchaseCount"`

	Review []Review `gorm:"foreignKey:SheetID"`

	CartItem []CartItem `gorm:"foreignKey:SheetID"`

	CourseID uint   `json:"CourseID"` 
	CreateCourse.Course  Course `gorm:"foreignKey:CourseID"`
}
