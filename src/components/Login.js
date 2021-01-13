import React from "react";
import { Form, Button } from "react-bootstrap";
import { FaPaperPlane } from "react-icons/fa";
import { Link } from "react-router-dom";

export default function Login() {
  return (
    <div className="loginContainer min-vh-100 d-flex align-items-center justify-content-center flex-column">
      <FaPaperPlane className="paper-plane d-none d-md-block" />
      <header
        style={{
          color: "white",
          fontWeight: "bold",
          textShadow: "6px 6px 2px red",
        }}
      >
        FlashSend
      </header>
      <content className="container d-flex justify-content-center p-4">
        <Form className="col-md-6">
          <Form.Group>
            <Form.Label>Email</Form.Label>
            <Form.Control type="email" required></Form.Control>
          </Form.Group>
          <Form.Group>
            <Form.Label>Password</Form.Label>
            <Form.Control type="password" required></Form.Control>
          </Form.Group>
          <Button
            type="submit"
            className="bg-light text-dark font-weight-bold w-100 mt-4 mb-2"
            style={{
              borderRadius: "0",
              boxShadow: "6px 6px 2px red",
              fontSize: "1.2rem",
            }}
          >
            Login
          </Button>
          <small className="text-white" style={{ fontSize: ".9rem" }}>
            New to FlashSend?{" "}
            <Link to="/signup" className="text-danger">
              Create an account
            </Link>
          </small>
        </Form>
      </content>
    </div>
  );
}
