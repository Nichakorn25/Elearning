package controller

import (
	"elearning/config"
	"elearning/entity"
	"errors" // เพิ่ม import สำหรับ package errors
	"github.com/gin-gonic/gin"
	"gorm.io/gorm" // เพิ่ม import สำหรับ gorm
	"net/http"
)

// POST /users
func CreateUser(c *gin.Context) {
	var user entity.User

	db := config.DB()

	// bind เข้าตัวแปร user
	if err := c.ShouldBindJSON(&user); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	// เข้ารหัสลับรหัสผ่านที่ผู้ใช้กรอกก่อนบันทึกลงฐานข้อมูล
	hashedPassword, _ := config.HashPassword(user.Password)

	// สร้าง User
	u := entity.User{
		Username:     user.Username,
		Password:     hashedPassword,
		FirstName:    user.FirstName,
		LastName:     user.LastName,
		Email:        user.Email,
		Phone:        user.Phone,
		DepartmentID: user.DepartmentID,
		MajorID:      user.MajorID,
		RoleID:       user.RoleID,
	}

	// บันทึก
	if err := db.Create(&u).Error; err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusCreated, gin.H{"message": "Created success", "data": u})
}

// GET /user/:id
func GetUser(c *gin.Context) {
	ID := c.Param("id")
	var user entity.User

	db := config.DB()

	// Use Preload to load related data
	result := db.Preload("Department").
		Preload("Major").
		Preload("Major.Department").
		Preload("Role").
		Where("id = ?", ID).
		First(&user)

	if result.Error != nil {
		if errors.Is(result.Error, gorm.ErrRecordNotFound) {
			c.JSON(http.StatusNotFound, gin.H{"error": "User not found"})
		} else {
			c.JSON(http.StatusInternalServerError, gin.H{"error": result.Error.Error()})
		}
		return
	}

	c.JSON(http.StatusOK, user)
}

// GET /users
func ListUsers(c *gin.Context) {

	// Define a slice to hold user records
	var users []entity.User

	// Get the database connection
	db := config.DB()

	// Query the user table for basic user data
	results := db.Preload("Department").Preload("Major").Preload("Major.Department").Preload("Role").Select("id, username, password, first_name, last_name, email, phone, department_id, major_id, role_id").Find(&users)
	// Check for errors in the query
	if results.Error != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": results.Error.Error()})
		return
	}

	// Return the results as JSON
	c.JSON(http.StatusOK, users)
}

// func ListUsers(c *gin.Context) {
// 	var users []entity.User

// 	db := config.DB()

// 	if err := db.Find(&users).Error; err != nil {
//         c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
//         return
//     }

//     c.JSON(http.StatusOK, users)

// }

// DELETE /users/:id
func DeleteUser(c *gin.Context) {

	id := c.Param("id")
	db := config.DB()
	if tx := db.Exec("DELETE FROM users WHERE id = ?", id); tx.RowsAffected == 0 {
		c.JSON(http.StatusBadRequest, gin.H{"error": "id not found"})
		return
	}
	c.JSON(http.StatusOK, gin.H{"message": "Deleted successful"})

}

// PATCH /users
func UpdateUser(c *gin.Context) {
	var user entity.User

	UserID := c.Param("id")

	db := config.DB()
	result := db.First(&user, UserID)
	if result.Error != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "id not found"})
		return
	}

	if err := c.ShouldBindJSON(&user); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Bad request, unable to map payload"})
		return
	}

	result = db.Save(&user)
	if result.Error != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Bad request"})
		return
	}

	c.JSON(http.StatusOK, gin.H{"message": "Updated successful"})
}

// PUT update user ใช้อันนี้นะจ๊ะ
func UpdateUserByid(c *gin.Context) {

	var user entity.User

	UserID := c.Param("id")

	db := config.DB()

	result := db.First(&user, UserID)

	if result.Error != nil {

		c.JSON(http.StatusNotFound, gin.H{"error": "NameUser not found"})

		return

	}

	if err := c.ShouldBindJSON(&user); err != nil {

		c.JSON(http.StatusBadRequest, gin.H{"error": "Bad request, unable to map payload"})

		return

	}

	result = db.Save(&user)

	if result.Error != nil {

		c.JSON(http.StatusBadRequest, gin.H{"error": "Bad request"})

		return

	}

	c.JSON(http.StatusOK, gin.H{"message": "Updated successful"})

}
