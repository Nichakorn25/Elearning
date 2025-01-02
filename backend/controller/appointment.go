package controller

import (
	"elearning/config"
	"elearning/entity"
	//"errors"
	"net/http"

	"github.com/gin-gonic/gin"
	//"gorm.io/gorm"
)

// CreateAppointment creates a new appointment and saves it to the database
func CreateAppointment(c *gin.Context) {
	var appointment entity.TeacherAppointment

	// Bind JSON input to appointment struct
	if err := c.ShouldBindJSON(&appointment); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid input: " + err.Error()})
		return
	}

	// Save to the database
	db := config.DB()
	if err := db.Create(&appointment).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to save appointment: " + err.Error()})
		return
	}

	c.JSON(http.StatusCreated, gin.H{"message": "Appointment saved successfully", "data": appointment})
}