import { lazy, useEffect, useState } from "react";

import { Button, Container, Form } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { UserLayout } from "../../components/layouts/UserLayout";
import { setMenu } from "../../features/user/userSlice";
import {
  fetchUserAction,
  resendVerificationLinkAction,
} from "../../features/user/userAction";

const LoginSecurityCard = lazy(() => import("./LoginSecurityCard"));
const BreadCrumbsAdmin = lazy(() =>
  import("../../components/breadCrumbs/BreadCrumbsAdmin")
);

const Profile = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const { user } = useSelector((state) => state.userInfo);

  const [email, setEmail] = useState("");
  const [isResending, setIsResending] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      await dispatch(fetchUserAction());
    };
    fetchData();
  }, []);

  const profileInputs = [
    {
      label: "Name",
      data: user.fName + " " + user.lName,
      schemaName: "fullName",
      type: "text",
    },
    {
      label: "Email",
      data: user.email,
      schemaName: "email",
      type: "email",
    },
    {
      label: "Primary Phone Number",
      data: user.phone,
      schemaName: "phone",
      type: "number",
    },
    {
      label: "Password",
      data: "********",
      schemaName: "password",
      type: "password",
    },
  ];

  const handleResendVerificationLink = (email) => {
    const isEmailSent = dispatch(resendVerificationLinkAction(email));
    if (isEmailSent) {
      setEmail("");
      setIsResending(false);
    }
  };

  useEffect(() => {
    dispatch(setMenu("Login & Security"));
  }, []);

  if (!user._id) {
    return (
      <div>
        <Container
          className="d-flex flex-column justify-content-center align-items-center"
          style={{ height: "64vh" }}
        >
          <h2 className="mb-4"> Welcome to NepaStore! </h2>
          <p className="mb-4 text-muted">
            Please login or register to continue.
          </p>

          <div className="d-flex gap-3">
            <Button
              variant="primary"
              size="lg"
              onClick={() => navigate("/login")}
            >
              Log In
            </Button>
            <Button
              variant="outline-primary"
              size="lg"
              onClick={() => navigate("/register")}
            >
              Sign Up
            </Button>
          </div>
          <p className="py-2 m-0">Or</p>

          {isResending ? (
            <div className="">
              <Form
                className="d-flex align-items-center justify-content-center"
                onSubmit={(e) => {
                  e.preventDefault();
                  handleResendVerificationLink(email);
                }}
              >
                <div
                  className="position-relative"
                  style={{ width: "100%", maxWidth: "300px" }}
                >
                  <input
                    type="email"
                    name="Email"
                    required
                    onChange={(e) => setEmail(e.target.value)}
                    className="form-control" // space for button inside input
                    style={{ paddingRight: "80px" }}
                    placeholder="Your registered Email"
                  />

                  <Button
                    variant="outline"
                    className="position-absolute top-50 translate-middle-y border-start"
                    style={{ right: "5px" }}
                    type="submit"
                  >
                    Resend
                  </Button>
                </div>
              </Form>
              <div className="d-flex justify-content-center">
                <Button
                  onClick={() => setIsResending(!isResending)}
                  variant="light"
                  className="mt-2 border"
                >
                  Cancel
                </Button>
              </div>
            </div>
          ) : (
            <Button variant="link" onClick={() => setIsResending(!isResending)}>
              Resend Verification link
            </Button>
          )}
        </Container>
      </div>
    );
  }

  return (
    user._id && (
      <UserLayout pageTitle="Login & Security">
        <BreadCrumbsAdmin />
        <div className="w-100 d-flex justify-content-center align-items-center">
          <div className="border col-12 col-md-10 col-lg-6 rounded pt-3 d-flex flex-column align-items-center">
            {profileInputs.map((item, index) => (
              <LoginSecurityCard item={item} key={index} />
            ))}
          </div>
        </div>
      </UserLayout>
    )
  );
};

export default Profile;
