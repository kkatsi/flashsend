import React, { useState } from "react";
import { Form, Nav, Toast } from "react-bootstrap";
import { AiOutlineSearch, AiOutlinePlus } from "react-icons/ai";
import { NavLink } from "react-router-dom";

export default function AddContact() {
  const id = "test";
  const [show, setShow] = useState(false);
  return (
    <div className="addContactContainer">
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
            <Form.Control type="text" placeholder="Search user"></Form.Control>
          </Form.Group>
        </Form>
      </div>
      <div className="resultsContainer text-light d-flex flex-column">
        <span className="lead">Users</span>
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
            onClick={() => setShow(true)}
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
            <div className="text-left ml-3 d-flex justify-content-between align-items-center w-100">
              <span>Kostas Katsinaris</span>
              <AiOutlinePlus style={{ color: "white" }} />
            </div>
          </Nav.Link>
          <Nav.Link
            as={NavLink}
            to={`/${id}`}
            active="false"
            className="user d-flex px-3 text-light w-100 align-items-center"
            style={{ cursor: "pointer" }}
            onClick={() => setShow(true)}
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
            <div className="text-left ml-3 d-flex justify-content-between align-items-center w-100">
              <span>Giannis Liolios</span>

              <AiOutlinePlus style={{ color: "white" }} />
            </div>
          </Nav.Link>
        </Nav>
      </div>
      <Toast
        onClose={() => setShow(false)}
        show={show}
        delay={2000}
        autohide
        style={{
          position: "absolute",
          bottom: "0",
          left: "0",
          right: "0",
          top: "0",
          height: "90px",
          margin: "auto auto",
        }}
      >
        <Toast.Header closeButton={false}>
          <strong className="mx-auto">Notification</strong>
        </Toast.Header>
        <Toast.Body>Friend request sent to the user!</Toast.Body>
      </Toast>
    </div>
  );
}
