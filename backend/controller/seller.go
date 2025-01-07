package controller

import (
	"net/http"
	"strconv"

	"elearning/entity"
	"elearning/config"

	"github.com/gin-gonic/gin"
)

// GetAllSellers - ดึงข้อมูล Seller ทั้งหมด
func GetAllSellers(c *gin.Context) {
	var sellers []entity.Seller
	if err := config.DB().Preload("User").Preload("SellerBankAccount.Bank").Preload("Sheet").Find(&sellers).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	// จัดรูปแบบข้อมูล
	var response []map[string]interface{}
	for _, seller := range sellers {
		response = append(response, map[string]interface{}{
			"id":   seller.ID,
			"name": seller.Name,
			"user": map[string]interface{}{
				"id":       seller.UserID,
				"username": seller.User.Username,
			},
			"bank_accounts": seller.SellerBankAccount,
			"sheets":        seller.Sheet,
		})
	}

	c.JSON(http.StatusOK, response)
}


// GetSellerByID - ดึงข้อมูล Seller ตาม ID
func GetSellerByID(c *gin.Context) {
	id, err := strconv.Atoi(c.Param("id"))
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid ID"})
		return
	}

	var seller entity.Seller
	if err := config.DB().Preload("User").Preload("SellerBankAccount").Preload("Sheet").First(&seller, id).Error; err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "Seller not found"})
		return
	}
	c.JSON(http.StatusOK, seller)
}

// CreateSeller - สร้าง Seller ใหม่
func CreateSeller(c *gin.Context) {
	var seller entity.Seller
	if err := c.ShouldBindJSON(&seller); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	if err := config.DB().Create(&seller).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}
	c.JSON(http.StatusCreated, seller)
}

// UpdateSeller - อัปเดตข้อมูล Seller
func UpdateSeller(c *gin.Context) {
	id, err := strconv.Atoi(c.Param("id"))
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid ID"})
		return
	}

	var seller entity.Seller
	if err := config.DB().Preload("SellerBankAccount").First(&seller, id).Error; err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "Seller not found"})
		return
	}

	// ดึงข้อมูลใหม่จาก JSON Body
	var updatedData entity.Seller
	if err := c.ShouldBindJSON(&updatedData); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	// อัปเดตข้อมูล Seller
	seller.Name = updatedData.Name
	seller.UserID = updatedData.UserID

	// ลบข้อมูล SellerBankAccount เก่าก่อน
	if err := config.DB().Model(&seller).Association("SellerBankAccount").Clear(); err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to clear existing bank accounts"})
		return
	}

	// เพิ่มข้อมูล SellerBankAccount ใหม่
	if err := config.DB().Model(&seller).Association("SellerBankAccount").Append(updatedData.SellerBankAccount); err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to update bank accounts"})
		return
	}

	// บันทึกข้อมูลที่อัปเดต
	if err := config.DB().Save(&seller).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusOK, seller)
}

// DeleteSeller - ลบ Seller
func DeleteSeller(c *gin.Context) {
	id, err := strconv.Atoi(c.Param("id"))
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid ID"})
		return
	}

	if err := config.DB().Delete(&entity.Seller{}, id).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}
	c.JSON(http.StatusOK, gin.H{"message": "Seller deleted successfully"})
}
// GetSellersByUserID - ดึงข้อมูล Seller ตาม UserID
func GetSellersByUserID(c *gin.Context) {
	userID, err := strconv.Atoi(c.Param("userID"))
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid UserID"})
		return
	}

	var sellers []entity.Seller
	if err := config.DB().Where("user_id = ?", userID).Preload("SellerBankAccount.Bank").Preload("Sheet").Find(&sellers).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	if len(sellers) == 0 {
		c.JSON(http.StatusNotFound, gin.H{"message": "No sellers found for the specified user"})
		return
	}

	c.JSON(http.StatusOK, sellers)
}

func CheckUserExistsInSeller(c *gin.Context) {
	// ดึง userId จาก path parameter
	userIDParam := c.Param("userId")
	userID, err := strconv.ParseUint(userIDParam, 10, 64)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"status": "error", "message": "Invalid userId"})
		return
	}

	// ตัวแปรสำหรับเช็คการมีอยู่ และเก็บ sellerId
	var sellerId uint64

	// ใช้คำสั่ง SQL เพื่อดึง sellerId หากมี userId อยู่ในตาราง sellers
	err = config.DB().Raw("SELECT id FROM sellers WHERE user_id = ? LIMIT 1", userID).Scan(&sellerId).Error
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"status": "error", "message": "Internal server error"})
		return
	}

	// ตอบกลับผลลัพธ์
	if sellerId > 0 {
		c.JSON(http.StatusOK, gin.H{
			"status":   "success",
			"message":  "User exists in Seller",
			"sellerId": sellerId,
		})
	} else {
		c.JSON(http.StatusOK, gin.H{
			"status":  "fail",
			"message": "User does not exist in Seller",
		})
	}
}

