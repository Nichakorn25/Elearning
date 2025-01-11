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
	r.Static("/uploads", "./public/uploads")
	r.Static("/worker", "./public/worker")

	// Auth Route
	r.GET("/departments", controller.GetDepartments)
	r.GET("/majors/:id", controller.GetMajorsByDepartment) // รับ ID ของ Department

	r.POST("/signup", controller.SignUp)                      //สมัคร
	r.POST("/signin", controller.SignIn)                      //Sign in == login
	r.PUT("/ResetPasswordUser", controller.ResetPasswordUser) //Sign in == login
	r.GET("/users/:id", controller.GetUser)                   //getOnlyID
	// r.GET("/professors/search", controller.SearchProfessors) // เส้นทางสำหรับค้นหาอาจารย์
	// r.Static("/uploads", "./uploads") 

	// r.POST("/send_recovery_email", controller.SendRecoveryEmail)
	// r.POST("/verify_otp", controller.VerifyOTP)
	// r.POST("/reset_password", controller.Resetpassword)

	router := r.Group("")
	{
		router.Use(middlewares.Authorizes())

		// User Routes
		router.GET("/users", controller.ListUsers)
		router.GET("/users/filter", controller.ListUsersFilters)
		//router.GET("/users/:id", user.GetUser) //getOnlyID ย้ายไปไว้ข้างนอกเพื่อให้มันเรียกใช้ในหน้า login ได้

		//Appointment
		router.GET("/student/bookings", controller.ListStudentBookingByID)
		router.POST("/availabilities", controller.CreateAvailability)
		router.POST("/appointments", controller.CreateTeacherAppointment)
		router.GET("/searchProfessors", controller.SearchProfessors)
		// Teacher Routes
		router.GET("/teacher/appointments/:userId", controller.GetTeacherAppointmentsByUserID)
		router.GET("/day", controller.ListDays)
		router.POST("/teacher/appointments", controller.CreateTeacherAppointment)
		router.POST("/CreateStudentBooking", controller.CreateStudentBooking)

		// Student Routes
		router.GET("/appointments/:teacherId", controller.GetAppointmentsForStudent)
		router.POST("/bookings", controller.BookAppointment)
		//router.GET("/users/filter", controller.ListUsersFilters)

		//Planner
		router.GET("/searchCourses", controller.SearchCourses)

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
		// SellerBankAccount Routes
		router.GET("/seller-bank-accounts", controller.GetAllSellerBankAccounts)
		router.GET("/seller-bank-accounts/:id", controller.GetSellerBankAccountByID)
		router.GET("/seller-bank-accounts/user/:userID", controller.GetSellerBankAccountsByUserID)
		router.POST("/seller-bank-accounts", controller.CreateSellerBankAccount)
		router.PUT("/seller-bank-accounts/:id", controller.UpdateSellerBankAccount)
		router.DELETE("/seller-bank-accounts/:id", controller.DeleteSellerBankAccount)
		router.GET("/banks", controller.GetBanks)
		router.GET("/banks/:id", controller.GetBankByID)
		// Seller Routes
		router.GET("/sellers", controller.GetAllSellers)
		router.GET("/sellers/:id", controller.GetSellerByID)
		router.POST("/sellers", controller.CreateSeller)
		router.PUT("/sellers/:id", controller.UpdateSeller)
		router.DELETE("/sellers/:id", controller.DeleteSeller)
		sellers := r.Group("/sellers")
		{
			sellers.GET("/id/:id", controller.GetSellersByUserID)                   // ใช้สำหรับดึงข้อมูล Seller ด้วย ID
			sellers.GET("/user/:userId/exists", controller.CheckUserExistsInSeller) // ใช้สำหรับตรวจสอบว่ามี userId อยู่ใน Seller หรือไม่
		}

		// Sheet Routes
		router.GET("/sheets", controller.GetSheets)
		router.GET("/sheets/:id", controller.GetSheetByID)
		router.POST("/sheets", controller.CreateSheet)
		router.PUT("/sheets/:id", controller.UpdateSheet)
		router.DELETE("/sheets/:id", controller.DeleteSheet)
		r.GET("/courses", controller.GetCourses)
		r.POST("/upload", controller.UploadFile)
		router.GET("/sheets/seller/:sellerID", controller.GetSheetsBySellerID)
		// Route สำหรับ Cart
		router.GET("/cart-statuses", controller.GetCartStatuses)
		router.GET("/carts", controller.GetCarts)
		router.GET("/carts/:id", controller.GetCartById)
		router.POST("/cart-items", controller.AddToCart)
		router.GET("/cart-items/cart/:cart_id", controller.ListCartItems)
		router.PUT("/cart-items/:id", controller.UpdateCartItemById)
		router.DELETE("/cart-items/:id", controller.DeleteCartItemById)
		router.POST("/carts/:id/checkout", controller.CheckoutCart)
		router.GET("/carts/user/:id", controller.GetCartByUser)
		router.POST("/carts", controller.CreateOrGetCart)
		// Routes สำหรับ Review
		reviewRoutes := router.Group("/reviews")
		{
			reviewRoutes.POST("", controller.CreateReview)       // เพิ่ม Review
			reviewRoutes.GET("", controller.GetAllReviews)       // ดึงข้อมูล Review ทั้งหมด
			reviewRoutes.GET("/:id", controller.GetReviewByID)   // ดึงข้อมูล Review ตาม ID
			reviewRoutes.DELETE("/:id", controller.DeleteReview) // ลบ Review
			reviewRoutes.GET("/sheet/:sheet_id", controller.GetReviewsBySheetID)
		}

		// Assignment Routes
		router.GET("/courses/:id/assignments", controller.GetAssignmentCourseID)
		router.GET("/courses/:id/assignments/:assignment_id", controller.GetAssignmentByIDAndCourseID)
		router.POST("/assignments", controller.CreateAssignment)       // สร้าง Assignment ใหม่
		router.PUT("/assignments/:id", controller.UpdateAssignment)    // อัปเดต Assignment ตาม ID
		router.DELETE("/assignments/:id", controller.DeleteAssignment) // ลบ Assignment ตาม ID

		router.GET("/submission/:user_id/:assignment_id", controller.GetSubmissionWithAttachment)
		router.GET("/assignments/:assignment_id/submissions", controller.GetSubmissionWithAttachmentAll)
		router.POST("/submissions", controller.CreateSubmissionWithAttachment)
		router.PUT("/submissions/:id", controller.UpdateSubmissionWithAttachment)    
		router.DELETE("/submissions/:id", controller.DeleteSubmission) 
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
