package controller

import (
    "net/http"
    "elearning/entity"
    "elearning/config"
    "github.com/gin-gonic/gin"
)

func GetDepartments(c *gin.Context) {
	var departments []entity.Department

	// ใช้ config.DB() เพื่อเข้าถึงฐานข้อมูล
	if err := config.DB().Find(&departments).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusOK, departments)
}
