import React, { useState, useEffect, useRef, useContext } from "react";
import {
    Container,
    Row,
    Col,
    Card,
    Form,
    InputGroup,
    Badge,
    Image,
    Button,
} from "react-bootstrap";
import api from "../../api/axios";
import { AuthContext } from "../../context/AuthContext";
import io from "socket.io-client";
import { useParams } from "react-router-dom";

const SOCKET_URL = import.meta.env.VITE_SOCKET_URL;

const ExhibitorChat = () => {
    const { expoId } = useParams();
    const { user } = useContext(AuthContext);
    const [chatList, setChatList] = useState([]);
    const [selectedChat, setSelectedChat] = useState(null);
    const [messages, setMessages] = useState([]);
    const [newMessage, setNewMessage] = useState("");
    const [socket, setSocket] = useState(null);
    const messagesEndRef = useRef(null);

    // ------------------ SOCKET CONNECTION ------------------  
    const socketRef = useRef(null);
    useEffect(() => {
        if (!user || !user.id || socketRef.current) return; // Only once

        const s = io(SOCKET_URL, { query: { userId: user.id } });
        socketRef.current = s;

        if (expoId) {
            s.emit("joinExpo", { userId: user.id, expoId });
        }

        s.on("receiveMessage", (msg) => {
            const senderId = msg.sender._id || msg.sender;
            const receiverId = msg.receiver._id || msg.receiver;

            if (senderId === user.id) return;

            setMessages((prev) => {
                // Only add if not already exists
                if (prev.some((m) => m._id === msg._id)) return prev;

                // Check if message belongs to selected chat
                if (selectedChat && (senderId === selectedChat.user._id || receiverId === selectedChat.user._id)) {
                    const fixedMsg = {
                        ...msg,
                        sender: typeof msg.sender === "string" ? { _id: msg.sender, ...user } : msg.sender,
                    };
                    if (receiverId === user.id) markAsDelivered([msg._id], senderId);
                    return [...prev, fixedMsg];
                } else {
                    // Update chat badge if not the current chat
                    setChatList((prevList) =>
                        prevList.map((c) =>
                            c.user._id === senderId
                                ? { ...c, badge: (c.badge || 0) + 1, lastMessage: msg.content }
                                : c
                        )
                    );
                    return prev;
                }
            });
        });

        s.on("messagesDelivered", (messageIds) => {
            setMessages((prev) =>
                prev.map((m) =>
                    messageIds.includes(m._id) ? { ...m, delivered: true } : m
                )
            );
        });

        s.on("messagesSeen", (messageIds) => {
            setMessages((prev) =>
                prev.map((m) =>
                    messageIds.includes(m._id) ? { ...m, seen: true, unread: false } : m
                )
            );
        });

        return () => s.disconnect();
    }, [user, expoId]);
    // ------------------ FETCH CHAT LIST ------------------  
    useEffect(() => {
        const fetchChats = async () => {
            if (!expoId || !user || !user.id) return;

            try {
                const expoRes = await api.get(`/expos/${expoId}`);
                if (!expoRes.data.status) return;
                const expo = expoRes.data.expo;

                const orgRes = await api.get(`/auth/role/organizer`);
                const organizers = orgRes.data.users || [];

                const exhibitorRes = await api.get(`/exhibitors/expo/${expoId}`);
                const approvedExhibitors = exhibitorRes.data.exhibitors
                    .filter((ex) => ex.status === "approved" && ex.user._id !== user.id)
                    .map((ex) => ex.user);

                const participants = [...organizers, ...approvedExhibitors];

                const chats = await Promise.all(
                    participants.map(async (participant) => {
                        if (!participant || !participant._id)
                            return { user: participant, lastMessage: "", badge: 0 };

                        const lastMsgRes = await api.get(
                            `/messages/conversation?user1=${user.id}&user2=${participant._id}&expo=${expoId}`
                        );

                        const allMessages = lastMsgRes.data.messages || [];
                        const lastMsg = allMessages[allMessages.length - 1]?.content || "";

                        const unreadRes = await api.get(
                            `/messages/unread-count?userId=${user.id}&expo=${expoId}&senderId=${participant._id}`
                        );
                        const unreadCount = unreadRes.data.unreadCount || 0;

                        return { user: participant, lastMessage: lastMsg, badge: unreadCount };
                    })
                );

                setChatList(chats);
            } catch (err) {
                console.error("Fetch chats error:", err);
            }
        };

        fetchChats();
    }, [expoId, user.id]);

    // ------------------ SELECT CHAT ------------------  
    const selectChat = async (chat) => {
        setSelectedChat(chat);

        if (!chat || !chat.user || !chat.user._id) return;

        try {
            const { data } = await api.get(
                `/messages/conversation?user1=${user.id}&user2=${chat.user._id}&expo=${expoId}`
            );

            if (data.status) {
                setMessages(data.messages);

                const unseenIds = data.messages
                    .filter((m) => m.receiver._id === user.id && !m.seen)
                    .map((m) => m._id);

                if (unseenIds.length) markAsSeen(unseenIds, chat.user._id);
            }

            setChatList((prev) =>
                prev.map((c) => (c.user._id === chat.user._id ? { ...c, badge: 0 } : c))
            );
        } catch (err) {
            console.error("Select chat error:", err);
        }
    };

    // ------------------ SEND MESSAGE ------------------  
    const sendMessage = async () => {
        if (!newMessage.trim()) return;
        if (!selectedChat || !selectedChat.user || !selectedChat.user._id) return;

        try {
            const { data } = await api.post("/messages", {
                sender: user.id,
                receiver: selectedChat.user._id,
                expo: expoId,
                content: newMessage,
            });

            if (data.status) {
                const sentMessage = {
                    ...data.data,
                    sender: {
                        _id: user.id,
                        firstName: user.firstName,
                        lastName: user.lastName,
                        avatar: user.avatar,
                        role: user.role,
                    },
                };

                setMessages((prev) => {
                    if (prev.some((m) => m._id === sentMessage._id)) return prev;
                    return [...prev, sentMessage];
                });

                if (socket) socket.emit("sendMessage", sentMessage);

                setNewMessage("");
            }
        } catch (err) {
            console.error("Send message error:", err);
        }
    };

    // ------------------ MARK DELIVERED ------------------  
    const markAsDelivered = async (messageIds, senderId) => {
        if (!messageIds.length || !senderId) return;

        try {
            await api.put("/messages/delivered", { messageIds, userId: user.id });

            if (socket) {
                socket.emit("markDelivered", { messageIds, userId: user.id, senderId });
            }
        } catch (err) {
            console.error("Mark delivered error:", err);
        }
    };

    // ------------------ MARK SEEN ------------------  
    const markAsSeen = async (messageIds, senderId) => {
        if (!messageIds.length || !senderId) return;

        try {
            await api.put("/messages/seen", { messageIds, userId: user.id });

            if (socket) {
                socket.emit("markSeen", { messageIds, userId: user.id, senderId });
            }
        } catch (err) {
            console.error("Mark seen error:", err);
        }
    };

    // ------------------ AUTO SCROLL ------------------  
    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [messages]);

    // ------------------ HANDLE ENTER ------------------  
    const handleKeyDown = (e) => {
        if (e.key === "Enter" && !e.shiftKey) {
            e.preventDefault();
            sendMessage();
        }
    };

    return (
        <div className="exhibitor-chat-page">
            <h4 className="fw-semibold text-secondary mb-4">
                Start a Conversation with the Organizer or Other Exhibitors
            </h4>
            <Container fluid className="py-1">
                <Row>
                    <Col md={12}>
                        <Card id="chat3" style={{ borderRadius: "15px", height: "100%" }}>
                            <Card.Body>
                                <Row>
                                    {/* LEFT CHAT LIST */}
                                    <Col md={6} lg={5} xl={4} className="mb-4 mb-md-0">
                                        <div className="p-3">
                                            <InputGroup className="rounded mb-3">
                                                <Form.Control placeholder="Search" type="search" className="rounded" />
                                                <InputGroup.Text className="border-0">
                                                    <i className="fas fa-search"></i>
                                                </InputGroup.Text>
                                            </InputGroup>
                                            <div style={{ position: "relative", height: "600px", overflowY: "auto" }}>
                                                <ul className="list-unstyled mb-0">
                                                    {chatList.map((chat, idx) => (
                                                        <li
                                                            className="p-2 border-bottom chat-list"
                                                            key={idx}
                                                            onClick={() => selectChat(chat)}
                                                            style={{ cursor: "pointer" }}
                                                        >
                                                            <div className="d-flex justify-content-between text-dark">
                                                                <div className="d-flex flex-row">
                                                                    <div className="position-relative">
                                                                        <Image
                                                                            src={chat.user.avatar || "https://mdbcdn.b-cdn.net/img/Photos/new-templates/bootstrap-chat/ava1-bg.webp"}
                                                                            roundedCircle
                                                                            width={60}
                                                                            className="me-3"
                                                                        />
                                                                    </div>
                                                                    <div className="pt-1">
                                                                        <p className="fw-bold mb-0">
                                                                            {chat.user.firstName}&nbsp;{chat.user.lastName} ({chat.user.role})
                                                                        </p>
                                                                        <p className="small text-muted">{chat.lastMessage}</p>
                                                                    </div>
                                                                </div>
                                                                <div className="pt-1 text-end">
                                                                    {chat.badge > 0 && <Badge bg="danger" pill>{chat.badge}</Badge>}
                                                                </div>
                                                            </div>
                                                        </li>
                                                    ))}
                                                </ul>
                                            </div>
                                        </div>
                                    </Col>

                                    {/* RIGHT CHAT PANEL */}
                                    <Col md={6} lg={7} xl={8}>
                                        <div style={{ position: "relative", height: "600px", overflowY: "auto", paddingTop: "1rem", paddingRight: "1rem" }}>
                                            {messages.map((msg, idx) => (
                                                <div
                                                    key={idx}
                                                    className={`d-flex flex-row justify-content-${msg.sender._id === user.id ? "end" : "start"} mb-3`}
                                                >
                                                    {msg.sender._id !== user.id && (
                                                        <Image
                                                            src={msg.sender.avatar || "https://mdbcdn.b-cdn.net/img/Photos/new-templates/bootstrap-chat/ava6-bg.webp"}
                                                            roundedCircle
                                                            width={45}
                                                            className="me-2"
                                                        />
                                                    )}
                                                    <div>
                                                        <p className={`small p-2 mb-1 rounded-3 ${msg.sender._id === user.id ? "text-white bg-primary" : "bg-light text-dark"}`}>
                                                            {msg.content}
                                                        </p>
                                                        <p className={`small mb-3 rounded-3 text-muted ${msg.sender._id === user.id ? "text-end" : ""}`}>
                                                            {new Date(msg.createdAt).toLocaleTimeString()} | {new Date(msg.createdAt).toLocaleDateString()}
                                                            {msg.sender._id === user.id && (
                                                                <span className="ms-1">{msg.seen ? "Seen" : msg.delivered ? "Delivered" : "Sent"}</span>
                                                            )}
                                                        </p>
                                                    </div>
                                                    {msg.sender._id === user.id && (
                                                        <Image
                                                            src={msg.sender.avatar || "https://mdbcdn.b-cdn.net/img/Photos/new-templates/bootstrap-chat/ava1-bg.webp"}
                                                            roundedCircle
                                                            width={45}
                                                            className="ms-2"
                                                        />
                                                    )}
                                                </div>
                                            ))}
                                            <div ref={messagesEndRef}></div>
                                        </div>

                                        {/* Message Input */}
                                        <div className="text-muted d-flex justify-content-start align-items-center pe-3 pt-3 mt-2">
                                            <Image
                                                src={user.avatar || "https://mdbcdn.b-cdn.net/img/Photos/new-templates/bootstrap-chat/ava6-bg.webp"}
                                                roundedCircle
                                                width={40}
                                                className="me-2"
                                            />
                                            <Form.Control
                                                as="textarea"
                                                placeholder={selectedChat ? "Type message" : "Select a chat to start messaging..."}
                                                className="message"
                                                value={newMessage}
                                                onChange={(e) => setNewMessage(e.target.value)}
                                                onKeyDown={handleKeyDown}
                                                disabled={!selectedChat}
                                            />
                                            <Button
                                                type="button"
                                                variant="link"
                                                className="send ms-2 fs-small p-2 bg-primary"
                                                onClick={sendMessage}
                                                disabled={!selectedChat || !newMessage.trim()}
                                            >
                                                <i className="bi bi-send-fill"></i>
                                            </Button>
                                        </div>
                                    </Col>
                                </Row>
                            </Card.Body>
                        </Card>
                    </Col>
                </Row>
            </Container>

            <style>{`  
    .send{ color: #fff !important; border-radius: 50%; }  
    .send:hover{ background-color: #0b4baaff !important; border-radius: 50%; }  
    .message{ height: 20px; }  
    .message:focus{ height: 160px; max-height: 170px; }  
    .chat-list{ transition: all 0.2s ease; }  
    .chat-list:hover{ background-color: #ddddddd0 !important; }  
`}</style>
        </div>
    );

};

export default ExhibitorChat;