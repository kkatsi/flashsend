import React, { useEffect, useState, useRef, useCallback } from "react";
import { GoPrimitiveDot } from "react-icons/go";
import { IoIosSettings, IoIosArrowBack } from "react-icons/io";
import { RiDeleteBin7Fill } from "react-icons/ri";
import { AiOutlinePlus } from "react-icons/ai";
import { Dropdown, Form, Toast, Spinner, InputGroup } from "react-bootstrap";
import { Button } from "react-bootstrap";
import { useParams } from "react-router-dom";
import { useFirestoreAfterLogin } from "../contexts/FirestoreAfterLoginContext";
import { useAuth } from "../contexts/AuthContext";
import moment from "moment";

export default function ConversationLayout() {
  const [show, setShow] = useState(false);
  const [contactData, setContactData] = useState();
  const [prevContactData, setPrevContactData] = useState([]);
  const { id } = useParams();
  const messageRef = useRef();
  let limit = 0;
  const {
    getContacts,
    contactsStatus,
    sendMessage,
    messages,
    getMessages,
    getAllMessages,
    allMessagesLength,
    allMessages,
    setHasMessages,
    setLastMessage,
  } = useFirestoreAfterLogin();
  const { currentUser } = useAuth();
  useEffect(() => {
    if (document.querySelector(".basicLayoutContainer")) {
      if (window.innerWidth > 768 || window.screen.width > 768) {
        document.querySelector(".messages").style.height =
          window.innerHeight - 94 - 76 + "px";
        window.addEventListener(
          "resize",
          () =>
            (document.querySelector(".messages").style.height =
              window.innerHeight - 94 - 76 + "px")
        );
      } else
        document.querySelector(".messages").style.height =
          window.innerHeight - 102 - 76 + "px";
    }

    return window.removeEventListener("resize", function () {});
  }, [contactData]);

  useEffect(() => {
    if (getContacts.length > 0 && contactsStatus.length > 0) {
      const tempStatus = contactsStatus.filter((contact) => contact.uid === id);
      const tempData = getContacts.filter((contact) => contact.uid === id);
      tempData[0].state = tempStatus[0].state;
      tempData[0].last_changed = tempStatus[0].last_changed;
      setContactData(...tempData);
    }
  }, [id, getContacts, contactsStatus]);

  useEffect(() => {
    if (contactData && contactData !== prevContactData) {
      getAllMessages(contactData);
      // getMessages();
      setPrevContactData(contactData);
    }
  }, [contactData]);

  async function handleSubmit(e) {
    e.preventDefault();
    setLastMessage(contactData, messageRef.current.value);
    sendMessage(messageRef.current.value, contactData).then(() => {
      if (allMessagesLength === 0) setHasMessages(contactData);
    });
  }

  async function handleKeyPress(e) {
    if (e.which === 13 && !e.shiftKey) {
      await handleSubmit(e);
      messageRef.current.value = "";
    }
  }
  let height;
  const observer = useRef();
  const lastMessageElementRef = useCallback(
    (node) => {
      if (node !== null) height = node.offsetTop;
      if (observer.current) observer.current.disconnect();
      observer.current = new IntersectionObserver((entries) => {
        if (entries[0].isIntersecting) {
          if (limit + 20 < allMessagesLength) {
            limit = limit + 20;

            getMessages(limit, allMessages);

            const divHeight = document.querySelector(".messages div").offsetTop;

            document.querySelector(".messages").scrollTop = divHeight - height;
          }
          // setLimit((prevLimit) => prevLimit + 20);
        }
        // console.log(allMessagesLength);
      });
      if (node) observer.current.observe(node);
    },
    [allMessagesLength, allMessages]
  );

  function timeDifference(date1, date2) {
    var difference = date1 - date2;
    var minutesDifference = Math.floor(difference / 1000 / 60);
    return minutesDifference;
  }

  return (
    <div className="w-100">
      {contactData === undefined && (
        <div className="min-vh-100 d-flex justify-content-center align-items-center">
          <Spinner animation="border" role="status" variant="danger">
            <span className="sr-only">Loading...</span>
          </Spinner>
        </div>
      )}
      {contactData && (
        <div className="basicLayoutContainer w-100">
          <div
            active="false"
            className="topHeader d-flex px-3 w-100 text-light py-2 justify-content-between align-items-center"
            style={{ backgroundColor: "#1e2124" }}
          >
            <div className="leftSide d-flex align-items-center">
              <IoIosArrowBack
                className="d-md-none"
                style={{
                  fontSize: "2em",
                  marginRight: "1rem",
                  cursor: "pointer",
                }}
                onClick={() => {
                  if (window.innerWidth < 768 || window.screen.width < 768) {
                    document.querySelector(".rightColumn").style.zIndex = "1";
                  }
                }}
              />
              <img
                alt="portrait"
                src={contactData.photoURL}
                style={{ width: "60px", height: "60px", borderRadius: "50%" }}
              ></img>
              <div className="text-left ml-3">
                <span style={{ fontSize: "1.3rem" }}>
                  {window.innerWidth > 768
                    ? `Chat with ${contactData.displayName}`
                    : contactData.displayName}
                </span>
                <div>
                  <GoPrimitiveDot
                    style={{
                      color: contactData.state === "online" ? "green" : "red",
                    }}
                  />
                  <span style={{ fontSize: ".8rem" }}>
                    {contactData.state === "online" ? "Online" : `Last seen`}{" "}
                    {contactData !== undefined && contactData.state !== "online"
                      ? moment
                          .unix(contactData.last_changed.seconds)
                          .startOf("minute")
                          .fromNow()
                      : ""}
                  </span>
                </div>
              </div>
            </div>
            <div className="rightSide">
              <Dropdown>
                <Dropdown.Toggle
                  style={{
                    all: "initial",
                  }}
                  id="chatSettingsDropdown"
                >
                  <IoIosSettings
                    className="text-danger"
                    style={{ fontSize: "2em", cursor: "pointer" }}
                  />
                </Dropdown.Toggle>

                <Dropdown.Menu>
                  <Dropdown.Item
                    href="#/action-1"
                    className="d-flex align-items-center text-danger"
                  >
                    <RiDeleteBin7Fill
                      style={{ fontSize: "1.4em", marginRight: ".5rem" }}
                    />
                    Delete conversation
                  </Dropdown.Item>
                  <Dropdown.Item
                    href="#/action-2"
                    className="d-flex align-items-center text-dark"
                    onClick={() => setShow(true)}
                  >
                    <AiOutlinePlus
                      style={{ fontSize: "1.4em", marginRight: ".5rem" }}
                    />
                    Add person to the conversation
                  </Dropdown.Item>
                  {/* <Dropdown.Item href="#/action-2">Another action</Dropdown.Item>
              <Dropdown.Item href="#/action-3">Something else</Dropdown.Item> */}
                </Dropdown.Menu>
              </Dropdown>
            </div>
          </div>
          <div
            className={`messages d-flex flex-column-reverse flex-nowrap px-3`}
            style={{ overflow: "auto" }}
          >
            {/* {document.querySelector(".messages") && lastMessageElementRef
              ? console.log(document.querySelector(".messages div").offsetTop)
              : ""} */}
            <div className="d-flex flex-column ">
              {messages &&
                messages
                  .slice(0)
                  .reverse()
                  .map((message, index, messagesArray) => {
                    if (index === 0)
                      return (
                        <div
                          className={`messageContainer d-flex flex-column text-light ${
                            message.user === currentUser.displayName
                              ? "text-right "
                              : "text-left"
                          }`}
                          key={index}
                          ref={lastMessageElementRef}
                        >
                          <span>
                            {message.user === currentUser.displayName
                              ? "You"
                              : message.user.substr(
                                  0,
                                  message.user.indexOf(" ")
                                )}
                          </span>

                          <div
                            className={`message py-2 px-3 text-left ${
                              message.user === currentUser.displayName
                                ? "bg-danger text-left align-self-end"
                                : "bg-light text-dark text-left align-self-start"
                            }`}
                            style={{
                              width: "auto",
                              maxWidth: "70%",
                              borderRadius: "1rem",
                            }}
                          >
                            <span className="mx-auto">{message.message}</span>
                          </div>

                          <small>
                            {message.time
                              ? moment.unix(message.time.seconds).calendar()
                              : ""}
                          </small>
                        </div>
                      );
                    else
                      return (
                        <div
                          className={`messageContainer d-flex flex-column text-light ${
                            message.user === currentUser.displayName
                              ? "text-right "
                              : "text-left"
                          }`}
                          key={index}
                          id={`message${index}`}
                        >
                          <span>
                            {message.user !== messagesArray[index - 1].user
                              ? message.user === currentUser.displayName
                                ? "You"
                                : message.user.substr(
                                    0,
                                    message.user.indexOf(" ")
                                  )
                              : ""}
                          </span>

                          <div
                            className={`message py-2 px-3 text-left ${
                              message.user === currentUser.displayName
                                ? "bg-danger text-left align-self-end"
                                : "bg-light text-dark text-left align-self-start"
                            }`}
                            style={{
                              width: "auto",
                              maxWidth: "70%",
                              borderRadius: "1rem",
                            }}
                          >
                            <span className="mx-auto">{message.message}</span>
                          </div>

                          <small>
                            {/* {message.user === messagesArray[index - 1].user &&
                              moment
                                .duration(
                                  moment
                                    .unix(message.time.seconds)
                                    .diff(
                                      moment.unix(
                                        messagesArray[index - 1].time.seconds
                                      )
                                    )
                                )
                                .minutes() >= 5 &&
                              message.time &&
                              document.querySelector(
                                `.messageContainer#message${index - 1} small`
                              ) &&
                              document
                                .querySelector(
                                  `.messageContainer#message${index - 1} small`
                                )
                                .remove()} */}
                            {/* {message.user === messagesArray[index - 1].user
                              ? moment
                                  .duration(
                                    moment
                                      .unix(message.time.seconds)
                                      .diff(
                                        moment.unix(
                                          messagesArray[index - 1].time.seconds
                                        )
                                      )
                                  )
                                  .minutes() >= 5
                                ? message.time
                                  ? moment.unix(message.time.seconds).calendar()
                                  : ""
                                : ""
                              : message.time
                              ? moment.unix(message.time.seconds).calendar()
                              : ""} */}
                            {message.time
                              ? moment.unix(message.time.seconds).calendar()
                              : ""}
                          </small>
                        </div>
                      );
                  })}
            </div>
          </div>
          <div
            className="newMessage align-items-center w-100 p-2 px-md-4 py-md-3"
            style={{ backgroundColor: "#dcdcdc" }}
          >
            <Form onSubmit={handleSubmit} className="d-flex">
              <InputGroup className="w-100">
                <Form.Control
                  ref={messageRef}
                  as="textarea"
                  onKeyPress={handleKeyPress}
                  rows={window.innerWidth > 768 ? 2 : 3}
                  placeholder="Type your message here"
                  style={{ resize: "none" }}
                />
                <InputGroup.Append>
                  <Button type="submit" variant="danger" className="w-100">
                    Send
                  </Button>
                </InputGroup.Append>
              </InputGroup>
              {/* <div className="d-md-flex align-items-center"></div> */}
            </Form>
          </div>
          <Toast
            onClose={() => setShow(false)}
            show={show}
            style={{
              position: "absolute",
              bottom: "0",
              left: "0",
              right: "0",
              top: "0",
              height: "250px",
              margin: "auto auto",
            }}
          >
            <Toast.Header>
              <strong className="mr-auto">Add person</strong>
            </Toast.Header>
            <Toast.Body style={{ height: "220px" }}>
              <div
                className="addFriendToConversationContainer d-flex flex-column h-100"
                style={{ overflow: "auto" }}
              >
                <span>test</span>
                <span>test</span>
                <span>test</span>
                <span>test</span>
                <span>test</span>
                <span>test</span>
                <span>test</span>
                <span>test</span>
                <span>test</span>
                <span>test</span>
                <span>test</span>
              </div>
            </Toast.Body>
          </Toast>
        </div>
      )}
    </div>
  );
}
