import React, { useRef, useState, useEffect } from "react";
import { Form, Nav, Toast } from "react-bootstrap";
import { AiOutlineSearch, AiOutlinePlus } from "react-icons/ai";
import { BsCheck } from "react-icons/bs";
import { FaCheck, FaTimes } from "react-icons/fa";
import { NavLink } from "react-router-dom";
import { useFirestoreAfterLogin } from "../contexts/FirestoreAfterLoginContext";
import { useAuth } from "../contexts/AuthContext";

export default function AddContact() {
  const id = "test";
  const [show, setShow] = useState(false);
  const [users, setUsers] = useState([]);
  const searchRef = useRef();
  const { currentUser } = useAuth();
  const {
    getUsers,
    sendFriendRequest,
    friendRequests,
    acceptFriendRequest,
    denyFriendRequest,
  } = useFirestoreAfterLogin();

  function handleSearch() {
    if (searchRef.current.value.length >= 3)
      setUsers(getUsers(searchRef.current.value));
    else setUsers([]);
  }

  return (
    <div className="addContactContainer">
      <div className="searchContainer px-4 pt-4">
        <Form onSubmit={(e) => e.preventDefault()}>
          <Form.Group className="d-flex">
            <AiOutlineSearch
              style={{
                fontSize: "1.4em",
                color: "white",
                alignSelf: "center",
              }}
            />
            <Form.Control
              onChange={handleSearch}
              ref={searchRef}
              type="text"
              placeholder="Search user"
            ></Form.Control>
          </Form.Group>
        </Form>
      </div>
      <div className="resultsContainer text-light d-flex flex-column">
        {friendRequests.length > 0 && (
          <>
            <span className="lead">Friend Requests</span>
            <Nav
              className="searchUsers d-flex flex-column flex-nowrap mt-3 mb-3"
              style={{ overflow: "auto" }}
            >
              {friendRequests.map((user, index) => {
                return (
                  <Nav.Link
                    key={index}
                    as="div"
                    active="false"
                    className="user d-flex px-3 text-light w-100 align-items-center"
                  >
                    <img
                      alt="thumbnail"
                      src={user.photoURL}
                      style={{
                        minWidth: "40px",
                        width: "40px",
                        height: "40px",
                        borderRadius: "50%",
                      }}
                    ></img>
                    <div className="text-left ml-3 d-flex justify-content-between align-items-center w-100">
                      <span>{user.displayName}</span>
                      <div>
                        {console.log(user)}
                        <FaCheck
                          style={{
                            cursor: "pointer",
                            color: "green",
                            marginRight: "20px",
                          }}
                          onClick={() => acceptFriendRequest(user)}
                        />
                        <FaTimes
                          style={{ cursor: "pointer", color: "red" }}
                          onClick={() => denyFriendRequest(user)}
                        />
                      </div>
                    </div>
                  </Nav.Link>
                );
              })}
            </Nav>
          </>
        )}

        {users.length === 0 && (
          <span className="lead">Search for user to add</span>
        )}
        {users.length > 0 && <span className="lead">Users</span>}
        <Nav
          className="searchUsers d-flex flex-column flex-nowrap mt-3"
          style={{ overflow: "auto" }}
        >
          {users.length > 0 &&
            users.map((user, index) => {
              return (
                <Nav.Link
                  key={index}
                  as="div"
                  active="false"
                  className="user d-flex px-3 text-light w-100 align-items-center"
                  style={{ cursor: "pointer" }}
                  onClick={() => {
                    sendFriendRequest(user);
                    setShow(true);
                  }}
                >
                  <img
                    alt="thumbnail"
                    src={user.photoURL}
                    style={{
                      minWidth: "40px",
                      width: "40px",
                      height: "40px",
                      borderRadius: "50%",
                    }}
                  ></img>
                  <div className="text-left ml-3 d-flex justify-content-between align-items-center w-100">
                    <span>{user.displayName}</span>
                    <AiOutlinePlus style={{ color: "white" }} />
                  </div>
                </Nav.Link>
              );
            })}
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
        <Toast.Body className="d-flex flex-column justify-content-center align-items-center">
          <BsCheck style={{ color: "green", fontSize: "3em" }} />
          Friend request sent to the user!
        </Toast.Body>
      </Toast>
    </div>
  );
}
