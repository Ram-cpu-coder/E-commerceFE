import React, { useState } from "react";
import { Button, Form } from "react-bootstrap";
import CustomInput from "../../components/custom inputs/CustomInput";
import { signUpInputes } from "../../assets/form-data/UserSignUpInputes";
import useForm from "../../hooks/useForm";
import { useDispatch } from "react-redux";
import { registerUserAction } from "../../features/user/userAction";
import { useNavigate } from "react-router-dom";
import AppDialog from "../dialogs/AppDialog";

const initialState = {};
const RegisterForm = () => {
  const { form, handleOnChange, passwordErrors } =
    useForm(initialState);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [dialog, setDialog] = useState(null);

  const handleOnSubmit = (e) => {
    e.preventDefault();
    const { confirmPassword, password } = form;

    if (confirmPassword !== password) {
      setDialog({
        title: "Passwords do not match",
        message: "Please make sure both password fields are exactly the same.",
      });
      return;
    }
    try {
      //SignUp api call
      dispatch(registerUserAction(form));

      // redirect to loginpage with 2s delay so that user can see the toast
      setTimeout(() => navigate("/login"));
      return { status: "success", message: "Sign Up sucessful" };
    } catch {
      return { status: "error", message: "signUp failed" };
    }
  };

  return (
    <>
      <Form onSubmit={handleOnSubmit}>
        {signUpInputes.map((input) => (
          <CustomInput key={input.name} {...input} onChange={handleOnChange} />
        ))}

        <div className="">
          <ul className="text-danger ">
            {passwordErrors.length > 0 &&
              passwordErrors.map((msg) => <li key={msg}>{msg} </li>)}
          </ul>
        </div>
        <div className="d-grid">
          <Button
            variant="primary"
            type="submit"
            disabled={passwordErrors.length}
          >
            Register
          </Button>
        </div>
      </Form>

      <AppDialog
        show={!!dialog}
        variant="warning"
        title={dialog?.title}
        message={dialog?.message}
        confirmOnly
        confirmText="Got It"
        onConfirm={() => setDialog(null)}
      />
    </>
  );
};

export default RegisterForm;
