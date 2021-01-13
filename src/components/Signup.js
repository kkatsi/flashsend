import React from "react";
import { Form, Button, Container } from "react-bootstrap";
import { Link } from "react-router-dom";
import { BsArrowLeftShort } from "react-icons/bs";

export default function Signup() {
  return (
    <div className="signUpContainer min-vh-100 d-flex align-items-center justify-content-center flex-column">
      <Link to="/">
        <BsArrowLeftShort
          style={{
            position: "absolute",
            fontSize: "3em",
            top: "5%",
            left: "5%",
            color: "white",
          }}
        />
      </Link>
      <header
        style={{
          color: "white",
          textShadow: "2px 2px 2px red",
        }}
      >
        Create your account!
      </header>
      <Container className="container d-flex justify-content-center p-4">
        <Form className="col-md-6">
          <Form.Group>
            <Form.Label>
              Username <span className="text-danger">*</span>
            </Form.Label>
            <Form.Control type="text" required></Form.Control>
          </Form.Group>
          <Form.Group>
            <Form.Label>
              Email <span className="text-danger">*</span>
            </Form.Label>
            <Form.Control type="email" required></Form.Control>
          </Form.Group>
          <Form.Group>
            <Form.Label>
              Password <span className="text-danger">*</span>
            </Form.Label>
            <Form.Control type="password" required></Form.Control>
          </Form.Group>
          <Form.Group>
            <Form.Label>
              Confirm Password <span className="text-danger">*</span>
            </Form.Label>
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
            Create Account
          </Button>
        </Form>
      </Container>
    </div>
  );
}
