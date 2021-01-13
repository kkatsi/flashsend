import React, { useEffect } from "react";
import { Nav } from "react-bootstrap";
import { NavLink } from "react-router-dom";

export default function Conversations() {
  const id = "test";
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
          <Nav.Link
            as={NavLink}
            to={`/${id}`}
            onClick={() => {
              if (window.innerWidth < 768) {
                document
                  .querySelector(".dashboardContainer")
                  .classList.remove("animateBack");

                document
                  .querySelector(".dashboardContainer")
                  .classList.add("animate");
              }
            }}
            active="false"
            className="user d-flex px-3 text-light w-100 align-items-center"
          >
            <img
              alt="portrait"
              src="https://firebasestorage.googleapis.com/v0/b/flashsend-ece71.appspot.com/o/blank-profile-picture-973460_640.png?alt=media&token=aaa87789-49e5-477d-897a-ab83ce57ccc7"
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
              <span>Kostas Katsinaris</span>
              <div>
                <span
                  className="text-muted"
                  style={{
                    fontSize: ".8rem",
                  }}
                >
                  You: Hey man, how are you? Just wanted to say
                </span>
              </div>
            </div>
          </Nav.Link>
          <Nav.Link
            as={NavLink}
            to={`/${id}`}
            active="false"
            className="user d-flex px-3 text-light w-100 align-items-center"
            style={{ cursor: "pointer" }}
          >
            <img
              alt="portrait"
              src="https://firebasestorage.googleapis.com/v0/b/flashsend-ece71.appspot.com/o/blank-profile-picture-973460_640.png?alt=media&token=aaa87789-49e5-477d-897a-ab83ce57ccc7"
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
              <span>Giannis Liolios</span>
              <div>
                <span
                  className="text-muted"
                  style={{
                    fontSize: ".8rem",
                  }}
                >
                  Giannis: Hey man, how are you? Just wanted to say
                </span>
              </div>
            </div>
          </Nav.Link>
        </Nav>
      </div>
    </div>
  );
}
