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
  const handleOnOTPSubmit = async (e) => {
    e.preventDefault();
    const response = await dispatch(
      verifyOTP({ Otp: form.Otp, email: form.email })
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
      Otp: Number(otpValue),
    }));
  };
  const handleOnEmailSubmit = async () => {
    setIsOTP(false);
    form.Otp = "";
    await dispatch(verifyEmailAndSendOTPAction({ email: form.email }));
  };

  return (
    isVerifyOtpUI && (
      <div className="d-flex flex-column">
        <div className="d-flex  gap-3 mb-2">
          <OTPInput
            value={form.Otp}
            // name="otp"
            inputType="number"
            onChange={handleOnChange}
            numInputs={6}
            renderSeparator={<span></span>}
            renderInput={(props) => (
              <input {...props} disabled={isOTP ? true : false} />
            )}
            inputStyle={{
              width: "2.5rem",
              height: "2.5rem",
              margin: "0 0.5rem",
              fontSize: "1.5rem",
              borderRadius: "8px",
              border: "1px solid #ced4da",
            }}
            focusStyle={{
              border: "2px solid #007bff",
              outline: "none",
            }}
          />
          <Button
            variant="primary"
            disabled={isOTP ? true : false}
            onClick={handleOnOTPSubmit}
            style={{ height: "2.5rem", width: "110px" }}
          >
            Verify OTP
          </Button>
        </div>
        <p className="px-2">
          Didn't get OTP?{" "}
          <Button onClick={handleOnEmailSubmit} variant="link">
            Resend
          </Button>
        </p>
      </div>
    )
  );
};

export default OTPForm;
