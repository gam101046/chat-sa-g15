package controller

import (
	"SA-67-SongThor-SUT/config"
	"SA-67-SongThor-SUT/entity"
	"net/http"

	"github.com/gin-gonic/gin"
)

func GetMember(c *gin.Context) {
	memberID := c.Param("member_id")
	var member []entity.Member// สร้างตัวแปรเก็บข้อมูล Messages

	db := config.DB() // เชื่อมต่อกับฐานข้อมูล

	// ดึงข้อความทั้งหมดใน RoomChat ที่มี room_id ตามที่ระบุ
	result := db.Where("member_id = ?", memberID).Find(&member)

	// ตรวจสอบว่าพบข้อมูลหรือไม่
	if result.Error != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": result.Error.Error()})
		return
	}

	// ส่งข้อมูล Messages กลับไปในรูปแบบ JSON
	c.JSON(http.StatusOK, member)
}


func CreateMember(c *gin.Context) {
	var member entity.Member


	if err := c.ShouldBindJSON(&member); err != nil { 	// ตรวจสอบการเชื่อมโยง JSON payload กับ struct Member
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})  // ส่งกลับข้อผิดพลาดหากการเชื่อมโยงไม่สำเร็จ
		return
	}

	db := config.DB()	// เชื่อมต่อกับฐานข้อมูล

	
	hashedPassword, err := config.HashPassword(member.Password) // เข้ารหัสรหัสผ่าน
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to hash password"}) // ส่งกลับข้อผิดพลาดหากการเข้ารหัสไม่สำเร็จ
		return
	}

	// สร้าง object ของ Member ใหม่ที่มีรหัสผ่านที่ถูกเข้ารหัส
	m := entity.Member{
		Username:    member.Username,
		Password:    hashedPassword,
		Email:       member.Email,
		FirstName:   member.FirstName,
		LastName:    member.LastName,
		PhoneNumber: member.PhoneNumber,
		Address:     member.Address,
		ProfilePic:  member.ProfilePic,
	}

	
	if err := db.Create(&m).Error; err != nil { // บันทึกข้อมูลสมาชิกลงในฐานข้อมูล
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	
	c.JSON(http.StatusCreated, gin.H{"message": "Created success", "data": m}) // ส่งกลับข้อความว่าสร้างสมาชิกสำเร็จพร้อมข้อมูลที่สร้าง
}