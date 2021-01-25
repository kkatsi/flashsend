import React, { useState } from "react";
import { Form, Nav, Toast, Button, Dropdown } from "react-bootstrap";
import { NavLink } from "react-router-dom";
import { AiOutlineSearch } from "react-icons/ai";
import { GoPrimitiveDot } from "react-icons/go";
import { RiDeleteBin7Fill } from "react-icons/ri";
import { BiDotsHorizontalRounded } from "react-icons/bi";
import { useFirestoreAfterLogin } from "../contexts/FirestoreAfterLoginContext";
import moment from "moment";

export default function Contacts() {
  const {
    getContacts,
    contactsStatus,
    deleteContact,
  } = useFirestoreAfterLogin();
  const [userToDelete, setUsertoDelete] = useState();
  const [nodeToDelete, setNodeToDelete] = useState();
  const [show, setShow] = useState(false);

  const id = "test";

  function handleClick(event, user) {
    setNodeToDelete(
      event.target.nodeName === "path"
        ? event.target.parentNode.parentNode.parentNode
        : event.target.parentNode.parentNode
    );
    setShow(true);
    setUsertoDelete(user);
  }

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
          style={{ overflowY: "auto", overflowX: "hidden" }}
        >
          {contactsStatus.length === getContacts.length &&
            getContacts.map((contact, index) => {
              return (
                <div className="d-flex px-3" key={index}>
                  <Nav.Link
                    as={NavLink}
                    to={`/${contact.uid}`}
                    active="false"
                    className="user d-flex text-light px-0 w-100 align-items-center text"
                    style={{ cursor: "pointer" }}
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
                    <div className="text-left ml-3">
                      <span>{contact.displayName}</span>
                      <div>
                        <GoPrimitiveDot
                          style={{
                            color:
                              contactsStatus[index].state === "online"
                                ? "green"
                                : "red",
                          }}
                        />

                        <span style={{ fontSize: ".8rem" }}>
                          {contactsStatus[index].state === "online"
                            ? "Online"
                            : `Last seen ${moment
                                .unix(
                                  contactsStatus[index].last_changed.seconds
                                )
                                .startOf("minute")
                                .fromNow()}`}
                        </span>
                      </div>
                    </div>
                  </Nav.Link>
                  <div className="contactSettings ml-auto align-self-start">
                    <Dropdown>
                      <Dropdown.Toggle as="div" id="chatSettingsDropdown">
                        <BiDotsHorizontalRounded
                          style={{
                            fontSize: "1.3em",
                            color: "white",
                            cursor: "pointer",
                          }}
                        />
                      </Dropdown.Toggle>

                      <Dropdown.Menu>
                        <Dropdown.Item
                          href="#/action-1"
                          className="d-flex align-items-center text-danger"
                          onClick={(event) => {
                            handleClick(event, contact);
                          }}
                        >
                          <RiDeleteBin7Fill
                            style={{ fontSize: "1.4em", marginRight: ".5rem" }}
                          />
                          Delete contact
                        </Dropdown.Item>
                      </Dropdown.Menu>
                    </Dropdown>
                  </div>
                </div>
              );
            })}
        </Nav>
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
          height: "150px",
          margin: "auto auto",
        }}
      >
        <Toast.Body className="d-flex flex-column justify-content-center align-items-center">
          <p className="lead">
            Are you sure that you want to delete the contact?
          </p>
          <div>
            <Button
              variant="success"
              className="mr-3 px-4"
              onClick={() => {
                // console.log(userToDelete, nodeToDelete);
                deleteContact(userToDelete).then(() => {
                  nodeToDelete.remove();
                  setShow(false);
                });
              }}
            >
              Yes
            </Button>
            <Button
              variant="danger"
              className="px-4"
              onClick={() => setShow(false)}
            >
              No
            </Button>
          </div>
        </Toast.Body>
      </Toast>
    </div>
  );
}
