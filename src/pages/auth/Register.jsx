import React from "react";
import { Container } from "react-bootstrap";
import { Link } from "react-router-dom";
import RegisterForm from "../../components/forms/RegisterForm";

const Register = () => {
  return (
    <div className="auth-page app-page">
      <Container className="d-flex justify-content-center align-items-center py-4">
        <div className="auth-card">
          <h1 className="text-center mb-2 fs-4 fw-semibold">Create account</h1>
          <p className="text-center text-muted small mb-4">
            Already have an account? <Link to="/login">Log in</Link>
          </p>
          <RegisterForm />
        </div>
      </Container>
    </div>
  );
};

export default Register;
