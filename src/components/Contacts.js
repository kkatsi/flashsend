import React from "react";
import { Form, Nav } from "react-bootstrap";
import { NavLink } from "react-router-dom";
import { AiOutlineSearch } from "react-icons/ai";
import { GoPrimitiveDot } from "react-icons/go";

export default function Contacts() {
  const id = "test";
  return (
    <div className="contactsContainer">
      <div className="searchContainer px-4 pt-4">
        <Form>
          <Form.Group className="d-flex">
            <AiOutlineSearch
              style={{
                fontSize: "1.4em",
                color: "white",
                alignSelf: "center",
              }}
            />
            <Form.Control
              type="text"
              placeholder="Search contact"
            ></Form.Control>
          </Form.Group>
        </Form>
      </div>
      <div className="resultsContainer text-light d-flex flex-column">
        <span className="lead">Contacts</span>
        <Nav
          className="conversationsUsers d-flex flex-column flex-nowrap mt-3"
          style={{ overflow: "auto" }}
        >
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
              style={{ width: "40px", height: "40px", borderRadius: "50%" }}
            ></img>
            <div className="text-left ml-3">
              <span>Kostas Katsinaris</span>
              <div>
                <GoPrimitiveDot style={{ color: "green" }} />
                <span style={{ fontSize: ".8rem" }}>Online</span>
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
              style={{ width: "40px", height: "40px", borderRadius: "50%" }}
            ></img>
            <div className="text-left ml-3">
              <span>Giannis Liolios</span>
              <div>
                <GoPrimitiveDot style={{ color: "red" }} />
                <span style={{ fontSize: ".8rem" }}>Offline</span>
              </div>
            </div>
          </Nav.Link>
        </Nav>
      </div>
    </div>
  );
}
