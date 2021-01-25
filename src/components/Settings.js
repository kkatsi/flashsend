import React from "react";
import { Nav } from "react-bootstrap";
import { NavLink, useHistory } from "react-router-dom";
import { IoIosArrowForward } from "react-icons/io";
import { useAuth } from "../contexts/AuthContext";

export default function Settings() {
  const { logout } = useAuth();
  const history = useHistory();
  async function handleLogout() {
    try {
      await logout();
      window.location.href = "/";
    } catch {
      console.log("error");
    }
  }
  return (
    <div className="settingsContainer text-light d-flex flex-column">
      <span className="lead mt-3">Settings</span>
      <Nav
        className="d-flex flex-column flex-nowrap mt-3"
        style={{ overflow: "auto" }}
      >
        <Nav.Link
          as={NavLink}
          to={`/edit-profile`}
          active="false"
          className="user d-flex px-3 text-light w-100 justify-content-between align-items-center"
          style={{ cursor: "pointer" }}
        >
          Edit Profile
          <IoIosArrowForward style={{ fontSize: "1.2em" }} />
        </Nav.Link>
        <Nav.Link
          as="div"
          onClick={handleLogout}
          active="false"
          className="user d-flex px-3 text-light w-100 align-items-center"
          style={{ cursor: "pointer" }}
        >
          Logout
        </Nav.Link>
      </Nav>
    </div>
  );
}
