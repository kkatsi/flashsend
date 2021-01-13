import React from "react";
import { Nav } from "react-bootstrap";
import { NavLink } from "react-router-dom";
import { IoIosArrowForward } from "react-icons/io";

export default function Settings() {
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
          as={NavLink}
          to={`/`}
          active="false"
          className="user d-flex px-3 text-light w-100 align-items-center"
          style={{ cursor: "pointer" }}
        >
          Log out
        </Nav.Link>
      </Nav>
    </div>
  );
}
