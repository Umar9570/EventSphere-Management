import React from "react";
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

const ExhibitorChat = () => {
    return (
        <div className="exhibitor-chat-page">
            <h4 className="fw-semibold text-secondary mb-4">Start a Conversation with the Organizer or Other Exhibitors</h4>
            <Container fluid className="py-1">
                <Row>
                    <Col md={12}>
                        <Card id="chat3" style={{ borderRadius: "15px", height:"100%"}}>
                            <Card.Body>
                                <Row>
                                    {/* Left Chat List */}
                                    <Col md={6} lg={5} xl={4} className="mb-4 mb-md-0">
                                        <div className="p-3">
                                            {/* Search Input */}
                                            <InputGroup className="rounded mb-3">
                                                <Form.Control
                                                    placeholder="Search"
                                                    type="search"
                                                    className="rounded"
                                                />
                                                <InputGroup.Text className="border-0">
                                                    <i className="fas fa-search"></i>
                                                </InputGroup.Text>
                                            </InputGroup>

                                            {/* Chat List Scroll */}
                                            <div
                                                style={{
                                                    position: "relative",
                                                    height: "600px",
                                                    overflowY: "auto",
                                                }}
                                            >
                                                <ul className="list-unstyled mb-0">
                                                    {[
                                                        {
                                                            name: "Marie Horwitz",
                                                            message: "Hello, Are you there?",
                                                            time: "Just now",
                                                            avatar:
                                                                "https://mdbcdn.b-cdn.net/img/Photos/new-templates/bootstrap-chat/ava1-bg.webp",
                                                            status: "bg-success",
                                                            badge: 3,
                                                        },
                                                        {
                                                            name: "Alexa Chung",
                                                            message: "Lorem ipsum dolor sit.",
                                                            time: "5 mins ago",
                                                            avatar:
                                                                "https://mdbcdn.b-cdn.net/img/Photos/new-templates/bootstrap-chat/ava2-bg.webp",
                                                            status: "bg-warning",
                                                            badge: 2,
                                                        },
                                                        {
                                                            name: "Danny McChain",
                                                            message: "Lorem ipsum dolor sit.",
                                                            time: "Yesterday",
                                                            avatar:
                                                                "https://mdbcdn.b-cdn.net/img/Photos/new-templates/bootstrap-chat/ava3-bg.webp",
                                                            status: "bg-success",
                                                        },
                                                        {
                                                            name: "Ashley Olsen",
                                                            message: "Lorem ipsum dolor sit.",
                                                            time: "Yesterday",
                                                            avatar:
                                                                "https://mdbcdn.b-cdn.net/img/Photos/new-templates/bootstrap-chat/ava4-bg.webp",
                                                            status: "bg-danger",
                                                        },
                                                        {
                                                            name: "Kate Moss",
                                                            message: "Lorem ipsum dolor sit.",
                                                            time: "Yesterday",
                                                            avatar:
                                                                "https://mdbcdn.b-cdn.net/img/Photos/new-templates/bootstrap-chat/ava5-bg.webp",
                                                            status: "bg-warning",
                                                        },
                                                        {
                                                            name: "Ben Smith",
                                                            message: "Lorem ipsum dolor sit.",
                                                            time: "Yesterday",
                                                            avatar:
                                                                "https://mdbcdn.b-cdn.net/img/Photos/new-templates/bootstrap-chat/ava6-bg.webp",
                                                            status: "bg-success",
                                                        },
                                                    ].map((chat, idx) => (
                                                        <li className="p-2 border-bottom chat-list" key={idx}>
                                                            <a
                                                                href="#!"
                                                                className="d-flex justify-content-between text-decoration-none text-dark "
                                                            >
                                                                <div className="d-flex flex-row">
                                                                    <div className="position-relative">
                                                                        <Image
                                                                            src={chat.avatar}
                                                                            roundedCircle
                                                                            width={60}
                                                                            className="me-3"
                                                                        />
                                                                        <span
                                                                            className={`position-absolute bottom-0 start-100 translate-middle p-1 rounded-circle ${chat.status}`}
                                                                        ></span>
                                                                    </div>
                                                                    <div className="pt-1">
                                                                        <p className="fw-bold mb-0">{chat.name}</p>
                                                                        <p className="small text-muted">{chat.message}</p>
                                                                    </div>
                                                                </div>
                                                                <div className="pt-1 text-end">
                                                                    <p className="small text-muted mb-1">{chat.time}</p>
                                                                    {chat.badge && (
                                                                        <Badge bg="danger" pill>
                                                                            {chat.badge}
                                                                        </Badge>
                                                                    )}
                                                                </div>
                                                            </a>
                                                        </li>
                                                    ))}
                                                </ul>
                                            </div>
                                        </div>
                                    </Col>

                                    {/* Right Chat Messages */}
                                    <Col md={6} lg={7} xl={8}>
                                        <div
                                            style={{
                                                position: "relative",
                                                height: "600px",
                                                overflowY: "auto",
                                                paddingTop: "1rem",
                                                paddingRight: "1rem",
                                            }}
                                        >
                                            {[
                                                {
                                                    from: "other",
                                                    avatar:
                                                        "https://mdbcdn.b-cdn.net/img/Photos/new-templates/bootstrap-chat/ava6-bg.webp",
                                                    message:
                                                        "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.",
                                                    time: "12:00 PM | Aug 13",
                                                },
                                                {
                                                    from: "me",
                                                    avatar:
                                                        "https://mdbcdn.b-cdn.net/img/Photos/new-templates/bootstrap-chat/ava1-bg.webp",
                                                    message:
                                                        "Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.",
                                                    time: "12:00 PM | Aug 13",
                                                },
                                                {
                                                    from: "other",
                                                    avatar:
                                                        "https://mdbcdn.b-cdn.net/img/Photos/new-templates/bootstrap-chat/ava6-bg.webp",
                                                    message:
                                                        "Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur.",
                                                    time: "12:00 PM | Aug 13",
                                                },
                                                {
                                                    from: "me",
                                                    avatar:
                                                        "https://mdbcdn.b-cdn.net/img/Photos/new-templates/bootstrap-chat/ava1-bg.webp",
                                                    message:
                                                        "Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.",
                                                    time: "12:00 PM | Aug 13",
                                                },
                                                {
                                                    from: "other",
                                                    avatar:
                                                        "https://mdbcdn.b-cdn.net/img/Photos/new-templates/bootstrap-chat/ava6-bg.webp",
                                                    message:
                                                        "Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium, totam rem aperiam, eaque ipsa quae ab illo inventore veritatis et quasi architecto beatae vitae dicta sunt explicabo.",
                                                    time: "12:00 PM | Aug 13",
                                                },
                                                {
                                                    from: "me",
                                                    avatar:
                                                        "https://mdbcdn.b-cdn.net/img/Photos/new-templates/bootstrap-chat/ava1-bg.webp",
                                                    message:
                                                        "Nemo enim ipsam voluptatem quia voluptas sit aspernatur aut odit aut fugit, sed quia consequuntur magni dolores eos qui ratione voluptatem sequi nesciunt.",
                                                    time: "12:00 PM | Aug 13",
                                                },
                                                {
                                                    from: "other",
                                                    avatar:
                                                        "https://mdbcdn.b-cdn.net/img/Photos/new-templates/bootstrap-chat/ava6-bg.webp",
                                                    message:
                                                        "Neque porro quisquam est, qui dolorem ipsum quia dolor sit amet, consectetur, adipisci velit, sed quia non numquam eius modi tempora incidunt ut labore et dolore magnam aliquam quaerat voluptatem.",
                                                    time: "12:00 PM | Aug 13",
                                                },
                                                {
                                                    from: "me",
                                                    avatar:
                                                        "https://mdbcdn.b-cdn.net/img/Photos/new-templates/bootstrap-chat/ava1-bg.webp",
                                                    message:
                                                        "Ut enim ad minima veniam, quis nostrum exercitationem ullam corporis suscipit laboriosam, nisi ut aliquid ex ea commodi consequatur?",
                                                    time: "12:00 PM | Aug 13",
                                                },
                                            ].map((msg, idx) => (
                                                <div
                                                    key={idx}
                                                    className={`d-flex flex-row justify-content-${msg.from === "me" ? "end" : "start"
                                                        } mb-3`}
                                                >
                                                    {msg.from === "other" && (
                                                        <Image
                                                            src={msg.avatar}
                                                            roundedCircle
                                                            width={45}
                                                            className="me-2"
                                                        />
                                                    )}
                                                    <div>
                                                        <p
                                                            className={`small p-2 mb-1 rounded-3 ${msg.from === "me"
                                                                ? "text-white bg-primary"
                                                                : "bg-light text-dark"
                                                                }`}
                                                        >
                                                            {msg.message}
                                                        </p>
                                                        <p
                                                            className={`small mb-3 rounded-3 text-muted ${msg.from === "me" ? "text-end" : ""
                                                                }`}
                                                        >
                                                            {msg.time}
                                                        </p>
                                                    </div>
                                                    {msg.from === "me" && (
                                                        <Image
                                                            src={msg.avatar}
                                                            roundedCircle
                                                            width={45}
                                                            className="ms-2"
                                                        />
                                                    )}
                                                </div>
                                            ))}
                                        </div>

                                        {/* Input Box */}
                                        <div className="text-muted d-flex justify-content-start align-items-center pe-3 pt-3 mt-2">
                                            <Image
                                                src="https://mdbcdn.b-cdn.net/img/Photos/new-templates/bootstrap-chat/ava6-bg.webp"
                                                roundedCircle
                                                width={40}
                                                className="me-2"
                                            />
                                            <Form.Control
                                                as="textarea"
                                                placeholder="Type message"
                                                className=" message"
                                            />
                                            <Button variant="link" className="send ms-2 fs-small p-2 bg-primary">
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
            `}</style>
        </div>
    );

};

export default ExhibitorChat;