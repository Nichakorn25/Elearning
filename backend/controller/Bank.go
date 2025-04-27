package controller

import (
	"net/http"
	"strconv"
   "example.com/Elearning/config"
   "example.com/Elearning/entity"
	"github.com/gin-gonic/gin"
)

// GetAllSellerBankAccounts - ดึงข้อมูลบัญชีธนาคารทั้งหมด
func GetAllSellerBankAccounts(c *gin.Context) {
	var accounts []entity.SellerBankAccount
	if err := config.DB().Preload("Bank").Preload("Seller").Find(&accounts).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}
	c.JSON(http.StatusOK, accounts)
}

// GetSellerBankAccountByID - ดึงข้อมูลบัญชีธนาคารตาม ID
func GetSellerBankAccountByID(c *gin.Context) {
	id, err := strconv.Atoi(c.Param("id"))
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid ID"})
		return
	}

	var account entity.SellerBankAccount
	if err := config.DB().Preload("Bank").Preload("Seller").First(&account, id).Error; err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "SellerBankAccount not found"})
		return
	}
	c.JSON(http.StatusOK, account)
}

// CreateSellerBankAccount - สร้างบัญชีธนาคารใหม่
func CreateSellerBankAccount(c *gin.Context) {
	var account entity.SellerBankAccount
	if err := c.ShouldBindJSON(&account); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	if err := config.DB().Create(&account).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}
	c.JSON(http.StatusCreated, account)
}

// UpdateSellerBankAccount - อัปเดตบัญชีธนาคาร
func UpdateSellerBankAccount(c *gin.Context) {
	id, err := strconv.Atoi(c.Param("id"))
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid ID"})
		return
	}

	var account entity.SellerBankAccount
	if err := config.DB().First(&account, id).Error; err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "SellerBankAccount not found"})
		return
	}

	if err := c.ShouldBindJSON(&account); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	if err := config.DB().Save(&account).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}
	c.JSON(http.StatusOK, account)
}

// DeleteSellerBankAccount - ลบบัญชีธนาคาร
func DeleteSellerBankAccount(c *gin.Context) {
	id, err := strconv.Atoi(c.Param("id"))
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid ID"})
		return
	}

	if err := config.DB().Delete(&entity.SellerBankAccount{}, id).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}
	c.JSON(http.StatusOK, gin.H{"message": "SellerBankAccount deleted successfully"})
}
// GetSellerBankAccountsByUserID - ดึงข้อมูลบัญชีธนาคารตาม UserID
func GetSellerBankAccountsByUserID(c *gin.Context) {
	userID, err := strconv.Atoi(c.Param("userID"))
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid UserID"})
		return
	}

	var accounts []entity.SellerBankAccount
	if err := config.DB().
		Preload("Bank").
		Preload("Seller").
		Where("seller_id = ?", userID).
		Find(&accounts).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	if len(accounts) == 0 {
		c.JSON(http.StatusNotFound, gin.H{"message": "No bank accounts found for the specified user"})
		return
	}

	c.JSON(http.StatusOK, accounts)
}
func GetBanks(c *gin.Context) {
	var banks []entity.Bank
	if err := config.DB().Preload("SellerBankAccount").Find(&banks).Error; err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusOK, gin.H{"data": banks})
}

// GetBankByID - ดึงข้อมูล Bank ตาม ID
func GetBankByID(c *gin.Context) {
	id := c.Param("id")
	var bank entity.Bank

	if err := config.DB().Preload("SellerBankAccount").First(&bank, id).Error; err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "Bank not found"})
		return
	}

	c.JSON(http.StatusOK, gin.H{"data": bank})
}