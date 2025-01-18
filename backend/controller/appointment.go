package controller

import (
	"elearning/config"
	"elearning/entity"
	"net/http"

	"github.com/gin-gonic/gin"
)

//ไม่ได้ใช้
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
//not use

//ใช้
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
		// BufferTime: Appointment.BufferTime,
		// MaxBookings: Appointment.MaxBookings,
		Location: Appointment.Location,
		Description: Appointment.Description,
		UserID: Appointment.UserID,
		DayofWeekID: Appointment.DayofWeekID,
		// AvailabilityID: Appointment.AvailabilityID,
	}

	// บันทึก
	if err := db.Create(&u).Error; err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusCreated, gin.H{"message": "post Appointment success", "data": u})
}


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
//not use

//use
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
	if err := config.DB().Preload("User").Preload("DayofWeek").Where("user_id = ?", userId).Find(&appointments).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to retrieve appointments"})
		return
	}

	c.JSON(http.StatusOK, appointments)
}
//use

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

//ไม่ได้ใช้
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
//not use



// list Day of week use
func ListDays(c *gin.Context) {

	var days []entity.DayofWeek

	db := config.DB()

	results := db.Select("id, day_name").Find(&days)

	if results.Error != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": results.Error.Error()})
		return
	}

	c.JSON(http.StatusOK, days)
}



//จองวันเวลา StudentBooking ใช้อันนี้
func CreateStudentBooking(c *gin.Context) {
	var booking entity.StudentBooking

	if err := c.ShouldBindJSON(&booking); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	db := config.DB()

	u := entity.StudentBooking{
		UserID:        			booking.UserID,
		DayofWeekID: booking.DayofWeekID,
		TeacherAppointmentID:   booking.TeacherAppointmentID,
	}

	// บันทึก
	if err := db.Create(&u).Error; err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusCreated, gin.H{"message": "Booking success", "data": u})
}

//ไม่ได้ใช้
func ListStudentBookingByID(c *gin.Context) {
    var studentBookings []struct {
        ID               uint   `json:"id"`
        TeacherName      string `json:"teacher_name"`
        AppointmentDate  string `json:"appointment_date"`
        Description      string `json:"description"`
        StudentName      string `json:"student_name"`
    }

    var teacherAppointments []entity.TeacherAppointment

    db := config.DB()

    userID := c.Query("userID")
    if userID == "" {
        c.JSON(http.StatusBadRequest, gin.H{"error": "UserID is required"})
        return
    }

    // Find TeacherAppointments created by the user
    if err := db.Where("user_id = ?", userID).Find(&teacherAppointments).Error; err != nil {
        c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
        return
    }

    if len(teacherAppointments) == 0 {
		c.JSON(http.StatusOK, gin.H{"data": []entity.TeacherAppointment{}})
		return
	}
	

    var teacherAppointmentIDs []uint
    for _, appointment := range teacherAppointments {
        teacherAppointmentIDs = append(teacherAppointmentIDs, appointment.ID)
    }

    // Join StudentBooking with Student name and TeacherAppointment
    query := db.Table("student_bookings").
        Select("student_bookings.id, teacher_appointments.title AS teacher_name, student_bookings.created_at AS appointment_date, student_bookings.description, users.first_name || ' ' || users.last_name AS student_name").
        Joins("JOIN teacher_appointments ON student_bookings.teacher_appointment_id = teacher_appointments.id").
        Joins("JOIN users ON student_bookings.user_id = users.id").
        Where("teacher_appointments.id IN ?", teacherAppointmentIDs).
        Scan(&studentBookings)

    if query.Error != nil {
        c.JSON(http.StatusInternalServerError, gin.H{"error": query.Error.Error()})
        return
    }

    c.JSON(http.StatusOK, gin.H{"data": studentBookings})
}

//ดึงข้อมูลStudentBookingใส่Notification
func GetBookingStudent(c *gin.Context) {
    teacherId := c.Param("teacherId") // รับ teacherId จาก URL parameter
    var teacher []entity.User

    // ตรวจสอบว่า Teacher ID มีอยู่หรือไม่ และ Role เป็น Teacher
    if err := config.DB().First(&teacher, "id = ?", teacherId).Error; err != nil {
        c.JSON(http.StatusUnauthorized, gin.H{"error": "Teacher not found or invalid"})
        return
    }

    // ดึงข้อมูล StudentBooking พร้อม Preload ตาราง TeacherAppointment
    var studentBookings []entity.StudentBooking
    if err := config.DB().
		Preload("User").
		Preload("DayofWeek").
        Preload("TeacherAppointment"). // Preload ข้อมูล TeacherAppointment
        Where("teacher_appointment_id IN (SELECT id FROM teacher_appointments WHERE user_id = ?)", teacherId).
        Find(&studentBookings).Error; err != nil {
        c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to retrieve student bookings"})
        return
    }

    c.JSON(http.StatusOK, studentBookings)
}

func DeleteTeacherAppointment(c *gin.Context) {
    id := c.Param("id") // รับ ID ของ TeacherAppointment จาก URL parameter
    db := config.DB()

    // ลบ TeacherAppointment ตาม ID
    result := db.Delete(&entity.TeacherAppointment{}, "id = ?", id)
    if result.Error != nil {
        c.JSON(http.StatusInternalServerError, gin.H{"error": result.Error.Error()})
        return
    }

    // ตรวจสอบว่าพบแถวที่ถูกลบหรือไม่
    if result.RowsAffected == 0 {
        c.JSON(http.StatusNotFound, gin.H{"error": "TeacherAppointment not found"})
        return
    }

    c.JSON(http.StatusOK, gin.H{"message": "TeacherAppointment deleted successfully"})
}


