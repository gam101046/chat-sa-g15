package controller

import (
	"SA-67-SongThor-SUT/config"
	"SA-67-SongThor-SUT/entity"
	"net/http"

	"github.com/gin-gonic/gin"
)

func GetSeller(c *gin.Context) {
	sellerID := c.Param("id") // รับ room_id จาก URL

	var seller []entity.Seller // สร้างตัวแปรเก็บข้อมูล Messages

	db := config.DB() // เชื่อมต่อกับฐานข้อมูล

	// ดึงข้อความทั้งหมดใน RoomChat ที่มี room_id ตามที่ระบุ
	result := db.Where("id = ?", sellerID).Find(&seller)

	// ตรวจสอบว่าพบข้อมูลหรือไม่
	if result.Error != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": result.Error.Error()})
		return
	}

	// ส่งข้อมูล Messages กลับไปในรูปแบบ JSON
	c.JSON(http.StatusOK, seller)
}

func GetMemberBySeller(c *gin.Context) {
    sellerID := c.Param("id") // รับ seller_id จาก URL

    var seller entity.Seller   // สร้างตัวแปรเก็บข้อมูล Seller

    db := config.DB()          // เชื่อมต่อกับฐานข้อมูล

    // ดึงข้อมูล Seller พร้อมกับ Member ที่สัมพันธ์กัน (Preload)
    result := db.Preload("Member").Where("id = ?", sellerID).First(&seller)

    // ตรวจสอบว่าพบข้อมูล Seller หรือไม่
    if result.Error != nil {
        c.JSON(http.StatusNotFound, gin.H{"error": "Seller not found"})
        return
    }

    // ตรวจสอบว่ามี Member ที่สัมพันธ์กันหรือไม่
    if seller.MemberID == 0 {
        c.JSON(http.StatusNotFound, gin.H{"error": "Member not found"})
        return
    }

    var member entity.Member
    db.Where("member_id = ?", seller.MemberID).First(&member)

    // ส่งข้อมูล Member กลับไปในรูปแบบ JSON
    c.JSON(http.StatusOK, member)
}


func CreateSeller(c *gin.Context) { // สร้างข้อมูลผู้ขาย
	var seller entity.Seller

	// bind เข้าตัวแปร seller
	if err := c.ShouldBindJSON(&seller); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	db := config.DB()


	// สร้าง Seller
	s := entity.Seller{
		Year:           seller.Year,
		Institute:    seller.Institute,
		Major:          seller.Major,
		PictureStudentID: seller.PictureStudentID,
		MemberID:       seller.MemberID,
	}

	// บันทึก
	if err := db.Create(&s).Error; err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusCreated, gin.H{"message": "Created success", "data": s})
}
