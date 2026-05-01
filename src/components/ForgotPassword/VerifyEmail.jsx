import React from "react";
import { useState } from "react";
import { Button, Form } from "react-bootstrap";
import { useDispatch } from "react-redux";
import { verifyEmailAndSendOTPAction } from "../../features/user/userAction";

const VerifyEmail = ({
  handleOnChange,
  form,
  setIsVerifyOtpUI,
  setHeading,
}) => {
  const dispatch = useDispatch();
  const [isEmail, setIsEmail] = useState(false);

  const handleOnEmailSubmit = async (e) => {
    e.preventDefault();
    const response = await dispatch(
      verifyEmailAndSendOTPAction({ email: form.email })
    );
    if (response === true) {
      setIsVerifyOtpUI(true);
      setHeading("Enter your OTP...");
      setIsEmail(true);
    }
  };
  return (
    <div className="d-flex gap-3 mb-2">
      <Form.Control
        name="email"
        value={form.email}
        type="email"
        disabled={isEmail ? true : false}
        placeholder="Enter your Email"
        onChange={handleOnChange}
        required
        style={{ height: "2.5rem" }}
      />
      <Button
        variant="primary"
        onClick={handleOnEmailSubmit}
        disabled={isEmail ? true : false}
        style={{ height: "2.5rem", width: "135px" }}
      >
        Send OTP
      </Button>
    </div>
  );
};

export default VerifyEmail;
