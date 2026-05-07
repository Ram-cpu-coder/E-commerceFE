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

  const handleResendVerificationLink = (emailValue) => {
    const isEmailSent = dispatch(resendVerificationLinkAction(emailValue));
    if (isEmailSent) {
      setEmail("");
      setIsResending(false);
    }
  };

  return (
    <div className="auth-page app-page">
      <Container className="d-flex justify-content-center align-items-center py-4">
        <Card className="auth-card border-0">
          <Card.Body className="p-0">
            <Card.Title className="mb-4 text-center fs-4">Welcome back</Card.Title>
            <LoginForm />
            <div className="text-center mt-3 small">
              <span className="text-muted">Forgot password?</span>{" "}
              <Link to="/forgetpassword">Reset</Link>
            </div>
            <p className="text-center small mb-0 mt-3 text-muted">
              New here? <Link to="/register">Create an account</Link>
            </p>

            <hr className="my-4 opacity-25" />

            {isResending ? (
              <div>
                <Form
                  className="d-flex flex-column gap-2"
                  onSubmit={(e) => {
                    e.preventDefault();
                    handleResendVerificationLink(email);
                  }}
                >
                  <Form.Label className="small text-muted mb-0">
                    Resend activation email
                  </Form.Label>
                  <div className="position-relative">
                    <Form.Control
                      type="email"
                      name="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="Your registered email"
                      className="pe-5"
                    />
                    <Button
                      variant="primary"
                      size="sm"
                      className="position-absolute top-50 end-0 translate-middle-y me-1"
                      type="submit"
                    >
                      Send
                    </Button>
                  </div>
                </Form>
                <div className="d-flex justify-content-center mt-2">
                  <Button
                    type="button"
                    variant="light"
                    size="sm"
                    className="border"
                    onClick={() => setIsResending(false)}
                  >
                    Cancel
                  </Button>
                </div>
              </div>
            ) : (
              <div className="text-center">
                <Button
                  type="button"
                  variant="link"
                  className="small p-0"
                  onClick={() => setIsResending(true)}
                >
                  Resend verification link
                </Button>
              </div>
            )}
          </Card.Body>
        </Card>
      </Container>
    </div>
  );
};

export default Login;
