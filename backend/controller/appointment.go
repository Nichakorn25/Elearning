package controller

import (
	"elearning/config"
	"elearning/entity"
	"net/http"

	"github.com/gin-gonic/gin"
)

// CreateTeacherAppointment creates a new appointment and saves it to the database
func CreateTeacherAppointment(c *gin.Context) {
	var appointment entity.TeacherAppointment

	// Bind JSON request body to the TeacherAppointment struct
	if err := c.ShouldBindJSON(&appointment); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid request payload", "details": err.Error()})
		return
	}

	// Validate required fields
	missingFields := []string{}
	if appointment.AppointmentDuration == 0 {
		missingFields = append(missingFields, "Appointment Duration")
	}
	if appointment.UserID == 0 {
		missingFields = append(missingFields, "User ID")
	}
	if appointment.AvailabilityID == 0 {
		missingFields = append(missingFields, "Availability ID")
	}

	if len(missingFields) > 0 {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Missing required fields", "fields": missingFields})
		return
	}

	// Save the appointment to the database
	if err := config.DB().Create(&appointment).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to create appointment", "details": err.Error()})
		return
	}

	c.JSON(http.StatusCreated, gin.H{
		"message": "Appointment created successfully",
		"data":    appointment,
	})
}
