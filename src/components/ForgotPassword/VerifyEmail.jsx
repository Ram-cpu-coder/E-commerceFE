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
  const [isSending, setIsSending] = useState(false);

  const handleOnEmailSubmit = async (e) => {
    e.preventDefault();
    if (isSending || isEmail) return;
    setIsSending(true);
    const response = await dispatch(
      verifyEmailAndSendOTPAction({ email: form.email })
    );
    if (response === true) {
      setIsVerifyOtpUI(true);
      setHeading("Enter your OTP...");
      setIsEmail(true);
    }
    setIsSending(false);
  };
  return (
    <div className="forgot-password-row">
      <Form.Control
        name="email"
        value={form.email}
        type="email"
        disabled={isEmail ? true : false}
        placeholder="Enter your registered email"
        onChange={handleOnChange}
        required
      />
      <Button
        variant="primary"
        onClick={handleOnEmailSubmit}
        disabled={isEmail || isSending}
      >
        {isSending ? "Sending..." : "Send OTP"}
      </Button>
    </div>
  );
};

export default VerifyEmail;
