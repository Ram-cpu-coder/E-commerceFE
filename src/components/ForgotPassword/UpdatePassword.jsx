import React from "react";
import { Button, Form } from "react-bootstrap";
import { updatePwAction } from "../../features/user/userAction";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";

const UpdatePassword = ({ handleOnChange, form, isPassword, from }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const handleOnUpdatePw = async (e) => {
    e.preventDefault();
    const response = await dispatch(
      updatePwAction({
        email: form.email,
        Otp: form.Otp,
        password: form.password,
        confirmPassword: form.confirmPassword,
      })
    );
    if (response === true) {
      navigate(from, { replace: true });
    }
  };
  return (
    isPassword && (
      <div className="forgot-password-update">
        <div className="forgot-password-grid">
          <Form.Control
            required
            value={form.password}
            name="password"
            type="password"
            placeholder="Enter new password"
            onChange={handleOnChange}
          />
          <Form.Control
            required
            value={form.confirmPassword}
            name="confirmPassword"
            type="password"
            placeholder="Confirm new password"
            onChange={handleOnChange}
          />
        </div>
        <div className="forgot-password-actions">
          <Button
            variant="primary"
            onClick={handleOnUpdatePw}
          >
            Update Password
          </Button>
        </div>
      </div>
    )
  );
};

export default UpdatePassword;
