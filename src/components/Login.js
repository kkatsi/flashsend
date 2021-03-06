import React, { useRef, useState, useEffect } from "react";
import { Form, Button, Toast, Spinner } from "react-bootstrap";
import { FaPaperPlane, FaTimes } from "react-icons/fa";
import { Link, useHistory } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";

export default function Login() {
  const { login, isVerified, currentUser } = useAuth();
  const emailRef = useRef();
  const passRef = useRef();
  const history = useHistory();
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState(false);
  const [verified, setVerified] = useState(true);
  const [errorText, setErrorText] = useState("");

  async function handleSubmit(e) {
    e.preventDefault();
    setLoading(true);
    setVerified(true);
    setError(false);
    setSuccess(false);
    setErrorText("");

    login(emailRef.current.value, passRef.current.value)
      .then(() => {
        setSuccess(true);
      })
      .catch((error) => {
        setError(true);
        setErrorText(error.message);
      });
  }

  useEffect(() => {
    if (success) {
      setVerified(isVerified);

      if (isVerified) setLoading(false);
    }
    // return () => {
    //   cleanup;
    // };
  }, [success]);
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
        <Form onSubmit={handleSubmit} className="col-md-6">
          <Form.Group>
            <Form.Label>Email</Form.Label>
            <Form.Control ref={emailRef} type="email" required></Form.Control>
          </Form.Group>
          <Form.Group>
            <Form.Label>Password</Form.Label>
            <Form.Control ref={passRef} type="password" required></Form.Control>
            <Form.Text
              className="text-white text-center"
              style={{ fontSize: ".9rem" }}
            >
              Forgot your password?{" "}
              <Link to="/reset-password" className="text-danger">
                Reset
              </Link>
            </Form.Text>
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
      {/* display overlay with toasts when user creating account */}
      {loading && (
        <div
          className="min-vh-100 w-100 d-flex align-items-center justify-content-center position-absolute"
          style={{ backgroundColor: "rgba(0,0,0,0.8)", zIndex: "999" }}
        >
          {/* display spinner as long as waiting for firebase response */}
          {!error && verified && (
            <Spinner animation="border" role="status" variant="danger">
              <span className="sr-only">Loading...</span>
            </Spinner>
          )}
          {/* display this toast if request fails */}

          {(error || !verified) && (
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

                <strong>
                  {error
                    ? errorText
                    : "You must verify your email before logging in! Instructions are included in the email we sent you with your signup!"}
                </strong>
              </Toast.Body>
            </Toast>
          )}
        </div>
      )}
    </div>
  );
}
