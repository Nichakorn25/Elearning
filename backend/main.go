package main

import (
	"net/http"

	"example.com/Elearning/config"
	"example.com/Elearning/controller"
	"example.com/Elearning/middlewares"
	"github.com/gin-gonic/gin"
)

func main() {

	// open connection database

	config.ConnectionDB()

	// Generate databases

	config.SetupDatabase()

	r := gin.Default()
	r.Static("/file_teacher", "./file_teacher")
	r.Use(CORSMiddleware())
	r.Static("/uploads", "./public/uploads")
	r.Static("/worker", "./public/worker")
	r.Static("/Uploads", "./uploads")

	// Auth Route
	r.GET("/departments", controller.GetDepartments)
	r.GET("/majors/:id", controller.GetMajorsByDepartment) // รับ ID ของ Department

	r.POST("/signup", controller.SignUp)                      //สมัคร
	r.POST("/signin", controller.SignIn)                      //Sign in == login
	r.PUT("/ResetPasswordUser", controller.ResetPasswordUser) //Sign in == login
	r.GET("/users/:id", controller.GetUser)                   //getOnlyID

	router := r.Group("")
	{
		router.Use(middlewares.Authorizes())

		// User Routes
		router.GET("/users", controller.ListUsers)
		router.GET("/users/filter", controller.ListUsersFilters)
		//router.GET("/users/:id", user.GetUser) //getOnlyID ย้ายไปไว้ข้างนอกเพื่อให้มันเรียกใช้ในหน้า login ได้
		router.POST("/users", controller.CreateUser)
		router.PUT("/users/:id", controller.UpdateUserByid)
		router.DELETE("/users/:id", controller.DeleteUser) //ไม่ได้เรียกใช้
		router.GET("/category", controller.GetCategory)

		// Announcement Routes
		router.GET("/announcements", controller.ListAnnouncements)
		router.GET("/announcements/:id", controller.GetAnnouncement)
		router.POST("/announcements", controller.CreateAnnouncement)
		router.PUT("/announcements/:id", controller.UpdateAnnouncement)
		router.DELETE("/announcements/:id", controller.DeleteAnnouncement)

		//RequestChangeRole
		router.POST("/requestchangeroles", controller.CreateRoleChangeRequests)
		router.GET("/requestchangeroles", controller.GetRoleChangeRequests)
		router.PATCH("/requestchangeroles/:id", controller.UpdateRoleChangeRequestsByID)
		router.PATCH("/users/role/:id", controller.UpdateUserRoleByID)

		//TransactionLog
		router.GET("/transactionlogs", controller.GetTransactionLog)
		router.PATCH("/transactionlogs/:id", controller.UpdateTransactionLogStatus)
		router.GET("/createcourse/GetSemester", controller.GetSemester)
		router.GET("/managecourse/course", controller.GetCourse)
		router.PUT("/managecourse/editexam/:id", controller.UpdateCourseExam)

		// CreateCourse Routers
		router.GET("/createcourse/:id", controller.GetCoursesByUserID)
		router.GET("/createcourse/category/:id", controller.GetCategoryByID)
		router.GET("/createcourse/category", controller.GetCetagory)
		router.GET("/createcourse/dayofweek", controller.GetDayOfWeek)
		router.POST("/createcourse/semester", controller.CreateSemester)
		router.POST("/createcourse/course", controller.CreateCourse)
		router.GET("/createcourse/GetSemesterID", controller.GetSemesterID)
		router.POST("/createcourse/studytime", controller.CreateStudyTime)
		router.GET("/createcourse/getcoures", controller.GetCourseByDESC)
		router.GET("/managecourse/:id", controller.GetCoursesByID)
		router.POST("/managecourse/lesson", controller.CreateLesson)
		router.POST("/managecourse/content", controller.CreateCourseContent)
		router.POST("/managecourse/video", controller.CreateCourseVideo)
		router.POST("/managecourse/material", controller.CreateMaterial)
		router.GET("/managecourse/lesson/:id", controller.GetLessonByCourseID)
		router.GET("/managecourse/content/:id", controller.GetCourseContent)
		router.GET("/managecourse/url/:id", controller.GetCourseUrl)
		router.GET("/managecourse/material/:id", controller.GetCourseMaterial)
		router.POST("/createcourse/picture", controller.UploadPicture)
		router.GET("/createcourse/picture", controller.GetPicture)
		router.GET("/createcourse/course", controller.GetAllCourse)
		router.DELETE("/managecourse/delete/:id", controller.DeleteAllaboutCoures)
		router.PUT("/managecourse/edit/:id", controller.UpdateCourse)
		router.DELETE("/managecourse/delete/content/:id", controller.DeleteCourseContent)
		router.DELETE("/managecourse/delete/url/:id", controller.DeleteCourseVideo)
		router.DELETE("/managecourse/delete/material/:id", controller.DeleteCourseMaterial)
		router.DELETE("/managecourse/delete/lesson/:id", controller.DeleteLesson)
		router.GET("/managecourse/studytime/:id", controller.GetCourseStudytime)
		router.PUT("/managecourse/updateStatus/material/:id", controller.UpdateMaterial)
		router.PUT("/managecourse/updateStatus/content/:id", controller.UpdateContent)
		router.PUT("/managecourse/updateStatus/url/:id", controller.UpdateUrl)
		router.PUT("/createcourse/updateStatus/:id", controller.UpdateStatusCourse)
		router.GET("/dashboard/:id", controller.GetEnrollByUserID)
		router.GET("/dashboard/info/:id", controller.GetCourseEnrollUserDepartmentSemester)
		router.GET("/dashboard/course", controller.GetCourseAndUsername)
		router.GET("/dashboard/user", controller.GetAllUser)
		router.POST("/dashboard/enroll", controller.CreateEnroll)
		router.GET("/dashboard/departmentCourse/:id", controller.GetAllCourseDepartment)
		router.GET("/dashboard/user/:id", controller.GetUserInfo)
		router.GET("/dashboard/enrollUser/:id", controller.GetEnrollUserID)
		router.DELETE("/dashboard/delete/enroll/:id", controller.Unenroll)
		router.PUT("/managecourse/edit/content/:id", controller.UpdateEditContent)
		router.PUT("/managecourse/edit/url/:id", controller.UpdateEditUrl)
		router.PUT("/managecourse/edit/lesson/:id", controller.UpdateEditLesson)
		router.GET("/managecourse/studytime/add/:id", controller.GetStudytimeByID)
		router.DELETE("/managecourse/delete/file/:id", controller.DeleteFile)

		//Appointment
		router.GET("/student/bookings", controller.ListStudentBookingByID)
		router.GET("/message/:teacherId", controller.GetBookingStudent)
		router.POST("/appointments", controller.CreateTeacherAppointment)
		router.GET("/searchProfessors", controller.SearchProfessors)
		// Teacher Routes
		router.GET("/teacher/appointments/:userId", controller.GetTeacherAppointmentsByUserID)
		router.DELETE("/teacher-appointments/:id", controller.DeleteTeacherAppointment)
		router.GET("/day", controller.ListDays)
		router.POST("/teacher/appointments", controller.CreateTeacherAppointment)
		router.POST("/CreateStudentBooking", controller.CreateStudentBooking)

		// Student Routes
		router.GET("/appointments/:teacherId", controller.GetAppointmentsForStudent)
		router.POST("/bookings", controller.BookAppointment)
		router.GET("/bookings/student/:studentId", controller.GetStudentBookingsByStudentID)
		router.DELETE("/bookings/:bookingId", controller.DeleteStudentBookingByID)

		//Task
		router.POST("/tasks", controller.CreateTask)       // สร้าง Task
		router.GET("/tasks/:userId", controller.GetTasksByUserID)    // ดึง Task ทั้งหมดของ User ที่ล็อกอิน
		// router.PUT("/tasks/:id", controller.UpdateTask)    // อัปเดต Task
		router.DELETE("/tasks/:id", controller.DeleteTaskByID) // ลบ Task
		//===================================================================================================//

		//Planner
		// Routes สำหรับการค้นหาและจัดการข้อมูล Courses
		// router.GET("/searchCourses", controller.SearchCourses)                         // ค้นหารายวิชา
		router.GET("/courses/search/:id", controller.SearchCoursesByTerm)
		router.GET("/courses/:id/study-time", controller.GetStudyTimeByCourseId)       // ดึงเวลาเรียนของรายวิชา
		router.GET("/courses/:id/exam-schedule", controller.GetExamScheduleByCourseId) // ดึงตารางสอบของรายวิชา

		// Routes สำหรับการจัดการตารางเรียน
		router.POST("/class-schedule", controller.AddCourseToSchedule)            // เพิ่มรายวิชาในตารางเรียน
		router.DELETE("/class-schedule/:id", controller.RemoveCourseFromSchedule) // ลบรายวิชาออกจากตารางเรียน

		router.GET("/classschedule/:userID", controller.GetClassScheduleByUserID)
		router.POST("/classschedule", controller.AddClassSchedule)
		router.DELETE("/classschedule/course/:courseID", controller.RemoveClassScheduleByCourseID)

		// SellerBankAccount Routes
		router.GET("/seller-bank-accounts", controller.GetAllSellerBankAccounts)
		router.GET("/seller-bank-accounts/:id", controller.GetSellerBankAccountByID)
		router.GET("/seller-bank-accounts/user/:userID", controller.GetSellerBankAccountsByUserID) // Route ใหม่
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
		router.GET("/terms", controller.GetTerms)
		router.GET("/courses", controller.GetCourses)
		router.POST("/upload", controller.UploadFile)
		router.GET("/sheets/seller/:sellerID", controller.GetSheetsBySellerID)
		router.GET("/purchased-files/:userID", controller.GetPurchasedFiles)
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
		router.GET("/income-history/:sellerID", controller.GetIncomeHistoryBySellerID)
		// Routes สำหรับ Review
		reviewRoutes := router.Group("/reviews")
		{
			reviewRoutes.POST("", controller.CreateReview)       // เพิ่ม Review
			reviewRoutes.GET("", controller.GetAllReviews)       // ดึงข้อมูล Review ทั้งหมด
			reviewRoutes.GET("/:id", controller.GetReviewByID)   // ดึงข้อมูล Review ตาม ID
			reviewRoutes.DELETE("/:id", controller.DeleteReview) // ลบ Review
			reviewRoutes.GET("/sheet/:sheet_id", controller.GetReviewsBySheetID)
		}
		routes := router.Group("/payment-methods")
		{
			routes.GET("/", controller.GetAllPaymentMethods)      // ดึงข้อมูล Payment Methods ทั้งหมด
			routes.POST("/", controller.CreatePaymentMethod)      // เพิ่ม Payment Method ใหม่
			routes.PUT("/:id", controller.UpdatePaymentMethod)    // แก้ไข Payment Method
			routes.DELETE("/:id", controller.DeletePaymentMethod) // ลบ Payment Method
		}

		r.GET("/courses/:id/assignments", controller.GetAssignmentCourseID)
		r.GET("/courses/:id/assignments/:assignment_id", controller.GetAssignmentByIDAndCourseID)
		r.POST("/assignments", controller.CreateAssignment)
		r.PUT("/assignments/:id", controller.UpdateAssignment)
		r.DELETE("/assignments/:id", controller.DeleteAssignment)

		r.GET("/submissions/:user_id/:assignment_id", controller.GetSubmission)
		r.GET("/submissions/assignments/:assignment_id", controller.GetSubmissionAll)
		r.POST("/submissions", controller.CreateSubmission)
		r.PUT("/submissions/:id", controller.UpdateSubmission)
		r.DELETE("/submissions/:id", controller.DeleteSubmission)

		r.GET("/grades/:submission_id", controller.GetGrade)
		r.GET("/grades/assignments/:assignment_id", controller.GetGradesAll)
		r.POST("/grades", controller.CreateGrade)
		r.PUT("/grades/:id", controller.UpdateGrade)

		// r.GET("/grades/:submission_id", controller.GetGrade)
		// r.GET("/grades/assignments/:assignment_id", controller.GetGradesAll)
		// r.POST("/grades", controller.CreateGrade)
		// r.PUT("/grades/:id", controller.UpdateGrade)

		r.GET("/courses/:id/tests", controller.GetTest)
		r.POST("/tests", controller.CreateTest)
		r.PUT("/tests/:id", controller.UpdateTest)
		r.DELETE("/tests/:id", controller.DeleteTest) 

		r.GET("/answerstudents/:user_id/:test_id", controller.GetStudentAnswersWithScore)
		r.POST("/answerstudents", controller.CreateAnswerStudent)
	}

	r.GET("/", func(c *gin.Context) {

		c.String(http.StatusOK, "API RUNNING...")

	})

	// Run the server

	r.Run()

}

func CORSMiddleware() gin.HandlerFunc {

	return func(c *gin.Context) {

		c.Writer.Header().Set("Access-Control-Allow-Origin", "*")

		c.Writer.Header().Set("Access-Control-Allow-Credentials", "true")

		c.Writer.Header().Set("Access-Control-Allow-Headers", "Content-Type, Content-Length, Accept-Encoding, X-CSRF-Token, Authorization, accept, origin, Cache-Control, X-Requested-With")

		c.Writer.Header().Set("Access-Control-Allow-Methods", "POST, OPTIONS, GET, PUT, DELETE, PATCH")

		if c.Request.Method == "OPTIONS" {

			c.AbortWithStatus(204)

			return

		}

		c.Next()

	}

}