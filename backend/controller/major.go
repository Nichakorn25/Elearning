package controller

import (
    "net/http"
    "example.com/Elearning/entity"
    "example.com/Elearning/config"
    "github.com/gin-gonic/gin"
	"errors"  // เพิ่ม import สำหรับ package errors
	"gorm.io/gorm" // เพิ่ม import สำหรับ gorm
)
func GetMajorsByDepartment(c *gin.Context) {
	departmentID := c.Param("id")
	var majors []entity.Major

	db := config.DB()

	// Query the user by ID
	results := db.Preload("Department").Where("department_id = ?", departmentID).Find(&majors)
	if results.Error != nil {
		if errors.Is(results.Error, gorm.ErrRecordNotFound) {
			c.JSON(http.StatusNotFound, gin.H{"error": "Major not found"})
		} else {
			c.JSON(http.StatusInternalServerError, gin.H{"error": results.Error.Error()})
		}
		return
	}

	c.JSON(http.StatusOK, majors)
}