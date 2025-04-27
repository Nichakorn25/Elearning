package controller

import (
   "example.com/Elearning/config"
   "example.com/Elearning/entity"
	"net/http"
	"strconv"

	"github.com/gin-gonic/gin"
)

// GetAllPaymentMethods - ดึงข้อมูล Payment Methods ทั้งหมด
func GetAllPaymentMethods(c *gin.Context) {
	var paymentMethods []entity.PaymentMethod
	if err := config.DB().Find(&paymentMethods).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to fetch payment methods"})
		return
	}
	c.JSON(http.StatusOK, gin.H{"payment_methods": paymentMethods})
}

// CreatePaymentMethod - เพิ่ม Payment Method ใหม่
func CreatePaymentMethod(c *gin.Context) {
	var input entity.PaymentMethod
	if err := c.ShouldBindJSON(&input); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid JSON data"})
		return
	}

	if err := config.DB().Create(&input).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to create payment method"})
		return
	}
	c.JSON(http.StatusCreated, gin.H{"message": "Payment method created successfully", "payment_method": input})
}

// UpdatePaymentMethod - แก้ไขข้อมูล Payment Method
func UpdatePaymentMethod(c *gin.Context) {
	var paymentMethod entity.PaymentMethod
	id := c.Param("id")

	if err := config.DB().First(&paymentMethod, id).Error; err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "Payment method not found"})
		return
	}

	var input entity.PaymentMethod
	if err := c.ShouldBindJSON(&input); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid JSON data"})
		return
	}

	// อัปเดตข้อมูล
	paymentMethod.Name = input.Name
	paymentMethod.BankCode = input.BankCode

	if err := config.DB().Save(&paymentMethod).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to update payment method"})
		return
	}
	c.JSON(http.StatusOK, gin.H{"message": "Payment method updated successfully", "payment_method": paymentMethod})
}

// DeletePaymentMethod - ลบ Payment Method
func DeletePaymentMethod(c *gin.Context) {
	id := c.Param("id")
	if err := config.DB().Delete(&entity.PaymentMethod{}, id).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to delete payment method"})
		return
	}
	c.JSON(http.StatusOK, gin.H{"message": "Payment method deleted successfully"})
}
func GetIncomeHistoryBySellerID(c *gin.Context) {
	// รับ SellerID จาก URL Parameter
	sellerID, err := strconv.ParseUint(c.Param("sellerID"), 10, 64)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid Seller ID"})
		return
	}

	var transactionLogs []entity.TransactionLog

	// ดึงข้อมูล TransactionLogs ที่เกี่ยวข้องกับ SellerID
	if err := config.DB().
	Unscoped().
    Joins("JOIN payments ON transaction_logs.payment_id = payments.id").
    Joins("JOIN purchases ON payments.purchase_id = purchases.id").
    Joins("JOIN cart_items ON purchases.cart_id = cart_items.cart_id").
    Joins("JOIN sheets ON cart_items.sheet_id = sheets.id").
    Where("sheets.seller_id = ?", sellerID). // กรองเฉพาะของ Seller นี้
    Preload("Payment").
    Preload("Payment.PaymentMethod").
    Preload("Payment.Purchase.Cart.CartItem.Sheet"). // Preload Sheet เพื่อเข้าถึง SellerID
    Preload("PaymentStatus").
    Find(&transactionLogs).Error; err != nil {
    c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
    return
}

var incomeHistory []map[string]interface{}
for _, log := range transactionLogs {
    for _, cartItem := range log.Payment.Purchase.Cart.CartItem {
        if cartItem.Sheet.SellerID ==  uint(sellerID) { // ตรวจสอบ SellerID อีกครั้ง
            incomeHistory = append(incomeHistory, map[string]interface{}{
                "date":   log.Payment.PaymentDate,
                "title":  cartItem.Sheet.Title,
                "amount": log.Payment.Amount,
                "status": log.PaymentStatus.StatusName,
            })
        }
    }
}

c.JSON(http.StatusOK, gin.H{"data": incomeHistory})

}