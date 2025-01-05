package controller

import (
	"elearning/config"
	"elearning/entity"
	"net/http"

	"github.com/gin-gonic/gin"
)
func CreateAvailability(c *gin.Context) {
	var availability entity.Availability

	// Bind JSON payload
	if err := c.ShouldBindJSON(&availability); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid request payload", "details": err.Error()})
		return
	}

	// Save to the database
	db := config.DB()
	if err := db.Create(&availability).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to create availability", "details": err.Error()})
		return
	}

	c.JSON(http.StatusCreated, gin.H{
		"message": "Availability created successfully",
		"data":    availability,
	})
}

func CreateTeacherAppointment(c *gin.Context) {
	var Appointment entity.TeacherAppointment

	if err := c.ShouldBindJSON(&Appointment); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	db := config.DB()

	u := entity.TeacherAppointment{
		Title: Appointment.Title,
		AppointmentDuration: Appointment.AppointmentDuration,
		BufferTime: Appointment.BufferTime,
		MaxBookings: Appointment.MaxBookings,
		Location: Appointment.Location,
		Description: Appointment.Description,
		UserID: Appointment.UserID,
		AvailabilityID: Appointment.AvailabilityID,
	}

	// บันทึก
	if err := db.Create(&u).Error; err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusCreated, gin.H{"message": "post Appointment success", "data": u})
}

// GET /teacher/appointments/:teacherId
// GetTeacherAppointments ดึง Appointment ตาม UserID (อาจารย์)
func GetTeacherAppointments(c *gin.Context) {
	teacherId := c.Param("teacherId") // รับ UserID ของอาจารย์
	var appointments []entity.TeacherAppointment

	// Query appointments ที่ตรงกับ UserID
	if err := config.DB().Where("user_id = ?", teacherId).Find(&appointments).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to retrieve appointments"})
		return
	}

	c.JSON(http.StatusOK, gin.H{
		"appointments": appointments,
	})
}


func GetTeacherAppointmentsByUserID(c *gin.Context) {
	userId := c.Param("userId")
	var appointments []entity.TeacherAppointment

	// ตรวจสอบว่าผู้ใช้เป็น Teacher หรือไม่
	var user entity.User
	if err := config.DB().First(&user, userId).Error; err != nil || user.RoleID != 2 {
		c.JSON(http.StatusUnauthorized, gin.H{"error": "User is not a teacher or not found"})
		return
	}

	// Query Appointments
	if err := config.DB().Where("user_id = ?", userId).Find(&appointments).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to retrieve appointments"})
		return
	}

	c.JSON(http.StatusOK, appointments)
}

func GetAppointmentsForStudent(c *gin.Context) {
	teacherId := c.Param("teacherId")
	var appointments []entity.TeacherAppointment

	// ตรวจสอบว่า Teacher ID มีอยู่หรือไม่
	var teacher entity.User
	if err := config.DB().First(&teacher, teacherId).Error; err != nil || teacher.RoleID != 2 {
		c.JSON(http.StatusUnauthorized, gin.H{"error": "Teacher not found or invalid"})
		return
	}

	// ดึง Appointments ของ Teacher
	if err := config.DB().Where("user_id = ?", teacherId).Find(&appointments).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to retrieve appointments"})
		return
	}

	c.JSON(http.StatusOK, appointments)
}

func BookAppointment(c *gin.Context) {
	var booking entity.StudentBooking

	// ตรวจสอบ Payload
	if err := c.ShouldBindJSON(&booking); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid request payload", "details": err.Error()})
		return
	}

	// ตรวจสอบว่า Appointment ยังมีที่ว่างหรือไม่
	var totalBookings int64
	if err := config.DB().Model(&entity.StudentBooking{}).
		Where("appointment_id = ?", booking.TeacherAppointmentID).
		Count(&totalBookings).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to check booking availability"})
		return
	}

	var maxBookings int
	if err := config.DB().Model(&entity.TeacherAppointment{}).
		Select("max_bookings").
		Where("id = ?", booking.TeacherAppointmentID).
		Scan(&maxBookings).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to retrieve max bookings"})
		return
	}

	if int(totalBookings) >= maxBookings {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Appointment is fully booked"})
		return
	}

	// บันทึกข้อมูลการจอง
	if err := config.DB().Create(&booking).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to book appointment", "details": err.Error()})
		return
	}

	c.JSON(http.StatusCreated, gin.H{"message": "Appointment booked successfully", "data": booking})
}
