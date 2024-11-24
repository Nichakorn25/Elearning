package controller

import (
    "net/http"
    "backend/entity"
    "backend/config"
    "github.com/gin-gonic/gin"
)

func GetMajorsByDepartment(c *gin.Context) {
	departmentID := c.Param("id")
	var majors []entity.Major

	// ใช้ config.DB() แทน db
	if err := config.DB().Where("department_id = ?", departmentID).Find(&majors).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusOK, majors)
}

