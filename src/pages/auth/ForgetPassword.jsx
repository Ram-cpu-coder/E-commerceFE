import React, { use, useState } from "react";
import { Form } from "react-bootstrap";
import OTPForm from "../../components/ForgotPassword/OTPForm";
import VerifyEmail from "../../components/ForgotPassword/VerifyEmail";
import UpdatePassword from "../../components/ForgotPassword/UpdatePassword";
import useform from "../../hooks/useForm";
import { useLocation } from "react-router-dom";

const ForgetPassword = () => {
  const [heading, setHeading] = useState("Verify Your Email");
  const [isVerifyOtpUI, setIsVerifyOtpUI] = useState(false);
  const [isPassword, setIsPassword] = useState(false);

  const location = useLocation();

  const { form, handleOnChange, setForm } = useform({
    email: "",
    password: "",
    confirmPassword: "",
  });
  const from = location.state?.from?.pathname || "/login";
  return (
    <div
      className="d-flex justify-content-center align-items-center"
      style={{ minHeight: "50vh" }}
    >
      <div className="d-flex w-lg-100 w-md-75 w-sm-50 mx-2 justify-content-center align-items-center py-4 px-5 border">
        <Form className="d-flex flex-column">
          <h1 className="text-center">{heading}</h1>
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
      </div>
    </div>
  );
};

export default ForgetPassword;
