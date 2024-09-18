import { Avatar, Button, message } from "antd";
import React, { useEffect, useRef, useState } from 'react';
import { MessageInterface } from "../interfaces/IMessage";
import { CreateMessage, GetMemberBySeller, GetMessage, GetRoomChatByMemberAndSellerID, RoomChatByMemberID } from "../services/https";
import './test.css';



interface MemberBySeller {
  MemberID: number;
  Username: string;
  Password: string;
  Email: string;
  FirstName: string;
  LastName: string;
  PhoneNumber: string;
  Address: string;
  ProfilePic: string;
  SellerID: string;
}

const Test: React.FC = () => {
  const [chatMembers, setChatMembers] = useState<MemberBySeller[]>([]);
  const [messages, setMessages] = useState<MessageInterface[]>([]);
  const [loading, setLoading] = useState(true);
  const [messageApi, contextHolder] = message.useMessage();
  const [inputMessage, setInputMessage] = useState("");
  const [roomChatID, setRoomChatID] = useState<number | null>(null);
  const [selectedSellerID, setSelectedSellerID] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const senderID = 2; // ID ของผู้ส่งข้อความ
  const memberID = 2; // ID ของสมาชิกที่กำลังใช้งาน

  const onFinish = async () => {
    if (!inputMessage.trim()) {
      messageApi.open({ type: "error", content: "กรุณากรอกข้อความ" });
      return;
    }

    if (roomChatID === null) {
      messageApi.open({ type: "error", content: "ไม่พบห้องแชท" });
      return;
    }

    const messageData: MessageInterface = {
      room_chat_id: roomChatID,
      content: inputMessage,
      sender_id: senderID,
    };

    try {
      const res = await CreateMessage(messageData);
      if (res) {
        messageApi.open({ type: "success", content: "บันทึกข้อความสำเร็จ" });
        setInputMessage("");
        fetchMessages();
      } else {
        messageApi.open({ type: "error", content: "เกิดข้อผิดพลาด !" });
      }
    } catch (error) {
      messageApi.open({ type: "error", content: "เกิดข้อผิดพลาดในการส่งข้อความ" });
    }
  };

  const fetchMessages = async () => {
    if (roomChatID === null) return;
    setLoading(true);
    try {
      const data = await GetMessage(roomChatID);
      setMessages(Array.isArray(data) ? data : [data]);
    } catch (error) {
      messageApi.open({ type: "error", content: "เกิดข้อผิดพลาดในการดึงข้อความ" });
    }
    setLoading(false);
  };

  const fetchChatMembers = async () => {
    setLoading(true);
    try {
      const rooms = await RoomChatByMemberID(memberID);
      const memberPromises = rooms.map(async (room: any) => {
        if (room.SellerID) {
          const sellerData = await GetMemberBySeller(room.SellerID);
          if (sellerData) {
            return { ...sellerData, SellerID: room.SellerID };
          }
        }
        return null;
      });

      const members = await Promise.all(memberPromises);
      setChatMembers(members.filter((member) => member !== null) as MemberBySeller[]);
    } catch (error) {
      messageApi.open({ type: "error", content: "เกิดข้อผิดพลาดในการดึงรายชื่อคนที่เราแชทด้วย" });
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchChatMembers();
  }, []);

  useEffect(() => {
    if (selectedSellerID) {
      fetchMessages();
    }
  }, [selectedSellerID]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleChatMemberSelect = async (sellerID: string) => {
    try {
      const room = await GetRoomChatByMemberAndSellerID(memberID, sellerID);
      if (room && room.RoomID) {
        setRoomChatID(room.RoomID);
        setSelectedSellerID(sellerID);
      } else {
        messageApi.open({ type: "error", content: "ไม่พบห้องแชท" });
      }
    } catch (error) {
      messageApi.open({ type: "error", content: "เกิดข้อผิดพลาดในการดึงข้อมูลห้องแชท" });
    }
  };

  const selectedChatMember = chatMembers.find(member => member.SellerID === selectedSellerID);

  return (
    <div className="container">
      {contextHolder}
      <div className="sidebar">
        <input type="text" placeholder="ค้นหา (3K)" />
        {chatMembers.length > 0 ? (
          chatMembers.map((chatMember) => (
            <div
              className="contact"
              key={chatMember.MemberID}
              onClick={() => handleChatMemberSelect(chatMember.SellerID)}
            >
              <Avatar src={chatMember.ProfilePic} alt={`Contact ${chatMember.MemberID}`} size="large" />
              <div>{chatMember.FirstName} {chatMember.LastName}</div>
              <div className="status"></div>
            </div>
          ))
        ) : (
          <div>ไม่มีสมาชิกที่แชทด้วย</div>
        )}
      </div>

      <div className="chat">
        <div className="chat-header">
          {selectedChatMember && (
            <>
              <Avatar src={selectedChatMember.ProfilePic} alt="Profile" size="large" />
              <div>{selectedChatMember.FirstName} {selectedChatMember.LastName}</div>
            </>
          )}
          <div className="icons">
            <i className="fas fa-phone"></i>
            <i className="fas fa-video"></i>
          </div>
        </div>

        <div className="chat-body">
          {messages.map((msg, index) => (
            <div
              key={index}
              className={`message ${msg.SenderID === senderID ? 'current-user' : 'other-user'}`}
            >
              <div className="text">{msg.Content}</div>
            </div>
          ))}
          <div ref={messagesEndRef} />
        </div>

        <div className="chat-footer">
          <input
            type="text"
            value={inputMessage}
            onChange={(e) => setInputMessage(e.target.value)}
            placeholder="พิมพ์ข้อความ..."
            onKeyDown={(e) => e.key === 'Enter' && onFinish()}
          />
          <Button type="primary" onClick={onFinish} style={{ marginLeft: '10px' }}>
            ส่ง
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Test;
