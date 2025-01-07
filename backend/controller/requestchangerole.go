package controller

import (
    "net/http"
    "elearning/entity"
    "elearning/config"
    "github.com/gin-gonic/gin"
)

// POST /RoleChangeRequests
import (
    "time"
    "path/filepath"
    "fmt"
)

func CreateRoleChangeRequests(c *gin.Context) {
    db := config.DB()

    // รับข้อมูลจาก form fields
    username := c.PostForm("username")
    fullname := c.PostForm("fullname")
    email := c.PostForm("email")
    phone := c.PostForm("phone")
    department := c.PostForm("department")
    major := c.PostForm("major")
    reason := c.PostForm("reason")

    // ตรวจสอบฟิลด์ที่จำเป็น
    if username == "" || email == "" || reason == "" {
        c.JSON(http.StatusBadRequest, gin.H{"error": "Username, Email, and Reason are required fields"})
        return
    }

    // รับไฟล์ ID Card
    file, err := c.FormFile("idCard")
    if err != nil {
        c.JSON(http.StatusBadRequest, gin.H{"error": "ID card file is required"})
        return
    }

    // สร้างชื่อไฟล์ใหม่ด้วย timestamp
    uploadPath := "./uploads"
    timestamp := time.Now().Unix() // ใช้เวลาปัจจุบันเพื่อสร้างชื่อไฟล์ที่ไม่ซ้ำกัน
    extension := filepath.Ext(file.Filename) // ดึงนามสกุลของไฟล์
    newFileName := fmt.Sprintf("idcard_%d%s", timestamp, extension) // สร้างชื่อไฟล์ใหม่
    fileSavePath := filepath.Join(uploadPath, newFileName) // ที่อยู่ไฟล์ที่ต้องการบันทึกจริงๆ

    // สร้าง path ที่จะเก็บไว้ในฐานข้อมูล (เป็น URL)
    idCardPath := fmt.Sprintf("/uploads/%s", newFileName)

    // บันทึกไฟล์ไปยังโฟลเดอร์ที่ต้องการ
    if err := c.SaveUploadedFile(file, fileSavePath); err != nil {
        c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to save ID card file"})
        return
    }

    // สร้างข้อมูลสำหรับบันทึกลงฐานข้อมูล
    r := entity.RequestChangeRole{
        Username:   username,
        Fullname:   fullname,
        Email:      email,
        Phone:      phone,
        Department: department,
        Major:      major,
        Reason:     reason,
        IDCard:     idCardPath, // เก็บ URL ของไฟล์ในฐานข้อมูล
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
    var requests []entity.RequestChangeRole
	db := config.DB()
    result := db.Find(&requests)
    if result.Error != nil {
        c.JSON(http.StatusInternalServerError, gin.H{"error": result.Error.Error()})
        return
    }
    c.JSON(http.StatusOK, requests)
}
