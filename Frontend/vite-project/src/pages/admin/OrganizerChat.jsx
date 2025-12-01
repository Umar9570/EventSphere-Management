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
import tinycolor from "tinycolor2";

const SOCKET_URL = import.meta.env.VITE_SOCKET_URL;

const colors = [
    "#f44336",
    "#e91e63",
    "#9c27b0",
    "#673ab7",
    "#3f51b5",
    "#2196f3",
    "#03a9f4",
    "#00bcd4",
    "#009688",
    "#4caf50",
    "#8bc34a",
    "#cddc39",
    "#ffeb3b",
    "#ffc107",
    "#ff9800",
    "#ff5722",
];

const stringToColor = (str) => {
    if (!str) return colors[0];
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
        hash = str.charCodeAt(i) + ((hash << 5) - hash);
    }
    const index = Math.abs(hash) % colors.length;
    return colors[index];
};

const Avatar = ({ user, size = 45, className = "", ...props }) => {
    if (user.avatar) {
        return (
            <Image
                src={user.avatar}
                roundedCircle
                width={size}
                height={size}
                className={className}
                style={{ objectFit: "cover" }}
                {...props}
            />
        );
    }

    const initials = `${user.firstName?.[0] || ""}${user.lastName?.[0] || ""}`.toUpperCase();
    const baseColor = stringToColor(user.firstName || user.lastName || "");
    const bgColor = tinycolor(baseColor).darken(20).toString();
    const textColor = tinycolor(baseColor).lighten(30).toString();

    return (
        <div
            className={`rounded-circle d-flex align-items-center justify-content-center ${className}`}
            style={{
                width: size,
                height: size,
                backgroundColor: bgColor,
                color: textColor,
                fontWeight: "bold",
                fontSize: size / 2.5,
                flexShrink: 0,
            }}
            {...props}
        >
            {initials}
        </div>
    );
};

const OrganizerChat = () => {
    const { expoId } = useParams();
    const { user } = useContext(AuthContext);
    const [chatList, setChatList] = useState([]);
    const [selectedChat, setSelectedChat] = useState(null);
    const [messages, setMessages] = useState([]);
    const [newMessage, setNewMessage] = useState("");
    const messagesEndRef = useRef(null);
    const selectedChatRef = useRef(null);
    const socketRef = useRef(null);
    const hasConnected = useRef(false);

    // ------------------ SOCKET CONNECTION ------------------
    useEffect(() => {
        if (!user || !user.id || hasConnected.current) return;

        const s = io(SOCKET_URL, { query: { userId: user.id } });
        hasConnected.current = true;
        socketRef.current = s;

        // ---------------- JOIN CURRENT EXPO ROOM ----------------
        if (expoId && expoId !== "undefined") {
            s.emit("joinExpo", { userId: user.id, expoId });
        }

        // ---------------- JOIN ALL EXPO ROOMS FOR ORGANIZER ----------------
        if (user.role === "organizer") {
            const joinAllExpos = async () => {
                try {
                    const res = await api.get(`/expos/all-for-organizer/${user.id}`);
                    const expos = Array.isArray(res.data.expos) ? res.data.expos : [];
                    expos.forEach((expo) => {
                        if (expo._id) s.emit("joinExpo", { userId: user.id, expoId: expo._id });
                    });
                } catch (err) {
                    console.error(err);
                }
            };
            joinAllExpos();
        }

        // ---------------- RECEIVE MESSAGE ----------------
        s.on("receiveMessage", (msg) => {
            const senderId = msg.sender._id || msg.sender;
            if (senderId === user.id) return;

            // Update chat list badges and last message
            setChatList((prevList) =>
                prevList.map((c) =>
                    c.user._id === senderId
                        ? {
                            ...c,
                            lastMessage: msg.content,
                            badge: selectedChatRef.current?.user._id === senderId ? 0 : c.badge + 1,
                        }
                        : c
                )
            );

            // Update messages array if current chat is selected
            if (selectedChatRef.current?.user._id === senderId) {
                const fixedMsg = {
                    ...msg,
                    sender:
                        typeof msg.sender === "string"
                            ? {
                                _id: msg.sender,
                                firstName: msg.senderFirstName || "",
                                lastName: msg.senderLastName || "",
                                avatar: msg.senderAvatar || "",
                            }
                            : msg.sender,
                };
                setMessages((prev) => [...prev, fixedMsg]);

                // Mark as delivered and seen
                markAsDelivered([msg._id], senderId);
                markAsSeen([msg._id], senderId);
            } else {
                markAsDelivered([msg._id], senderId);
            }
        });

        // ---------------- MESSAGES DELIVERED ----------------
        s.on("messagesDelivered", (messageIds) => {
            setMessages((prev) => {
                const updated = prev.map((m) =>
                    messageIds.includes(m._id) ? { ...m, delivered: true } : m
                );
                // In case some messages are missing from state
                messageIds.forEach((id) => {
                    if (!updated.some((m) => m._id === id)) {
                        updated.push({ _id: id, delivered: true });
                    }
                });
                return updated;
            });
        });

        // ---------------- MESSAGES SEEN ----------------
        s.on("messagesSeen", (messageIds) => {
            setMessages((prev) =>
                prev.map((m) =>
                    messageIds.includes(m._id) ? { ...m, seen: true, unread: false } : m
                )
            );
        });

        return () => {
            s.disconnect();
            hasConnected.current = false;
        };
    }, [user, expoId]);

    // ------------------ FETCH CHAT LIST ------------------
    useEffect(() => {
        const fetchChats = async () => {
            if (!user || !user.id) return;

            try {
                const res = await api.get(`/exhibitors/all-for-organizer/${user.id}`);

                const approvedExhibitors = Array.isArray(res.data.participants)
                    ? res.data.participants
                    : [];

                if (!approvedExhibitors.length) {
                    setChatList([]);
                    return;
                }

                // safe expo param
                const expoParam = expoId && expoId !== "undefined" ? expoId : undefined;

                const chats = await Promise.all(
                    approvedExhibitors.map(async (participant) => {
                        if (!participant || !participant._id)
                            return { user: participant, lastMessage: "", badge: 0 };

                        // Fetch last message
                        const lastMsgRes = await api.get(
                            `/messages/conversation?user1=${user.id}&user2=${participant._id}${expoParam ? `&expo=${expoParam}` : ""}`
                        );
                        const allMessages = lastMsgRes.data.messages || [];
                        const lastMsg = allMessages[allMessages.length - 1]?.content || "";

                        // Fetch unread count
                        const unreadRes = await api.get(
                            `/messages/unread-count?userId=${user.id}${expoParam ? `&expo=${expoParam}` : ""}&senderId=${participant._id}`
                        );
                        const unreadCount = unreadRes.data.unreadCount || 0;

                        return { user: participant, lastMessage: lastMsg, badge: unreadCount };
                    })
                );

                setChatList(chats);
            } catch (err) {
                console.error("Fetch chats error:", err);
                setChatList([]);
            }
        };

        fetchChats();
    }, [expoId, user.id]);

    // ------------------ SELECT CHAT ------------------
    const selectChat = async (chat) => {
        setSelectedChat(chat);
        selectedChatRef.current = chat;

        if (!chat || !chat.user || !chat.user._id) return;

        try {
            const expoParam = expoId && expoId !== "undefined" ? expoId : undefined;

            const { data } = await api.get(
                `/messages/conversation?user1=${user.id}&user2=${chat.user._id}${expoParam ? `&expo=${expoParam}` : ""}`
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
            // Build payload
            const payload = {
                sender: user.id,
                receiver: selectedChat.user._id,
                content: newMessage,
            };

            // Only send expo if user is not organizer
            if (user.role !== "organizer" && expoId && expoId !== "undefined") {
                payload.expo = expoId;
            }

            // Send message to backend
            const { data } = await api.post("/messages", payload);

            if (data.status && data.data) {
                const sentMessage = {
                    ...data.data,
                    sender: {
                        _id: user.id,
                        firstName: user.firstName,
                        lastName: user.lastName,
                        avatar: user.avatar,
                        role: user.role,
                    },
                    receiver: selectedChat.user,
                };

                // Update local messages
                setMessages((prev) => {
                    if (prev.some((m) => m._id === sentMessage._id)) return prev;
                    return [...prev, sentMessage];
                });

                setChatList((prev) =>
                    prev.map((c) =>
                        c.user._id === selectedChat.user._id
                            ? { ...c, lastMessage: sentMessage.content }
                            : c
                    )
                );

                // Emit socket
                if (socketRef.current) {
                    socketRef.current.emit("sendMessage", sentMessage);
                }

                setNewMessage("");
            }
        } catch (err) {
            console.error("Send message error:", err);
        }
    };

    const markAsDelivered = async (messageIds, senderId) => {
        if (!messageIds.length || !senderId) return;

        try {
            await api.put("/messages/delivered", { messageIds, userId: user.id });
            if (socketRef.current) {
                socketRef.current.emit("markDelivered", { messageIds, userId: user.id, senderId });
            }
        } catch (err) {
            console.error("Mark delivered error:", err);
        }
    };

    const markAsSeen = async (messageIds, senderId) => {
        if (!messageIds.length || !senderId) return;

        try {
            await api.put("/messages/seen", { messageIds, userId: user.id });
            if (socketRef.current) {
                socketRef.current.emit("markSeen", { messageIds, userId: user.id, senderId });
            }
        } catch (err) {
            console.error("Mark seen error:", err);
        }
    };

    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [messages]);

    const handleKeyDown = (e) => {
        if (e.key === "Enter" && !e.shiftKey) {
            e.preventDefault();
            sendMessage();
        }
    };

    return (
        <div className="organizer-chat-page">
            <h4 className="fw-semibold text-secondary mb-4">
                Start a Conversation with Exhibitors
            </h4>

            <Container fluid className="py-1">
                <Row>
                    <Col md={12}>
                        <Card id="chat3" style={{ borderRadius: "15px", height: "100%" }}>
                            <Card.Body>
                                <Row>
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
                                                            className={`p-2 border-bottom chat-list ${selectedChat && selectedChat.user._id === chat.user._id
                                                                ? "bg-info bg-opacity-10"
                                                                : ""
                                                                }`}
                                                            key={idx}
                                                            onClick={() => selectChat(chat)}
                                                            style={{ cursor: "pointer" }}
                                                        >
                                                            <div className="d-flex justify-content-between text-dark">
                                                                <div className="d-flex flex-row">
                                                                    <div className="position-relative">
                                                                        <Avatar user={chat.user} size={40} className="me-3" />
                                                                    </div>
                                                                    <div className="pt-1">
                                                                        <p className="fw-bold mb-0">
                                                                            {chat.user.firstName}&nbsp;{chat.user.lastName} (
                                                                            {chat.user.role})
                                                                        </p>
                                                                        <p className="small text-muted">{chat.lastMessage}</p>
                                                                    </div>
                                                                </div>
                                                                <div className="pt-1 text-end">
                                                                    {chat.badge > 0 && (
                                                                        <Badge bg="danger" pill>
                                                                            {chat.badge}
                                                                        </Badge>
                                                                    )}
                                                                </div>
                                                            </div>
                                                        </li>
                                                    ))}
                                                </ul>
                                            </div>
                                        </div>
                                    </Col>

                                    <Col md={6} lg={7} xl={8}>
                                        <div
                                            style={{
                                                position: "relative",
                                                height: "600px",
                                                overflowY: "auto",
                                                paddingTop: "1rem",
                                                paddingRight: "1rem",
                                                display: "flex",
                                                flexDirection: "column",
                                            }}
                                        >
                                            {!selectedChat ? (
                                                <div
                                                    className="d-flex justify-content-center align-items-center flex-grow-1 text-muted"
                                                    style={{ fontSize: "1.1rem" }}
                                                >
                                                    Select a chat to start conversation
                                                </div>
                                            ) : messages.length === 0 ? (
                                                <div
                                                    className="d-flex justify-content-center align-items-center flex-grow-1 text-muted"
                                                    style={{ fontSize: "1.1rem" }}
                                                >
                                                    Send message to start conversation
                                                </div>
                                            ) : (
                                                messages.map((msg, idx) => (
                                                    <div
                                                        key={msg._id || idx}
                                                        className={`d-flex flex-row justify-content-${msg.sender._id === user.id ? "end" : "start"
                                                            } mb-3`}
                                                    >
                                                        {msg.sender._id !== user.id && (
                                                            <Avatar user={msg.sender} size={40} className="me-2" />
                                                        )}
                                                        <div>
                                                            <p
                                                                className={`small p-2 mb-1 rounded-3 ${msg.sender._id === user.id
                                                                    ? "text-white bg-primary"
                                                                    : "bg-light text-dark"
                                                                    }`}
                                                            >
                                                                {msg.content}
                                                            </p>
                                                            <p
                                                                className={`small mb-3 rounded-3 text-muted ${msg.sender._id === user.id ? "text-end" : ""
                                                                    }`}
                                                            >
                                                                {new Date(msg.createdAt).toLocaleTimeString()} |{" "}
                                                                {new Date(msg.createdAt).toLocaleDateString()}
                                                                {msg.sender._id === user.id && (
                                                                    <span className="ms-1">
                                                                        {msg.seen ? (
                                                                            <i className="bi bi-check-all text-primary"></i>
                                                                        ) : msg.delivered ? (
                                                                            <i className="bi bi-check-all text-secondary"></i>
                                                                        ) : (
                                                                            <i className="bi bi-check"></i>
                                                                        )}
                                                                    </span>
                                                                )}
                                                            </p>
                                                        </div>
                                                        {msg.sender._id === user.id && (
                                                            <Avatar user={msg.sender} size={40} className="ms-2" />
                                                        )}
                                                    </div>
                                                ))
                                            )}
                                            <div ref={messagesEndRef}></div>
                                        </div>

                                        <div className="text-muted d-flex justify-content-start align-items-center pe-3 pt-3 mt-2">
                                            <Avatar user={user} size={30} className="me-2" />
                                            <Form.Control
                                                as="textarea"
                                                placeholder={
                                                    selectedChat
                                                        ? `Type message to ${selectedChat.user.firstName} ${selectedChat.user.lastName}...`
                                                        : "Select a chat to start messaging..."
                                                }
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
        .send{
          color: #fff !important;
          border-radius: 50%;
        }
        .send:hover{
          background-color: #0b4baaff !important;
          border-radius: 50%;
        }
        .message{
          height: 20px;
          transition: height 0.3s ease-in-out;
        }
        .message:focus{
          height: 160px;
          max-height: 170px;
        }
        .chat-list{
          transition: all 0.2s ease;
        }
        .chat-list:hover{
          background-color: #ddddddd0 !important;
        }
        .small.p-2 {
          max-width: 50vw;
          word-break: break-word;
          white-space: pre-wrap;
        }
        .chat-list .small.text-muted {
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
          max-width: 200px;
          display: block;
        }
      `}</style>
        </div>
    );
};

export default OrganizerChat;