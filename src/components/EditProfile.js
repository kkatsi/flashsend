import React, { useState, useRef, useEffect } from "react";
import {
  Form,
  Button,
  Container,
  Row,
  Col,
  Toast,
  Spinner,
  ProgressBar,
} from "react-bootstrap";
import { BsBoxArrowInUp, BsArrowLeftShort } from "react-icons/bs";
import { FaTimes, FaCheck } from "react-icons/fa";
import { Link, useHistory } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import { useFirestoreBeforeLogin } from "../contexts/FirestoreBeforeLoginContext";
import firebase from "firebase/app";
import "firebase/storage";

export default function EditProfile() {
  const {
    updateEmail,
    updatePassword,
    updateProfile,
    sendEmailVerification,
    currentUser,
  } = useAuth();
  const { updateUser } = useFirestoreBeforeLogin();
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState(false);
  const [lengthError, setLengthError] = useState(false);
  const [matchingError, setMatchingError] = useState(false);
  const [errorText, setErrorText] = useState("");
  const [uploadLoading, setUploadLoading] = useState(false);
  const [progress, setProgress] = useState(0);
  const prevEmail = currentUser.email;
  const history = useHistory();
  const fileRef = useRef();
  const nameRef = useRef();
  const emailRef = useRef();
  const passRef = useRef();
  const confPassRef = useRef();

  function handleSubmit(e) {
    e.preventDefault();
    setError(false);
    setLengthError(false);
    setMatchingError(false);
    setSuccess(false);
    setUploadLoading(false);

    //initial checks for password requirements
    if (passRef.current.value !== "" && passRef.current.value.length < 6) {
      setLengthError(true);
      passRef.current.focus();
      return;
    }
    if (passRef.current.value !== confPassRef.current.value) {
      setMatchingError(true);
      passRef.current.focus();
      return;
    }

    let promises = [];
    //first uploadImage as a promise if a file is selected.
    if (fileRef.current.files.length > 0) {
      setLoading(true);
      promises.push(
        new Promise((resolve, reject) =>
          uploadImage(
            fileRef.current.files[0],
            currentUser.uid,
            resolve,
            reject
          )
        )
      );
    }
    //if promise has items (in our case if uploadImage called)
    if (promises.length > 0)
      //wait uploadImage to execute
      Promise.all(promises).then((values) => {
        promises = [];
        //store imageurl
        const resolveURL = values[0];
        //check for changes in displayName, if so update
        if (
          nameRef.current.value !== currentUser.displayName ||
          fileRef.current.files.length > 0
        ) {
          promises.push(
            updateProfile(currentUser, {
              name: nameRef.current.value,
              url: resolveURL,
            })
          );

          promises.push(
            updateUser({
              uid: currentUser.uid,
              displayName: nameRef.current.value,
              photoURL: resolveURL,
            })
          );
        }
        //check for changes in email, is so update
        if (emailRef.current.value !== currentUser.email) {
          promises.push(updateEmail(emailRef.current.value));
        }
        //check for changes in password, if so update
        if (passRef.current.value !== "")
          promises.push(updatePassword(passRef.current.value));

        //wait all these functions to execute
        Promise.all(promises)
          .then(() => {
            //if email changed send verification mail to new mail address
            if (prevEmail !== currentUser.email) {
              sendEmailVerification(currentUser);
            }

            setSuccess(true);
            setTimeout(() => {
              setLoading(false);
            }, 3000);
          })
          .catch((error) => {
            setError(true);
            setErrorText(error.message);
          });
      });
    //if uploadImage didnt called do the same checks for the other account info,and execute functions
    else {
      if (nameRef.current.value !== currentUser.displayName) {
        promises.push(
          updateProfile(currentUser, {
            name: nameRef.current.value,
          })
        );
        promises.push(
          updateUser({
            uid: currentUser.uid,
            displayName: nameRef.current.value,
            photoURL: currentUser.photoURL,
          })
        );
      }

      if (emailRef.current.value !== currentUser.email) {
        promises.push(updateEmail(emailRef.current.value));
      }

      if (passRef.current.value !== "")
        promises.push(updatePassword(passRef.current.value));

      if (promises.length > 0) {
        setLoading(true);
        Promise.all(promises)
          .then(() => {
            if (prevEmail !== currentUser.email)
              sendEmailVerification(currentUser);
            setSuccess(true);
            setTimeout(() => {
              setLoading(false);
            }, 3000);
          })
          .catch((error) => {
            setError(true);
            setErrorText(error.message);
          });
      }
    }
  }

  function handleChange() {
    const fr = new FileReader();
    fr.onload = function () {
      document.querySelector(".profImage").src = fr.result;
    };
    fr.readAsDataURL(fileRef.current.files[0]);
  }

  function uploadImage(file, uid, resolve, reject) {
    var storageRef = firebase.storage().ref();
    const metadata = {
      contentType: file.type,
    };
    const uploadTask = storageRef
      .child(`flashsend/${uid}/profilePic/${file.name}`)
      .put(file, metadata);
    setUploadLoading(true);
    uploadTask.on(
      "state_changed",
      function (snapshot) {
        // Observe state change events such as progress, pause, and resume
        // Get task progress, including the number of bytes uploaded and the total number of bytes to be uploaded
        var progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        setProgress(progress);
        console.log("Upload is " + progress + "% done");
      },
      function (error) {
        reject();
        // Handle unsuccessful uploads
      },
      function () {
        // Handle successful uploads on complete
        // For instance, get the download URL: https://firebasestorage.googleapis.com/...
        uploadTask.snapshot.ref.getDownloadURL().then(function (downloadURL) {
          console.log("File available at", downloadURL);

          setUploadLoading(false);
          resolve(downloadURL);
        });
      }
    );
  }

  return (
    <div className="editProfileContainer min-vh-100 d-flex align-items-center justify-content-center flex-column">
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
          fontSize: "3rem",
          color: "white",
          textShadow: "2px 2px 2px red",
        }}
      >
        Profile
      </header>
      <Container className="d-flex justify-content-center p-4">
        <Form onSubmit={handleSubmit}>
          <Row className="w-100 mx-0">
            <Col md={12} className="d-flex justify-content-center mb-4">
              <Form.Group
                className="col-5 d-flex justify-content-center"
                style={{ position: "relative", overflow: "initial" }}
              >
                <Form.Label
                  style={{
                    cursor: "pointer",
                    position: "relative",
                    overflow: "initial",
                  }}
                >
                  <img
                    className="profImage"
                    style={{
                      width: "150px",
                      height: "150px",
                      borderRadius: "50%",
                    }}
                    src={
                      currentUser.photoURL
                        ? currentUser.photoURL
                        : "https://firebasestorage.googleapis.com/v0/b/flashsend-ece71.appspot.com/o/blank-profile-picture-973460_640.png?alt=media&token=aaa87789-49e5-477d-897a-ab83ce57ccc7"
                    }
                  />
                  <div
                    className="profilePhotoOverlay"
                    style={{ display: "none" }}
                  >
                    <BsBoxArrowInUp
                      style={{
                        fontSize: "3em",
                        position: "absolute",
                        left: "0",
                        right: "0",
                        top: "0",
                        bottom: "0",
                        margin: "auto",
                      }}
                    />
                  </div>
                  <Form.Control
                    onChange={handleChange}
                    ref={fileRef}
                    type="file"
                    style={{ opacity: "0", position: "absolute", zIndex: "-1" }}
                  ></Form.Control>
                </Form.Label>
              </Form.Group>
            </Col>
            <Col md={6}>
              <Form.Group>
                <Form.Label>Full Name</Form.Label>
                <Form.Control
                  ref={nameRef}
                  type="text"
                  defaultValue={currentUser.displayName}
                ></Form.Control>
              </Form.Group>
            </Col>
            <Col md={6}>
              <Form.Group>
                <Form.Label>Email</Form.Label>
                <Form.Control
                  ref={emailRef}
                  type="text"
                  defaultValue={currentUser.email}
                ></Form.Control>
              </Form.Group>
            </Col>
            <Col md={6}>
              <Form.Group>
                <Form.Label>Password</Form.Label>
                <Form.Control ref={passRef} type="password"></Form.Control>
              </Form.Group>
            </Col>
            <Col md={6}>
              <Form.Group>
                <Form.Label>Confirm Password</Form.Label>
                <Form.Control ref={confPassRef} type="password"></Form.Control>
              </Form.Group>
            </Col>
            <Col md={12}>
              <Form.Text className="text-light">
                <em>
                  Fill password field, only if you want to change your password.
                  Else leave it blank.
                </em>
              </Form.Text>
            </Col>
            <Col md={12} className="mt-3">
              <Button
                type="submit"
                className="bg-light text-dark font-weight-bold mt-4 mb-2"
                style={{
                  borderRadius: "0",
                  boxShadow: "4px 4px 2px red",
                  fontSize: "1.2rem",
                }}
              >
                Update
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
            </Col>
          </Row>
        </Form>
      </Container>
      {/* display overlay with toasts when user creating account */}
      {loading && (
        <div
          className="min-vh-100 w-100 d-flex align-items-center justify-content-center position-absolute"
          style={{ backgroundColor: "rgba(0,0,0,0.8)", zIndex: "999" }}
        >
          {/* display spinner as long as waiting for firebase response */}
          {!success && !error && !uploadLoading && (
            <Spinner animation="border" role="status" variant="danger">
              <span className="sr-only">Loading...</span>
            </Spinner>
          )}
          {/* display this toast if image is uploading \\*/}
          {uploadLoading && (
            <Toast
              style={{ maxWidth: "800px", minWidth: "350px" }}
              onClose={() => {
                setLoading(false);
              }}
            >
              <Toast.Header className="d-flex justify-content-end"></Toast.Header>
              <Toast.Body className="d-flex flex-column">
                <strong className="my-3">Uploading Profile Image...</strong>
                <ProgressBar animated variant="danger" now={progress} />
              </Toast.Body>
            </Toast>
          )}
          {/* display this toast if response is success */}
          {success && (
            <Toast
              style={{ maxWidth: "800px", minWidth: "350px" }}
              onClose={() => {
                setLoading(false);
              }}
            >
              <Toast.Header className="d-flex justify-content-end"></Toast.Header>
              <Toast.Body className="d-flex flex-column justify-content-center align-items-center">
                <FaCheck
                  style={{
                    color: "green",
                    fontSize: "2rem",
                    marginBottom: "20px",
                  }}
                />
                <strong>You profile information updated successfully</strong>
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
