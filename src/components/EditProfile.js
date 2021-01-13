import React from "react";
import { Form, Button, Container, Row, Col } from "react-bootstrap";
import { BsBoxArrowInUp, BsArrowLeftShort } from "react-icons/bs";
import { Link } from "react-router-dom";

export default function EditProfile() {
  return (
    <div className="editProfileContainer min-vh-100 d-flex align-items-center justify-content-center flex-column">
      <Link onClick={() => window.history.back()}>
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
        <Form>
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
                    style={{
                      width: "150px",
                      height: "150px",
                      borderRadius: "50%",
                    }}
                    src="https://firebasestorage.googleapis.com/v0/b/flashsend-ece71.appspot.com/o/blank-profile-picture-973460_640.png?alt=media&token=aaa87789-49e5-477d-897a-ab83ce57ccc7"
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
                    type="file"
                    style={{ opacity: "0", position: "absolute", zIndex: "-1" }}
                  ></Form.Control>
                </Form.Label>
              </Form.Group>
            </Col>
            <Col md={6}>
              <Form.Group>
                <Form.Label>First Name</Form.Label>
                <Form.Control type="text"></Form.Control>
              </Form.Group>
            </Col>
            <Col md={6}>
              <Form.Group>
                <Form.Label>Last Name</Form.Label>
                <Form.Control type="text"></Form.Control>
              </Form.Group>
            </Col>
            <Col md={6}>
              <Form.Group>
                <Form.Label>Username</Form.Label>
                <Form.Control type="text"></Form.Control>
              </Form.Group>
            </Col>
            <Col md={6}>
              <Form.Group>
                <Form.Label>Email</Form.Label>
                <Form.Control type="text"></Form.Control>
              </Form.Group>
            </Col>
            <Col md={6}>
              <Form.Group>
                <Form.Label>Password</Form.Label>
                <Form.Control type="password"></Form.Control>
              </Form.Group>
            </Col>
            <Col md={6}>
              <Form.Group>
                <Form.Label>Confirm Password</Form.Label>
                <Form.Control type="password"></Form.Control>
              </Form.Group>
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
            </Col>
          </Row>
        </Form>
      </Container>
    </div>
  );
}
