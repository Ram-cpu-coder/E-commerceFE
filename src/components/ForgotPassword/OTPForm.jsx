import React, { useState } from "react";
import { Button } from "react-bootstrap";
import OTPInput from "react-otp-input";
import { useDispatch } from "react-redux";
import {
  verifyEmailAndSendOTPAction,
  verifyOTP,
} from "../../features/user/userAction";

const OTPForm = ({
  form,
  setForm,
  isVerifyOtpUI,
  setIsPassword,
  setHeading,
}) => {
  const dispatch = useDispatch();
  const [isOTP, setIsOTP] = useState(false);
  const [isResending, setIsResending] = useState(false);

  const handleOnOTPSubmit = async (e) => {
    e.preventDefault();

    const response = await dispatch(
      verifyOTP({
        Otp: String(form.Otp),
        email: form.email,
      }),
    );

    if (response === true) {
      setIsOTP(true);
      setIsPassword(true);
      setHeading("Enter your password...");
    }
  };

  const handleOnChange = (otpValue) => {
    setForm((prev) => ({
      ...prev,
      Otp: otpValue,
    }));
  };

  const handleOnEmailSubmit = async () => {
    if (isResending) return;
    setIsResending(true);
    setIsOTP(false);

    setForm((prev) => ({
      ...prev,
      Otp: "",
    }));

    await dispatch(verifyEmailAndSendOTPAction({ email: form.email }));
    setTimeout(() => setIsResending(false), 30000);
  };

  return (
    isVerifyOtpUI && (
      <div className="forgot-otp-section">
        <div className="forgot-otp-row">
          <OTPInput
            value={form.Otp || ""}
            inputType="number"
            onChange={handleOnChange}
            numInputs={6}
            renderSeparator={<span></span>}
            renderInput={(props) => <input {...props} disabled={isOTP} />}
            inputStyle={{
              width: "2.75rem",
              height: "2.75rem",
              margin: "0 0.25rem",
              fontSize: "1.25rem",
              borderRadius: "8px",
              border: "1px solid rgba(24, 24, 27, 0.16)",
              background: "#fff",
            }}
            focusStyle={{
              border: "2px solid #007bff",
              outline: "none",
            }}
          />

          <Button
            variant="primary"
            disabled={isOTP || String(form.Otp || "").length !== 6}
            onClick={handleOnOTPSubmit}
          >
            Verify OTP
          </Button>
        </div>

        <p className="forgot-resend-copy">
          Didn't get OTP?{" "}
          <Button onClick={handleOnEmailSubmit} variant="link" disabled={isResending}>
            {isResending ? "Try again in 30s" : "Resend"}
          </Button>
        </p>
      </div>
    )
  );
};

export default OTPForm;
