import React from 'react';
import './test.css';
import { Avatar, message, Form, Button } from "antd";
import { useEffect, useRef, useState } from "react";
import { MessageInterface } from "../interfaces/IMessage";
import { CreateMessage, GetMember, GetMemberBySeller, GetMessage } from "../services/https";

interface Member {
  MemberID: number;
  Username: string;
  Password: string;
  Email: string;
  FirstName: string;
  LastName: string;
  PhoneNumber: string;
  Address: string;
  ProfilePic: string;
}

interface Memberbyseller {
  MemberID: number;
  Username: string;
  Password: string;
  Email: string;
  FirstName: string;
  LastName: string;
  PhoneNumber: string;
  Address: string;
  ProfilePic: string;
}

function Test() {
  const [member, setMember] = useState<Member | null>(null);
  const [memberbyseller, setMemberBySeller] = useState<Memberbyseller | null>(null);
  const [messages, setMessages] = useState<MessageInterface[]>([]);
  const [loading, setLoading] = useState(true);
  const [messageApi, contextHolder] = message.useMessage();
  const [inputMessage, setInputMessage] = useState(""); // State สำหรับข้อความที่กรอก
  const messagesEndRef = useRef<HTMLDivElement>(null); // ใช้เพื่อเลื่อนดูข้อความล่าสุด

  const roomChatID = 1; // ห้องแชทที่ใช้
  const senderID = 1; // ID ของผู้ส่งข้อความ
  const sellerID = 1; // ID ของผู้ส่งข้อความ

  const onFinish = async () => {
    if (!inputMessage.trim()) {
      messageApi.open({
        type: "error",
        content: "กรุณากรอกข้อความ",
      });
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
        messageApi.open({
          type: "success",
          content: "บันทึกข้อความสำเร็จ",
        });
        setInputMessage("");
        fetchMessages(); // ดึงข้อความใหม่หลังจากส่งข้อความ
      } else {
        messageApi.open({
          type: "error",
          content: "เกิดข้อผิดพลาด !",
        });
      }
    } catch (error) {
      messageApi.open({
        type: "error",
        content: "เกิดข้อผิดพลาดในการส่งข้อความ",
      });
    }
  };

  const fetchMessages = async () => {
    setLoading(true);
    try {
      const data = await GetMessage(roomChatID); // เรียก API เพื่อดึงข้อความ
      setMessages(Array.isArray(data) ? data : [data]);
    } catch (error) {
      messageApi.open({
        type: "error",
        content: "เกิดข้อผิดพลาดในการดึงข้อความ",
      });
    }
    setLoading(false);
  };

  const getMember = async () => {
    setLoading(true);
    try {
      const data = await GetMember(senderID);
      if (data) {
        setMember(data);
      } else {
        messageApi.open({
          type: "error",
          content: "ไม่พบข้อมูลสมาชิก",
        });
      }
    } catch (error) {
      messageApi.open({
        type: "error",
        content: "เกิดข้อผิดพลาดในการดึงข้อมูลสมาชิก",
      });
    }
    setLoading(false);
  };

  const getMemberBySeller = async () => {
    setLoading(true);
    try {
      const dataMember = await GetMemberBySeller(sellerID); // เรียก API เพื่อดึงข้อมูลของ memberbyseller
      setMemberBySeller(dataMember);
    } catch (error) {
      messageApi.open({
        type: "error",
        content: "เกิดข้อผิดพลาดในการดึงข้อมูล memberbyseller",
      });
    }
    setLoading(false);
  };

  useEffect(() => {
    getMember();
    getMemberBySeller();
    fetchMessages(); // ดึงข้อความทั้งหมดเมื่อ component ถูกโหลด
  }, []);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" }); // เลื่อนดูข้อความล่าสุด
  }, [messages]);

  // ฟังก์ชันสำหรับตรวจจับการกด Enter
  const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Enter') {
      onFinish();
    }
  };

  return (
    <div className="container">
      <div className="sidebar">
        <input type="text" placeholder="ค้นหา (3K)" />
        {memberbyseller && (
        <div className="contact">
            <Avatar src={memberbyseller.ProfilePic} alt="Contact 1" size="large" />
            <div>{memberbyseller.FirstName} {memberbyseller.LastName}</div>
            <div className="status"></div>
        </div>
        )}
        {/* เพิ่ม contacts อื่น ๆ ได้ที่นี่ */}
      </div>

      <div className="chat">
        <div className="chat-header">
          {memberbyseller && (
            <>
              <Avatar src={memberbyseller.ProfilePic} alt="Profile" size="large" />
              <div>{memberbyseller.FirstName} {memberbyseller.LastName}</div>
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
            onKeyDown={handleKeyDown} // เรียกฟังก์ชันเมื่อกดปุ่ม
            placeholder="พิมพ์ข้อความ..."
          />
          <Button
            type="primary"
            onClick={onFinish}
            style={{ marginLeft: '10px' }}
          >
            ส่ง
          </Button>
        </div>
      </div>
    </div>
  );
}

export default Test;
