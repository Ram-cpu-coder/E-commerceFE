import React from "react";
import RegisterForm from "../../components/forms/RegisterForm";

const Register = () => {
  return (
    <div className="d-flex justify-content-center align-items-center min-vh-100">
      <div style={{ width: "450px" }} className="card p-4 pt-3 shadow-lg">
        <h1 className="text-center mb-2">Sign Up Now</h1>
        <hr className="mt-2 mb-3" />
        <RegisterForm />
      </div>
    </div>
  );
};

export default Register;
