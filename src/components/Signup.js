import React, { useRef, useState, useEffect } from "react";
import { Form, Button, Container, Toast, Spinner, Card } from "react-bootstrap";
import { Link, useHistory } from "react-router-dom";
import { BsArrowLeftShort } from "react-icons/bs";
import { FaTimes } from "react-icons/fa";
import { FiAlertCircle } from "react-icons/fi";
import { useAuth } from "../contexts/AuthContext";
import { useFirestoreBeforeLogin } from "../contexts/FirestoreBeforeLoginContext";

export default function Signup() {
  const {
    signup,
    sendEmailVerification,
    currentUser,
    updateProfile,
  } = useAuth();
  const { createUser } = useFirestoreBeforeLogin();
  const nameRef = useRef();
  const emailRef = useRef();
  const passRef = useRef();
  const confPassRef = useRef();
  const [error, setError] = useState(false);
  const [errorText, setErrorText] = useState("");
  const [success, setSuccess] = useState(false);
  const [lengthError, setLengthError] = useState(false);
  const [matchingError, setMatchingError] = useState(false);
  const [loading, setLoading] = useState(false);
  const history = useHistory();

  async function handleSubmit(e) {
    e.preventDefault();
    setError(false);
    setLengthError(false);
    setMatchingError(false);
    setSuccess(false);
    if (
      passRef.current.value.length >= 6 &&
      passRef.current.value === confPassRef.current.value
    ) {
      setLoading(true);

      signup(emailRef.current.value, passRef.current.value)
        .then(function (value) {
          setSuccess(true);
        })
        .catch(function (error) {
          setError(true);
          setErrorText(error.message);
        });
    }

    if (passRef.current.value.length < 6) {
      setLengthError(true);
      passRef.current.focus();
    }
    if (passRef.current.value !== confPassRef.current.value) {
      setMatchingError(true);
      passRef.current.focus();
    }
  }

  useEffect(() => {
    let unsubscribeVerification;
    let unsubscribeName;
    let unsubCreateUser;
    console.log("test", currentUser);
    if (currentUser) {
      unsubscribeName = updateProfile(currentUser, {
        name: nameRef.current.value,
      }).finally(() => {
        unsubCreateUser = createUser({
          uid: currentUser.uid,
          displayName: currentUser.displayName,
          photoURL:
            "https://firebasestorage.googleapis.com/v0/b/flashsend-ece71.appspot.com/o/blank-profile-picture-973460_640.png?alt=media&token=aaa87789-49e5-477d-897a-ab83ce57ccc7",
        });
      });
      unsubscribeVerification = sendEmailVerification(currentUser);
    }

    return [unsubscribeName, unsubscribeVerification, unsubCreateUser];
  }, [currentUser]);
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
        <Form onSubmit={handleSubmit} className="col-md-6">
          <Form.Group>
            <Form.Label>
              Full Name <span className="text-danger">*</span>
            </Form.Label>
            <Form.Control ref={nameRef} type="text" required></Form.Control>
          </Form.Group>
          <Form.Group>
            <Form.Label>
              Email <span className="text-danger">*</span>
            </Form.Label>
            <Form.Control ref={emailRef} type="email" required></Form.Control>
          </Form.Group>
          <Form.Group>
            <Form.Label>
              Password <span className="text-danger">*</span>
            </Form.Label>
            <Form.Control ref={passRef} type="password" required></Form.Control>
            <Form.Text className="text-danger">
              Password should be at least 6 characters.
            </Form.Text>
          </Form.Group>
          <Form.Group>
            <Form.Label>
              Confirm Password <span className="text-danger">*</span>
            </Form.Label>
            <Form.Control
              ref={confPassRef}
              type="password"
              required
            ></Form.Control>
          </Form.Group>
          <Button
            disabled={loading}
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
          {/* display toast if password contains less than 6 characters */}
          {lengthError && (
            <Toast className="mx-auto mt-4">
              <Toast.Body className="bg-danger text-light">
                <strong>Password should be at least 6 characters</strong>
              </Toast.Body>
            </Toast>
          )}
          {/* display toast if passwords doesnt match */}
          {matchingError && (
            <Toast className="mx-auto mt-4">
              <Toast.Body className="bg-danger text-light">
                <strong>Passwords do not match</strong>
              </Toast.Body>
            </Toast>
          )}
        </Form>
      </Container>
      {/* display overlay with toasts when user creating account */}
      {loading && (
        <div
          className="min-vh-100 w-100 d-flex align-items-center justify-content-center position-absolute"
          style={{ backgroundColor: "rgba(0,0,0,0.8)", zIndex: "999" }}
        >
          {/* display spinner as long as waiting for firebase response */}
          {!success && !error && (
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
                <FiAlertCircle
                  style={{
                    color: "orange",
                    fontSize: "2.5rem",
                    marginBottom: "20px",
                  }}
                />
                <strong>
                  Your account created successfully! You need to verify your
                  email address by following the instructions included in the
                  mail we sent you!
                </strong>
              </Toast.Body>
            </Toast>
          )}
          {/* display this toast if request fails */}
          {error && (
            <Toast
              style={{ maxWidth: "800px", minWidth: "350px" }}
              onClose={() => setLoading(false)}
            >
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
