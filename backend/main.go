package main

import (
	"elearning/config"
	"elearning/controller"
	"elearning/middlewares"
	"github.com/gin-gonic/gin"
	"net/http"
)

const PORT = "8000"

func main() {

	// open connection database

	config.ConnectionDB()

	// Generate databases

	config.SetupDatabase()

	r := gin.Default()

	r.Use(CORSMiddleware())

	// Auth Route
	r.GET("/departments", controller.GetDepartments)
	r.GET("/majors/:id", controller.GetMajorsByDepartment) // รับ ID ของ Department

	r.POST("/signup", controller.SignUp)                      //สมัคร
	r.POST("/signin", controller.SignIn)                      //Sign in == login
	r.PUT("/ResetPasswordUser", controller.ResetPasswordUser) //Sign in == login
	r.GET("/users/:id", controller.GetUser)                   //getOnlyID
	// r.GET("/professors/search", controller.SearchProfessors) // เส้นทางสำหรับค้นหาอาจารย์

	router := r.Group("")
	{
		router.Use(middlewares.Authorizes())

		// User Routes
		router.GET("/users", controller.ListUsers)
		router.GET("/users/filter", controller.ListUsersFilters)
		//router.GET("/users/:id", user.GetUser) //getOnlyID ย้ายไปไว้ข้างนอกเพื่อให้มันเรียกใช้ในหน้า login ได้

		//Appointment
		router.POST("/availabilities", controller.CreateAvailability)
		router.POST("/appointments", controller.CreateTeacherAppointment)
		router.GET("/searchProfessors", controller.SearchProfessors)
		// Teacher Routes
		router.GET("/teacher/appointments/:userId", controller.GetTeacherAppointmentsByUserID)
		router.POST("/teacher/appointments", controller.CreateTeacherAppointment)

		// Student Routes
		router.GET("/appointments/:teacherId", controller.GetAppointmentsForStudent)
		router.POST("/bookings", controller.BookAppointment)
		//router.GET("/users/filter", controller.ListUsersFilters)


		//----------------------//
		router.POST("/users", controller.CreateUser)
		router.PUT("/users/:id", controller.UpdateUserByid)
		router.DELETE("/users/:id", controller.DeleteUser) //ไม่ได้เรียกใช้

		// Announcement Routes
		router.GET("/announcements", controller.ListAnnouncements)
		router.GET("/announcements/:id", controller.GetAnnouncement)
		router.POST("/announcements", controller.CreateAnnouncement)
		router.PUT("/announcements/:id", controller.UpdateAnnouncement)
		router.DELETE("/announcements/:id", controller.DeleteAnnouncement)

		//RequestChangeRole
		router.POST("/requestchangeroles", controller.CreateRoleChangeRequests)
		router.GET("/requestchangeroles", controller.GetRoleChangeRequests)
	}

	r.GET("/", func(c *gin.Context) {

		c.String(http.StatusOK, "API RUNNING... PORT: %s", PORT)

	})

	// Run the server

	r.Run("localhost:" + PORT)

}

func CORSMiddleware() gin.HandlerFunc {

	return func(c *gin.Context) {

		c.Writer.Header().Set("Access-Control-Allow-Origin", "*")

		c.Writer.Header().Set("Access-Control-Allow-Credentials", "true")

		c.Writer.Header().Set("Access-Control-Allow-Headers", "Content-Type, Content-Length, Accept-Encoding, X-CSRF-Token, Authorization, accept, origin, Cache-Control, X-Requested-With")

		c.Writer.Header().Set("Access-Control-Allow-Methods", "POST, OPTIONS, GET, PUT, DELETE")

		if c.Request.Method == "OPTIONS" {

			c.AbortWithStatus(204)

			return

		}

		c.Next()

	}

}
