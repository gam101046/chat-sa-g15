import { RoomChatInterface } from "../../interfaces/IRoomChat";
import { MessageInterface } from "../../interfaces/IMessage";
// import { MemberInterface } from "../../interfaces/IMember;

const apiUrl = "http://localhost:8080";

async function CreateRoomChat(data: RoomChatInterface) {
    const requestOptions = {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    };
  
    let res = await fetch(`${apiUrl}/roomchat`, requestOptions)
      .then((res) => {
        if (res.status == 201) {
          return res.json();
        } else {
          return false;
        }
      });
  
    return res;
  }
  
  async function GetMessage(id:Number | undefined) {
    const requestOptions = {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    };
  
    let res = await fetch(`${apiUrl}/roomchat/messages/${id}`, requestOptions)
      .then((res) => {
        if (res.status == 200) {
          return res.json();
        } else {
          return false;
        }
      });
  
    return res;
  }  

  async function GetRoomChat() {
    const requestOptions = {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    };
  
    let res = await fetch(`${apiUrl}/roomchat`, requestOptions)
      .then((res) => {
        if (res.status == 200) {
          return res.json();
        } else {
          return false;
        }
      });
  
    return res;
  }  
  async function GetMember(member_id:Number | undefined) {
    const requestOptions = {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    };
  
    let res = await fetch(`${apiUrl}/member/${member_id}`, requestOptions)
      .then((res) => {
        if (res.status == 200) {
          return res.json();
        } else {
          return false;
        }
      });
  
    return res;
  }  

  async function GetSeller(seller_id:Number | undefined) {
    const requestOptions = {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    };
  
    let res = await fetch(`${apiUrl}/seller/${seller_id}`, requestOptions)
      .then((res) => {
        if (res.status == 200) {
          return res.json();
        } else {
          return false;
        }
      });
  
    return res;
  }  


  async function CreateMessage(messageData: MessageInterface) {
    try {
      // แปลงคีย์ของ messageData
      const formattedData = {
        room_chat_id: messageData.room_chat_id,
        content: messageData.content,
        sender_id: messageData.sender_id,
      };
  
      const response = await fetch(`${apiUrl}/message`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formattedData),
      });
  
      if (response.ok) {
        return await response.json();
      } else {
        console.error(`Error: ${response.statusText}`);
        return false;
      }
    } catch (error) {
      if (error instanceof Error) {
        console.error(`Error: ${error.message}`);
      } else {
        console.error("An unknown error occurred");
      }
      return false;
    }
  }
  
  async function GetMemberBySeller(seller_id: number | undefined) {
    if (seller_id === undefined) {
      console.error("Seller ID is undefined");
      return false;
    }
  
    const requestOptions: RequestInit = {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    };
  
    try {
      const response = await fetch(`${apiUrl}/memberbyseller/${seller_id}`, requestOptions);
  
      // ตรวจสอบว่าการตอบสนองถูกต้องหรือไม่
      if (!response.ok) {
        console.error("Error fetching member by seller:", response.statusText);
        return false;
      }
  
      const data = await response.json();
      return data;
    } catch (error) {
      console.error("Fetch error:", error);
      return false;
    }
  }

  async function RoomChatBySellerID(sellerID: number): Promise<any> {
    const requestOptions = {
        method: "GET",
        headers: {
            "Content-Type": "application/json",
        },
    };

    const response = await fetch(`${apiUrl}/roomchat/seller/${sellerID}`, requestOptions);

    if (response.ok) {
        return await response.json();
    } else {
        console.error(`Error: ${response.status} - ${response.statusText}`);
        return false;
    }
  }

    async function RoomChatByMemberID(memberID: number): Promise<any> {
      const requestOptions = {
          method: "GET",
          headers: {
              "Content-Type": "application/json",
          },
      };
  
      const response = await fetch(`${apiUrl}/roomchat/member/${memberID}`, requestOptions);
  
      if (response.ok) {
          return await response.json();
      } else {
          console.error(`Error: ${response.status} - ${response.statusText}`);
          return false;
      }
    }


    async function GetRoomChatByMemberAndSellerID(memberID: number, sellerID: number): Promise<any> {
      const requestOptions = {
          method: "GET",
          headers: {
              "Content-Type": "application/json",
          },
      };
  
      // ปรับ URL ให้ถูกต้อง
      const response = await fetch(`${apiUrl}/roomchat/${memberID}/${sellerID}`, requestOptions);
  
      if (response.ok) {
          return await response.json();
      } else {
          console.error(`Error: ${response.status} - ${response.statusText}`);
          return false;
      }
  }


  
  


  export {
    GetRoomChatByMemberAndSellerID,
    RoomChatByMemberID,
    CreateMessage,
    RoomChatBySellerID,
    CreateRoomChat,
    GetMessage,
    GetRoomChat,
    GetMember,
    GetSeller,
    GetMemberBySeller
  };

