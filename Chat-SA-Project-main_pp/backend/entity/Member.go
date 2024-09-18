package entity


type Member struct {
    MemberID    uint `gorm:"primaryKey"` // Primary Key
    Username    string
    Password    string
    Email       string
    FirstName   string
    LastName    string
    PhoneNumber string
    Address     string
    ProfilePic  string

    // Seller    Seller     `gorm:"foreignKey:MemberID"` // ความสัมพันธ์ one-to-one กับ Seller
    RoomChats []RoomChat `gorm:"foreignKey:MemberID"` // ความสัมพันธ์ one-to-many กับ RoomChat
}