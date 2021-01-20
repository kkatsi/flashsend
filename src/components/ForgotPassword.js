import React, { useRef, useState } from "react";
import { Link, useHistory } from "react-router-dom";
import { BsArrowLeftShort } from "react-icons/bs";
import { Form, Button, Toast, Spinner } from "react-bootstrap";
import { useAuth } from "../contexts/AuthContext";
import { FaCheck, FaTimes } from "react-icons/fa";

export default function ForgotPassword() {
  const emailRef = useRef();
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState(false);
  const [errorText, setErrorText] = useState(false);
  const { resetPassword } = useAuth();
  const history = useHistory();
  function handleSubmit(e) {
    e.preventDefault();
    const promises = [];
    setSuccess(false);
    setError(false);
    setErrorText("");
    setLoading(true);
    promises.push(resetPassword(emailRef.current.value));
    Promise.all(promises)
      .then(() => {
        setSuccess(true);
      })
      .catch((error) => {
        setError(true);
        setErrorText(error.message);
      })
      .finally(() => {
        setTimeout(() => {
          setLoading(false);
        }, 2500);
      });
  }
  return (
    <div className="forgotPasswordContainer min-vh-100 d-flex align-items-center justify-content-center flex-column">
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
          fontWeight: "bold",
          textShadow: "3px 3px 2px red",
        }}
      >
        Password Reset
      </header>
      <content className="container d-flex justify-content-center p-4">
        <Form onSubmit={handleSubmit} className="col-md-6">
          <Form.Group>
            <Form.Label>Email</Form.Label>
            <Form.Control ref={emailRef} type="email" required></Form.Control>
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
            Reset
          </Button>
          <small className="text-white" style={{ fontSize: ".9rem" }}>
            We will send you instructions on how to reset your password!
          </small>
        </Form>
      </content>
      {/* display overlay with toasts when user creating account */}
      {loading && (
        <div
          className="min-vh-100 w-100 d-flex align-items-center justify-content-center position-absolute"
          style={{ backgroundColor: "rgba(0,0,0,0.8)", zIndex: "999" }}
        >
          {/* display spinner as long as waiting for firebase response */}
          {!error && !success && (
            <Spinner animation="border" role="status" variant="danger">
              <span className="sr-only">Loading...</span>
            </Spinner>
          )}
          {/* display this toast if response is success */}
          {success && (
            <Toast
              style={{ maxWidth: "800px", minWidth: "350px" }}
              onClose={() => {
                setLoading(false);
                history.push("/login");
              }}
            >
              <Toast.Header className="d-flex justify-content-end"></Toast.Header>
              <Toast.Body className="d-flex flex-column justify-content-center align-items-center">
                <FaCheck
                  style={{
                    color: "green",
                    fontSize: "2.5rem",
                    marginBottom: "20px",
                  }}
                />
                <strong>
                  Visit yor email to follow the instruction on how to reset your
                  password!
                </strong>
              </Toast.Body>
            </Toast>
          )}
          {/* display this toast if request fails */}
          {error && (
            <Toast onClose={() => setLoading(false)}>
              <Toast.Header className="d-flex justify-content-end"></Toast.Header>
              <Toast.Body className="d-flex flex-column justify-content-center align-items-center">
                <FaTimes
                  style={{
                    color: "red",
                    fontSize: "2rem",
                    marginBottom: "20px",
                  }}
                />

                <strong>{errorText}</strong>
              </Toast.Body>
            </Toast>
          )}
        </div>
      )}
    </div>
  );
}
