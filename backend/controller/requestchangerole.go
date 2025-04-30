package controller

import (
	"fmt"
	"net/http"
	"path/filepath"
	"time"

	"elearning/entity"
    "elearning/config"
	"github.com/gin-gonic/gin"
)

// POST /RoleChangeRequests

func CreateRoleChangeRequests(c *gin.Context) {
	db := config.DB()

	// รับ UserID จาก form field (หรือจาก session ถ้ามีระบบ auth)
	userID := c.PostForm("userID")
	if userID == "" {
		c.JSON(http.StatusBadRequest, gin.H{"error": "UserID is required"})
		return
	}

	// ตรวจสอบว่า User มีอยู่จริงหรือไม่
	var user entity.User
	if err := db.First(&user, userID).Error; err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "User not found"})
		return
	}

	// รับฟิลด์ Reason และไฟล์ ID Card
	reason := c.PostForm("reason")
	if reason == "" {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Reason is required"})
		return
	}

	file, err := c.FormFile("idCard")
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "ID card file is required"})
		return
	}

	// สร้างชื่อไฟล์ใหม่ด้วย timestamp
	uploadPath := "./uploads"
	timestamp := time.Now().Unix()
	extension := filepath.Ext(file.Filename)
	newFileName := fmt.Sprintf("idcard_%d%s", timestamp, extension)
	fileSavePath := filepath.Join(uploadPath, newFileName)

	// สร้าง path ที่จะเก็บในฐานข้อมูล
	idCardPath := fmt.Sprintf("/Uploads/%s", newFileName)

	// บันทึกไฟล์
	if err := c.SaveUploadedFile(file, fileSavePath); err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to save ID card file"})
		return
	}

	// สร้างข้อมูลสำหรับบันทึกลงฐานข้อมูล
	r := entity.RequestChangeRole{
		UserID: user.ID,
		Reason: reason,
		IDCard: idCardPath,
		Status: "Pending",
	}

	// บันทึกข้อมูลลงฐานข้อมูล
	if err := db.Create(&r).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to create role change request"})
		return
	}

	c.JSON(http.StatusCreated, gin.H{
		"message": "Role change request submitted successfully",
		"data":    r,
	})
}

func GetRoleChangeRequests(c *gin.Context) {
	db := config.DB()

	var requests []entity.RequestChangeRole
	result := db.Preload("User").Preload("User.Department").Preload("User.Major").Find(&requests) // ใช้ Preload เพื่อดึงข้อมูล User มาด้วย
	if result.Error != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": result.Error.Error()})
		return
	}

	c.JSON(http.StatusOK, gin.H{"data": requests})
}

func UpdateRoleChangeRequestsByID(c *gin.Context) {
	db := config.DB()

	// รับ ID ของคำขอจาก URL
	id := c.Param("id")

	// ดึงคำขอจากฐานข้อมูล
	var request entity.RequestChangeRole
	if err := db.First(&request, id).Error; err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "Role change request not found"})
		return
	}

	// รับฟิลด์ Status จาก request body
	var data struct {
		Status string `json:"status"`
	}
	if err := c.ShouldBindJSON(&data); err != nil || data.Status == "" {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Status is required"})
		return
	}

	// อัปเดต Status
	request.Status = data.Status

	// บันทึกการเปลี่ยนแปลงลงฐานข้อมูล
	if err := db.Save(&request).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to update status"})
		return
	}

	c.JSON(http.StatusOK, gin.H{
		"message": "Role change request status updated successfully",
		"data":    request,
	})
}

// Handle PATCH request for updating the RoleID of a user by UserID
func UpdateUserRoleByID(c *gin.Context) {
	db := config.DB()

	// รับ UserID จาก URL
	userID := c.Param("id")

	// ตรวจสอบว่า User มีอยู่จริงหรือไม่
	var user entity.User
	if err := db.First(&user, userID).Error; err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "User not found"})
		return
	}

	// รับ RoleID ใหม่จาก request body
	var data struct {
		RoleID uint `json:"role_id"`
	}
	if err := c.ShouldBindJSON(&data); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid data"})
		return
	}

	// อัปเดต RoleID ของ User
	user.RoleID = data.RoleID
	if err := db.Save(&user).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to update user role"})
		return
	}

	c.JSON(http.StatusOK, gin.H{"message": "User role updated successfully", "data": user})
}