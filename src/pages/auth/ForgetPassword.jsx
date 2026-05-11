import React, { useState } from "react";
import { Form } from "react-bootstrap";
import OTPForm from "../../components/ForgotPassword/OTPForm";
import VerifyEmail from "../../components/ForgotPassword/VerifyEmail";
import UpdatePassword from "../../components/ForgotPassword/UpdatePassword";
import useform from "../../hooks/useForm";
import { Link, useLocation } from "react-router-dom";
import { IoLockClosedOutline, IoMailOutline, IoShieldCheckmarkOutline } from "react-icons/io5";

const ForgetPassword = () => {
  const [heading, setHeading] = useState("Verify Your Email");
  const [isVerifyOtpUI, setIsVerifyOtpUI] = useState(false);
  const [isPassword, setIsPassword] = useState(false);

  const location = useLocation();

  const { form, handleOnChange, setForm } = useform({
    email: "",
    Otp: "",
    password: "",
    confirmPassword: "",
  });
  const from = location.state?.from?.pathname || "/login";
  return (
    <div className="forgot-password-page">
      <section className="forgot-password-card">
        <div className="forgot-password-icon">
          {isPassword ? (
            <IoLockClosedOutline aria-hidden />
          ) : isVerifyOtpUI ? (
            <IoShieldCheckmarkOutline aria-hidden />
          ) : (
            <IoMailOutline aria-hidden />
          )}
        </div>
        <p className="section-kicker">Account recovery</p>
        <h1>{heading}</h1>
        <p className="forgot-password-copy">
          We will verify your email with a one-time code before allowing a new
          password.
        </p>
        <Form className="forgot-password-form">
          <VerifyEmail
            handleOnChange={handleOnChange}
            form={form}
            setIsVerifyOtpUI={setIsVerifyOtpUI}
            setHeading={setHeading}
          />
          <OTPForm
            handleOnChange={handleOnChange}
            form={form}
            setForm={setForm}
            setHeading={setHeading}
            isVerifyOtpUI={isVerifyOtpUI}
            setIsPassword={setIsPassword}
          />
          <UpdatePassword
            handleOnChange={handleOnChange}
            form={form}
            isPassword={isPassword}
            from={from}
          />
        </Form>
        <Link className="forgot-password-back" to="/login">
          Back to login
        </Link>
      </section>
    </div>
  );
};

export default ForgetPassword;
