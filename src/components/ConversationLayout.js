import React, { useEffect, useState } from "react";
import { GoPrimitiveDot } from "react-icons/go";
import { IoIosSettings, IoIosArrowBack } from "react-icons/io";
import { RiDeleteBin7Fill } from "react-icons/ri";
import { AiOutlinePlus } from "react-icons/ai";
import { Dropdown, Form, Toast, Spinner } from "react-bootstrap";
import { Button } from "react-bootstrap";
import { useParams } from "react-router-dom";
import { useFirestoreAfterLogin } from "../contexts/FirestoreAfterLoginContext";
import moment from "moment";

export default function ConversationLayout() {
  const [show, setShow] = useState(false);
  const [contactData, setContactData] = useState([]);
  const { id } = useParams();
  const { getContacts, contactsStatus } = useFirestoreAfterLogin();
  const data = [
    {
      name: "Giannis",
      message: "hi",
      time: "6 secs ago",
    },
    {
      name: "You",
      message:
        "Lorem ipsum dolor, sit amet consectetur adipisicing elit. Laboriosam pariatur enim earum voluptatibus distinctio cupiditate repellat. Eligendi accusantium mollitia doloribus.",
      time: "2 secs ago",
    },
  ];
  useEffect(() => {
    if (document.querySelector(".basicLayoutContainer")) {
      if (window.innerWidth > 768) {
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
  }, []);

  useEffect(() => {
    if (getContacts.length > 0 && contactsStatus.length > 0) {
      const tempStatus = contactsStatus.filter((contact) => contact.uid === id);
      const tempData = getContacts.filter((contact) => contact.uid === id);
      tempData[0].state = tempStatus[0].state;
      tempData[0].last_changed = tempStatus[0].last_changed;
      setContactData(...tempData);
    }
  }, [id, getContacts, contactsStatus]);

  return (
    <div>
      {console.log(contactData)}
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
                  if (window.innerWidth < 768) {
                    document
                      .querySelector(".dashboardContainer")
                      .classList.remove("animate");
                    document
                      .querySelector(".dashboardContainer")
                      .classList.add("animateBack");
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
                    {contactData.state === "online" ? "Online" : `Last seen `}
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
            <div className="d-flex flex-column ">
              {data.map((message, index) => {
                return (
                  <div
                    className={`messageContainer d-flex flex-column text-light ${
                      message.name === "You" ? "text-right " : "text-left"
                    }`}
                    key={index}
                  >
                    <span>{message.name}</span>
                    <div
                      className={`message py-2 px-3 text-left ${
                        message.name === "You"
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

                    <span>{message.time}</span>
                  </div>
                );
              })}
            </div>
          </div>
          <div
            className="newMessage align-items-center w-100 p-2 px-md-4 py-md-3"
            style={{ backgroundColor: "#dcdcdc" }}
          >
            <Form className="d-flex">
              <Form.Control
                as="textarea"
                rows={window.innerWidth > 768 ? 2 : 3}
                placeholder="Type your message here"
              />
              <div className="d-md-flex align-items-center">
                <Button
                  variant="danger"
                  type="submit"
                  className="ml-auto"
                  onClick={(e) => {
                    e.preventDefault();
                  }}
                >
                  Send
                </Button>
              </div>
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
