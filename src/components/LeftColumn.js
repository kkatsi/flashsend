import React, { useState, useEffect } from "react";
import { AiOutlineUserAdd } from "react-icons/ai";
import { MdChat } from "react-icons/md";
import { IoMdContacts, IoMdSettings } from "react-icons/io";

import { Nav } from "react-bootstrap";
import Conversations from "./Conversations";
import AddContact from "./AddContact";
import Contacts from "./Contacts";
import Settings from "./Settings";
export default function LeftColumn() {
  const [active, setActive] = useState();

  useEffect(() => {
    if (localStorage.getItem("active"))
      setActive(localStorage.getItem("active"));
    else setActive("conversations");
  }, []);

  return (
    <div
      className="leftColumn d-flex flex-column min-vh-100"
      style={{ backgroundColor: "#1e2124" }}
    >
      {active && (
        <Nav
          defaultActiveKey={active}
          className="topNav d-flex justify-content-between bg-white"
          style={{ borderBottom: "1px solid red " }}
        >
          <Nav.Item style={{ width: "25%", backgroundColor: "#343a40" }}>
            <Nav.Link
              onClick={() => {
                setActive("conversations");
                localStorage.setItem("active", "conversations");
              }}
              eventKey="conversations"
              className="py-2"
              style={{ cursor: "pointer" }}
            >
              <MdChat style={{ fontSize: "1.4em", color: "white" }} />
            </Nav.Link>
          </Nav.Item>
          <Nav.Item style={{ width: "25%", backgroundColor: "#343a40" }}>
            <Nav.Link
              onClick={() => {
                setActive("contacts");
                localStorage.setItem("active", "contacts");
              }}
              eventKey="contacts"
              className="py-2"
              style={{ cursor: "pointer" }}
            >
              <IoMdContacts style={{ fontSize: "1.4em", color: "white" }} />
            </Nav.Link>
          </Nav.Item>
          <Nav.Item style={{ width: "25%", backgroundColor: "#343a40" }}>
            <Nav.Link
              onClick={() => {
                setActive("add-contact");
                localStorage.setItem("active", "add-contact");
              }}
              eventKey="add-contact"
              className="py-2"
              style={{ cursor: "pointer" }}
            >
              <AiOutlineUserAdd style={{ fontSize: "1.4em", color: "white" }} />
            </Nav.Link>
          </Nav.Item>
          <Nav.Item style={{ width: "25%", backgroundColor: "#343a40" }}>
            <Nav.Link
              onClick={() => {
                setActive("settings");
                localStorage.setItem("active", "settings");
              }}
              eventKey="settings"
              className="py-2"
              style={{ cursor: "pointer" }}
            >
              <IoMdSettings style={{ fontSize: "1.4em", color: "white" }} />
            </Nav.Link>
          </Nav.Item>
        </Nav>
      )}

      {active === "conversations" && <Conversations />}
      {active === "contacts" && <Contacts />}
      {active === "add-contact" && <AddContact />}
      {active === "settings" && <Settings />}
    </div>
  );
}
