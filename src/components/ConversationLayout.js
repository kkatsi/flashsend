import React, { useEffect } from "react";
import { GoPrimitiveDot } from "react-icons/go";
import { IoIosSettings, IoIosArrowBack } from "react-icons/io";
import { RiDeleteBin7Fill } from "react-icons/ri";
import { AiOutlinePlus } from "react-icons/ai";
import { Dropdown, Form } from "react-bootstrap";
import { Button } from "react-bootstrap";

export default function ConversationLayout() {
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
    if (window.innerWidth > 768)
      document.querySelector(".messages").style.height =
        window.innerHeight - 94 - 76 + "px";
    else
      document.querySelector(".messages").style.height =
        window.innerHeight - 102 - 76 + "px";
    window.addEventListener(
      "resize",
      () =>
        (document.querySelector(".messages").style.height =
          window.innerHeight - 94 - 76 + "px")
    );
  }, []);
  return (
    <div className="basicLayoutContainer w-100">
      <div
        active="false"
        className="topHeader d-flex px-3 w-100 text-light py-2 justify-content-between align-items-center"
        style={{ backgroundColor: "#1e2124" }}
      >
        <div className="leftSide d-flex align-items-center">
          <IoIosArrowBack
            className="d-md-none"
            style={{ fontSize: "2em", marginRight: "1rem", cursor: "pointer" }}
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
            src="https://firebasestorage.googleapis.com/v0/b/flashsend-ece71.appspot.com/o/blank-profile-picture-973460_640.png?alt=media&token=aaa87789-49e5-477d-897a-ab83ce57ccc7"
            style={{ width: "60px", height: "60px", borderRadius: "50%" }}
          ></img>
          <div className="text-left ml-3">
            <span style={{ fontSize: "1.3rem" }}>
              {window.innerWidth > 768
                ? "Chat with Giannis Liolios"
                : "Giannis Liolios"}
            </span>
            <div>
              <GoPrimitiveDot style={{ color: "red" }} />
              <span style={{ fontSize: ".8rem" }}>Offline</span>
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
                className="d-flex align-items-center"
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
            <Button variant="danger" type="submit" className="ml-auto">
              Send
            </Button>
          </div>
        </Form>
      </div>
    </div>
  );
}