package controller

import (
	"fmt"
	"net/http"
	"strconv"
	"time"

	"elearning/config"
	"elearning/entity"

	"github.com/gin-gonic/gin"
	"gorm.io/gorm"
)
func CreateOrGetCart(c *gin.Context) {
    var input struct {
        UserID       uint `json:"userId"`
        CartStatusID uint `json:"cartStatusId"`
    }

    if err := c.BindJSON(&input); err != nil {
        c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid input data"})
        return
    }

    var cart entity.Cart
    db := config.DB()

    // ตรวจสอบว่ามีตะกร้าสถานะ Active อยู่แล้วหรือไม่
    if err := db.Where("user_id = ? AND cart_status_id = ?", input.UserID, input.CartStatusID).First(&cart).Error; err == nil {
        // คืนค่าตะกร้าที่มีอยู่
        c.JSON(http.StatusOK, gin.H{
            "message": "Existing cart found",
            "cartId":  cart.ID,
            "isNewCartCreated": false,
        })
        return
    }

    // หากไม่มีตะกร้าที่สถานะเป็น Active ให้สร้างใหม่
    newCart := entity.Cart{
        UserID:       input.UserID,
        CartStatusID: input.CartStatusID,
    }

    if err := db.Create(&newCart).Error; err != nil {
        c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to create cart"})
        return
    }

    c.JSON(http.StatusOK, gin.H{
        "message": "New cart created successfully",
        "cartId":  newCart.ID,
        "isNewCartCreated": true,
    })
}

func CreateCart(c *gin.Context) {
	var input struct {
		UserID uint `json:"userID"`
	}

	if err := c.BindJSON(&input); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid input data"})
		return
	}

	// สร้างตะกร้าใหม่ด้วย UserID
	newCart := entity.Cart{
		UserID:       input.UserID,
		CartStatusID: 1, // กำหนดสถานะเริ่มต้นเป็น Active
	}

	if err := config.DB().Create(&newCart).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to create cart"})
		return
	}

	// ส่งกลับรหัสตะกร้าและข้อมูลตะกร้า
	c.JSON(http.StatusOK, gin.H{
		"message": "Cart created successfully",
		"cartId":  newCart.ID,
	})
}
// ดึงข้อมูลสถานะของตะกร้า
func GetCartStatuses(c *gin.Context) {
	var statuses []entity.CartStatus
	if err := config.DB().Find(&statuses).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}
	c.JSON(http.StatusOK, gin.H{"data": statuses})
}

// ดึงข้อมูลตะกร้าของผู้ใช้
func GetCartByUser(c *gin.Context) {
    userId := c.Param("id")
    if userId == "" {
        c.JSON(http.StatusBadRequest, gin.H{"error": "User ID is required"})
        return
    }

    // แปลง userId จาก string เป็น uint
    userIdUint, err := strconv.ParseUint(userId, 10, 32)
    if err != nil {
        c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid User ID"})
        return
    }

    var cart entity.Cart
    if err := config.DB().
        Preload("CartStatus").
        Preload("User").
        Preload("CartItem").
        Preload("CartItem.Sheet").
        Preload("CartItem.Sheet.Seller"). 
        Preload("CartItem.Sheet.Course").
        Where("user_id = ? AND cart_status_id = ?", uint(userIdUint), 1).
        First(&cart).Error; err != nil {

        // หากไม่มี Active Cart ให้สร้างใหม่
        if err == gorm.ErrRecordNotFound {
            newCart := entity.Cart{
                UserID:       uint(userIdUint),
                CartStatusID: 1, // Active
            }
            if createErr := config.DB().Create(&newCart).Error; createErr != nil {
                c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to create cart"})
                return
            }
            // พรีโหลดข้อมูลที่เกี่ยวข้องของ Cart ใหม่
            if err := config.DB().
                Preload("CartStatus").
                Preload("User").
                Preload("CartItem").
                Preload("CartItem.Sheet").
                Preload("CartItem.Sheet.Seller").
                Preload("CartItem.Sheet.Course").
                First(&newCart, newCart.ID).Error; err != nil {
                c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to preload cart data"})
                return
            }
            cart = newCart
        } else {
            c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
            return
        }
    }

    c.JSON(http.StatusOK, gin.H{"data": cart})
}



// ดึงข้อมูลตะกร้าทั้งหมด
func GetCarts(c *gin.Context) {
	var carts []entity.Cart
	if err := config.DB().Preload("CartStatus").Preload("CartItem.Sheet").Find(&carts).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}
	c.JSON(http.StatusOK, gin.H{"data": carts})
}

// ดึงข้อมูลตะกร้าโดย ID
func GetCartById(c *gin.Context) {
	cartID := c.Param("id")

	var cart entity.Cart
	if err := config.DB().
	Preload("CartStatus").        
	Preload("CartStatus").
	Preload("User").
	Preload("CartItem").
	Preload("CartItem.Sheet").
	Preload("CartItem.Sheet.Seller"). 
	Preload("CartItem.Sheet.Course").First(&cart, cartID).Error; err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "Cart not found"})
		return
	}
	c.JSON(http.StatusOK, gin.H{"data": cart})
}

func AddToCart(c *gin.Context) {
    var input struct {
        CartID  uint `json:"cartID"`
        SheetID uint `json:"sheetID"`
    }

    if err := c.BindJSON(&input); err != nil {
        c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid input data"})
        return
    }

    db := config.DB()
    tx := db.Begin()

    cartItem := entity.CartItem{
        AddedDate: time.Now(),
        SheetID:   input.SheetID,
        CartID:    input.CartID,
    }

    if err := tx.Create(&cartItem).Error; err != nil {
        tx.Rollback()
        c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to add item to cart"})
        return
    }

    tx.Commit()
    c.JSON(http.StatusOK, gin.H{"message": "Item added to cart successfully"})
}




// ดึงรายการสินค้าทั้งหมดในตะกร้า
func ListCartItems(c *gin.Context) {
	cartID := c.Param("cart_id")

	var cartItems []entity.CartItem
	if err := config.DB().Preload("Sheet").Where("cart_id = ?", cartID).Find(&cartItems).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}
	c.JSON(http.StatusOK, gin.H{"data": cartItems})
}

// อัปเดตรายการสินค้าในตะกร้า
func UpdateCartItemById(c *gin.Context) {
	itemID := c.Param("id")
	var input entity.CartItem

	if err := c.ShouldBindJSON(&input); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	if err := config.DB().Model(&entity.CartItem{}).Where("id = ?", itemID).Updates(input).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}
	c.JSON(http.StatusOK, gin.H{"message": "Cart item updated successfully"})
}

// ลบสินค้าออกจากตะกร้า
func DeleteCartItemById(c *gin.Context) {
	itemID := c.Param("id")

	if err := config.DB().Unscoped().Delete(&entity.CartItem{}, itemID).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}
}

func CheckoutCart(c *gin.Context) {
	var input struct {
		CartID     uint   
		DiscountID uint   `json:"discount_id"`
		MethodID   uint   `json:"method_id"` 
		Slip       string `json:"slip"`      
	}
	fmt.Println("Cart ID received:", input.CartID)

	// รับข้อมูลจาก Request
	if err := c.ShouldBindJSON(&input); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	// ดึงข้อมูล Cart และ CartItem
	var cart entity.Cart
	if err := config.DB().Preload("CartItem.Sheet").First(&cart, input.CartID).Error; err != nil {
		fmt.Println("Query error:", err)
		c.JSON(http.StatusNotFound, gin.H{"error": "Cart not found"})
		return
	}	

	// คำนวณราคารวม
	var totalPrice float32
	for _, item := range cart.CartItem {
		totalPrice += item.Sheet.Price
	}

	// สร้างการสั่งซื้อ
	purchase := entity.Purchase{
		PurchaseDate: time.Now(),
		TotalPrice:   totalPrice,
		CartID:       cart.ID,
		DiscountID:   input.DiscountID,
		UserID:       cart.UserID,
	}
	if err := config.DB().Create(&purchase).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to create purchase"})
		return
	}

	// สร้างการชำระเงิน
	payment := entity.Payment{
		UserID:      cart.UserID,
		PurchaseID:  purchase.ID,
		MethodID:    input.MethodID,
		Amount:      totalPrice, // ใช้ราคารวม
		PaymentDate: time.Now(),
		Slip:        input.Slip, // เก็บ Base64 String
	}
	if err := config.DB().Create(&payment).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to create payment"})
		return
	}

	// เพิ่ม TransactionLog
	transactionLog := entity.TransactionLog{
		StatusID:  1, // 1 หมายถึงสถานะ "Pending"
		PaymentID: payment.ID,
	}
	if err := config.DB().Create(&transactionLog).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to create transaction log"})
		return
	}

	// อัปเดตสถานะ Cart
	cart.CartStatusID = 2 // Completed
	if err := config.DB().Save(&cart).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to update cart status"})
		return
	}

	// เพิ่ม PurchaseCount ในตาราง Sheet
	for _, item := range cart.CartItem {
		if err := config.DB().Model(&entity.Sheet{}).
			Where("id = ?", item.SheetID).
			Update("purchase_count", gorm.Expr("purchase_count + ?", 1)).Error; err != nil {
			fmt.Println("Error updating purchase count for sheet:", item.SheetID)
			c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to update purchase count"})
			return
		}
	}

	// ตอบกลับสำเร็จ
	c.JSON(http.StatusOK, gin.H{
		"message":        "Checkout completed successfully",
		"purchase_id":    purchase.ID,
		"payment_id":     payment.ID,
		"transaction_id": transactionLog.ID,
	})
}

