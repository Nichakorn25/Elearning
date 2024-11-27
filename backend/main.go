package main

import (
	"net/http"
	"github.com/gin-gonic/gin"
	"elearning/config"
	"elearning/middlewares"
	"elearning/controller"
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

	r.POST("/signup", controller.SignUp) //สมัคร
    r.POST("/signin", controller.SignIn) //Sign in == login 
    r.PUT("/ResetPasswordUser", controller.ResetPasswordUser) //Sign in == login 
	r.GET("/users/:id", controller.GetUser) //getOnlyID

	router := r.Group("")
  	{
		router.Use(middlewares.Authorizes())

		// User Routes
		router.GET("/users", controller.ListUsers) 
		//router.GET("/users/:id", user.GetUser) //getOnlyID ย้ายไปไว้ข้างนอกเพื่อให้มันเรียกใช้ในหน้า login ได้
		router.POST("/users", controller.CreateUser)
		router.PUT("/users/:id", controller.UpdateUserByid)
		router.DELETE("/users/:id", controller.DeleteUser) //ไม่ได้เรียกใช้

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
