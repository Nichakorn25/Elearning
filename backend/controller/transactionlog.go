package controller

import (
	"net/http"
	"example.com/Elearning/entity"
    "example.com/Elearning/config"
	"github.com/gin-gonic/gin"
)

func GetTransactionLog(c *gin.Context) {
	var transactionlog []entity.TransactionLog

	db := config.DB()
	
	// ใช้ Preload เพื่อดึงข้อมูล Payment ที่สัมพันธ์กับ TransactionLog
	if err := db.Preload("Payment").Preload("Payment.User").Find(&transactionlog).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusOK, transactionlog)
}

// ใน controller ของ backend
func UpdateTransactionLogStatus(c *gin.Context) {
	var input struct {
		StatusID uint `json:"StatusID"`
	}

	// รับ ID ของ TransactionLog จาก URL
	id := c.Param("id")

	// ตรวจสอบว่าข้อมูลที่รับมาเป็นไปตามรูปแบบหรือไม่
	if err := c.ShouldBindJSON(&input); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid input"})
		return
	}

	db := config.DB()

	// อัปเดตเฉพาะ StatusID โดยใช้คำสั่ง Update
	if err := db.Model(&entity.TransactionLog{}).Where("id = ?", id).Update("status_id", input.StatusID).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to update status"})
		return
	}

	c.JSON(http.StatusOK, gin.H{"message": "Status updated successfully"})
}