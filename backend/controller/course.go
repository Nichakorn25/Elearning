package controller

import (
    "net/http"
    "elearning/entity"
    "elearning/config"
    "github.com/gin-gonic/gin"
)

func GetCoursesByUserID(c *gin.Context) {
    // รับค่า userID จาก URL parameter
    userID := c.Param("id")

    // ตัวแปรสำหรับเก็บข้อมูลคอร์สที่ผู้ใช้สร้าง
    var courses []entity.Course

    // เรียกใช้งานฐานข้อมูล
    db := config.DB()

    // ค้นหาคอร์สที่มี user_id ตรงกับ userID ที่ได้รับจากพารามิเตอร์
    if err := db.Where("user_id = ?", userID).Find(&courses).Error; err != nil {
        c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
        return
    }

    // ส่งข้อมูลคอร์สที่พบกลับไปในรูปแบบ JSON
    c.JSON(http.StatusOK, courses)
}



