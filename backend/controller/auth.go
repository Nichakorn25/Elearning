package controller

import (
   "errors"
   "net/http"
   "github.com/gin-gonic/gin"
   "golang.org/x/crypto/bcrypt"
   "gorm.io/gorm"
   "example.com/Elearning/config"
   "example.com/Elearning/entity"
   "example.com/Elearning/services"
)
type (
    Authen struct {
        Username string `json:"username"`
        Password string `json:"password"`
        Firstname string	`json:"firstname"`
        Lastname string		`json:"lastname"`
        Email     string `json:"email"`
        Phone string	`json:"phone"`
        DepartmentID uint 		`json:"DepartmentID"`
        MajorID uint 		`json:"MajorID"`
    }
 
    signUp struct {
        Username string `json:"username"`  // แก้เป็น backticks
        Password  string `json:"password"`
        Firstname string	`json:"firstname"`
        Lastname string		`json:"lastname"`
        Email     string `json:"email"`
        Phone string	`json:"phone"`
        DepartmentID uint 		`json:"DepartmentID"`
        MajorID uint 		`json:"MajorID"`
    }

    ResetPassword struct {
        Username string `json:"username"`  // แก้เป็น backticks
        Email     string `json:"email"`
        Password  string `json:"password"`
    }
 )
 
 func ResetPasswordUser(c *gin.Context) {
    var payload ResetPassword

    // Bind JSON payload to the struct
    if err := c.ShouldBindJSON(&payload); err != nil {
        c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
        return
    }

    var user entity.User
    db := config.DB()

    // ค้นหาผู้ใช้ด้วย Username และ Email ที่ผู้ใช้กรอกเข้ามา
    result := db.Where("username = ? AND email = ?", payload.Username, payload.Email).First(&user)
    if result.Error != nil {
        if errors.Is(result.Error, gorm.ErrRecordNotFound) {
            c.JSON(http.StatusNotFound, gin.H{"error": "User not found"})
        } else {
            c.JSON(http.StatusInternalServerError, gin.H{"error": result.Error.Error()})
        }
        return
    }

    // แฮชรหัสผ่านใหม่
    hashedPassword, err := config.HashPassword(payload.Password)
    if err != nil {
        c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to hash password"})
        return
    }

    // อัปเดตรหัสผ่านในฐานข้อมูล
    user.Password = hashedPassword
    if err := db.Save(&user).Error; err != nil {
        c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to update password"})
        return
    }

    c.JSON(http.StatusOK, gin.H{"message": "Password reset successful"})
}


func SignUp(c *gin.Context) {

   var payload signUp


   // Bind JSON payload to the struct

   if err := c.ShouldBindJSON(&payload); err != nil {

       c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})

       return

   }


   db := config.DB()

   var userCheck entity.User


   // Check if the user with the provided email already exists

   result := db.Where("username = ?", payload.Username).First(&userCheck)

   if result.Error != nil && !errors.Is(result.Error, gorm.ErrRecordNotFound) {

       // If there's a database error other than "record not found"

       c.JSON(http.StatusInternalServerError, gin.H{"error": result.Error.Error()})

       return

   }


   if userCheck.ID != 0 {

       // If the user with the provided email already exists

       c.JSON(http.StatusConflict, gin.H{"error": "Username is already registered"})

       return

   }


   // Hash the user's password

   hashedPassword, _ := config.HashPassword(payload.Password)


   // Create a new user

   user := entity.User{

    Username:  payload.Username,

    Password:     hashedPassword,

    FirstName: payload.Firstname,

    LastName: payload.Lastname,

    Email: payload.Email,

    Phone: payload.Phone,

    DepartmentID: payload.DepartmentID,

    MajorID: payload.MajorID,

    RoleID: 1,

    Status: "Active",

   }
   

   // Save the user to the database

   if err := db.Create(&user).Error; err != nil {

       c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})

       return

   }


   c.JSON(http.StatusCreated, gin.H{"message": "Sign-up successful"})

}

//Sign in == login 
func SignIn(c *gin.Context) {

   var payload Authen

   var user entity.User


   if err := c.ShouldBindJSON(&payload); err != nil {

       c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})

       return

   }

   // ค้นหา user ด้วย Username ที่ผู้ใช้กรอกเข้ามา

   if err := config.DB().Raw("SELECT * FROM users WHERE username = ?", payload.Username).Scan(&user).Error; err != nil {

       c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})

       return

   }


   // ตรวจสอบรหัสผ่าน

   err := bcrypt.CompareHashAndPassword([]byte(user.Password), []byte(payload.Password))

   if err != nil {

       c.JSON(http.StatusBadRequest, gin.H{"error": "password is incerrect"})

       return

   }


   jwtWrapper := services.JwtWrapper{

       SecretKey:       "SvNQpBN8y3qlVrsGAYYWoJJk56LtzFHx",

       Issuer:          "AuthService",

       ExpirationHours: 24,

   }


   signedToken, err := jwtWrapper.GenerateToken(user.Email)

   if err != nil {

       c.JSON(http.StatusBadRequest, gin.H{"error": "error signing token"})

       return

   }


   c.JSON(http.StatusOK, gin.H{"token_type": "Bearer", "token": signedToken, "id": user.ID})


}