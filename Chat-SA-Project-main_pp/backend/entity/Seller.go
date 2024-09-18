package entity

import "gorm.io/gorm"


type Seller struct {
	gorm.Model             // ใช้ gorm.Model เพื่อเพิ่มฟิลด์พื้นฐาน (ID, CreatedAt, UpdatedAt, DeletedAt)

	StudentID string
	Year int
	Institute string
	Major string
	PictureStudentID string


	MemberID       uint   `gorm:"unique"`  // One-to-One relationship กับ Member
	Member   Member
}

