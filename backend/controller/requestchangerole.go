package controller

import (
    "net/http"
    "elearning/entity"
    "elearning/config"
    "github.com/gin-gonic/gin"
)

// POST /RoleChangeRequests
func CreateRoleChangeRequests(c *gin.Context) {
    var request entity.RequestChangeRole

    db := config.DB()

    // รับข้อมูลจาก multipart/form-data
    if err := c.ShouldBind(&request); err != nil {
        c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
        return
    }

    // ตรวจสอบฟิลด์ที่จำเป็น
    if request.Username == "" || request.Email == "" || request.Reason == "" {
        c.JSON(http.StatusBadRequest, gin.H{"error": "Username, Email, and Reason are required fields"})
        return
    }
	

    r := entity.RequestChangeRole{
        Username:  request.Username,
        Fullname:  request.Fullname,
        Email:     request.Email,
        Phone:     request.Phone,
        Department: request.Department,
        Major:     request.Major,
        Reason:    request.Reason,
        IDCard:    request.IDCard, // ตรวจสอบการจัดการไฟล์
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
