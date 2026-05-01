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
      <div className="d-flex flex-column gap-3 mb-2">
        <div className="d-flex gap-1">
          <Form.Control
            required
            value={form.password}
            name="password"
            type="password"
            placeholder="Password"
            onChange={handleOnChange}
            style={{ height: "2.5rem" }}
          />
          <Form.Control
            required
            value={form.confirmPassword}
            name="confirmPassword"
            type="password"
            placeholder="Confirm Password"
            onChange={handleOnChange}
            style={{ height: "2.5rem" }}
          />
        </div>
        <div className="d-flex justify-content-center">
          <Button
            variant="primary"
            onClick={handleOnUpdatePw}
            style={{ height: "2.5rem" }}
          >
            Update Password
          </Button>
        </div>
      </div>
    )
  );
};

export default UpdatePassword;
