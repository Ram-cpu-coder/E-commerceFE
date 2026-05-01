import React, { useState } from "react";
import { Button, Card, Container, Form } from "react-bootstrap";
import { Link } from "react-router-dom";
import LoginForm from "../../components/forms/LoginForm";
import { useDispatch } from "react-redux";
import { resendVerificationLinkAction } from "../../features/user/userAction";

const Login = () => {
  const [email, setEmail] = useState("");
  const [isResending, setIsResending] = useState(false);
  const dispatch = useDispatch();

  const handleResendVerificationLink = (email) => {
    const isEmailSent = dispatch(resendVerificationLinkAction(email));
    if (isEmailSent) {
      setEmail("");
      setIsResending(false);
    }
  };
  return (
    <Container
      className="d-flex justify-content-center align-items-center bg-light"
      style={{ minHeight: "64vh" }}
    >
      <Card
        className="shadow rounded p-4 text-center"
        style={{ width: "100%", maxWidth: "400px" }}
      >
        <Card.Title className="mb-3">Welcome Back!</Card.Title>
        <LoginForm />
        <div className="text-center mt-3">
          Forget Password? <Link to="/forgetpassword">Reset Now</Link>
        </div>
        <p className="m-0">
          New with us? <Link to="/register">Register</Link>
        </p>
        <p className="pt-2 m-0">Or</p>

        {isResending ? (
          <div className="">
            <Form
              className="d-flex align-items-center justify-content-center"
              onSubmit={(e) => {
                e.preventDefault();
                handleResendVerificationLink(email);
              }}
            >
              <div
                className="position-relative"
                style={{ width: "100%", maxWidth: "300px" }}
              >
                <input
                  type="email"
                  name="Email"
                  required
                  onChange={(e) => setEmail(e.target.value)}
                  className="form-control"
                  style={{ paddingRight: "80px" }}
                  placeholder="Your registered Email"
                />

                <Button
                  variant="outline"
                  className="position-absolute top-50 translate-middle-y border-start"
                  style={{ right: "5px" }}
                  type="submit"
                >
                  Resend
                </Button>
              </div>
            </Form>
            <div className="d-flex justify-content-center">
              <Button
                onClick={() => setIsResending(!isResending)}
                variant="light"
                className="mt-2 border"
              >
                Cancel
              </Button>
            </div>
          </div>
        ) : (
          <Button variant="link" onClick={() => setIsResending(!isResending)}>
            Resend Verification link
          </Button>
        )}
      </Card>
    </Container>
  );
};

export default Login;
