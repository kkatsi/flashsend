import React, { useEffect, useState } from "react";
import { Nav } from "react-bootstrap";
import { NavLink } from "react-router-dom";
import { useFirestoreAfterLogin } from "../contexts/FirestoreAfterLoginContext";

export default function Conversations() {
  const id = "test";
  const { allConversations } = useFirestoreAfterLogin();
  useEffect(() => {
    document.querySelector(".conversationsUsers").style.height =
      window.innerHeight -
      document.querySelector(".topNav").clientHeight -
      60 +
      "px";
  }, []);

  return (
    <div className="conversationsContainer">
      <div className="resultsContainer text-light mt-3 d-flex flex-column">
        <span className="lead">Recent Conversations</span>
        <Nav
          className="conversationsUsers d-flex flex-column flex-nowrap mt-3"
          style={{
            overflowY: "auto",
            overflowX: "hidden",
          }}
        >
          {allConversations.map((contact, index) => {
            return contact.hasMessages ? (
              <Nav.Link
                as={NavLink}
                to={`/${contact.uid}`}
                onClick={() => {
                  if (window.innerWidth < 768 || window.screen.width < 768) {
                    document.querySelector(".rightColumn").style.zIndex = "99";
                  }
                }}
                active="false"
                className="user d-flex px-3 text-light w-100 align-items-center"
                key={index}
                style={{
                  backgroundColor: contact.alert
                    ? "rgba(199,8,9,0.5)"
                    : "initial",
                }}
              >
                <img
                  alt="portrait"
                  src={contact.photoURL}
                  style={{
                    minWidth: "40px",
                    width: "40px",
                    height: "40px",
                    borderRadius: "50%",
                  }}
                ></img>
                <div
                  className="text-left ml-3"
                  style={{
                    textOverflow: "ellipsis",
                    whiteSpace: "nowrap",
                    overflow: "hidden",
                  }}
                >
                  <span
                    style={{ fontWeight: contact.alert ? "bolder" : "inital" }}
                  >
                    {contact.displayName}
                  </span>
                  <div>
                    <span
                      className={contact.alert ? "text-white" : "text-muted"}
                      style={{
                        fontSize: ".8rem",
                        fontWeight: contact.alert ? "bolder" : "initial",
                      }}
                    >
                      {contact.lastMessage}
                    </span>
                  </div>
                </div>
              </Nav.Link>
            ) : (
              ""
            );
          })}
        </Nav>
      </div>
    </div>
  );
}
