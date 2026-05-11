import { lazy, useEffect, useState } from "react";

import { Button, Container, Form } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { UserLayout } from "../../components/layouts/UserLayout";
import { setMenu } from "../../features/user/userSlice";
import {
  fetchUserAction,
  resendVerificationLinkAction,
  updatePwAction,
  verifyEmailAndSendOTPAction,
  verifyOTP,
} from "../../features/user/userAction";
import { IoLockClosedOutline, IoMailOutline, IoPersonOutline, IoShieldCheckmarkOutline } from "react-icons/io5";

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
  const [securityForm, setSecurityForm] = useState({
    Otp: "",
    password: "",
    confirmPassword: "",
  });
  const [otpSent, setOtpSent] = useState(false);
  const [otpVerified, setOtpVerified] = useState(false);
  const [isSendingOtp, setIsSendingOtp] = useState(false);
  const [resendLocked, setResendLocked] = useState(false);

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
  ];

  const handleResendVerificationLink = (email) => {
    const isEmailSent = dispatch(resendVerificationLinkAction(email));
    if (isEmailSent) {
      setEmail("");
      setIsResending(false);
    }
  };

  useEffect(() => {
    dispatch(setMenu("Settings"));
  }, []);

  const handleSecurityChange = (e) => {
    const { name, value } = e.target;
    setSecurityForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSendProfileOtp = async () => {
    if (!user.email || isSendingOtp || resendLocked) return;

    setIsSendingOtp(true);
    const response = await dispatch(
      verifyEmailAndSendOTPAction({ email: user.email })
    );
    if (response === true) {
      setOtpSent(true);
      setResendLocked(true);
      setTimeout(() => setResendLocked(false), 30000);
    }
    setIsSendingOtp(false);
  };

  const handleVerifyProfileOtp = async () => {
    const response = await dispatch(
      verifyOTP({ email: user.email, Otp: securityForm.Otp })
    );
    if (response === true) {
      setOtpVerified(true);
    }
  };

  const handleProfilePasswordUpdate = async (e) => {
    e.preventDefault();
    const response = await dispatch(
      updatePwAction({
        email: user.email,
        Otp: securityForm.Otp,
        password: securityForm.password,
        confirmPassword: securityForm.confirmPassword,
      })
    );

    if (response === true) {
      setSecurityForm({ Otp: "", password: "", confirmPassword: "" });
      setOtpSent(false);
      setOtpVerified(false);
    }
  };

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
      <UserLayout pageTitle="Settings">
        <BreadCrumbsAdmin />
        <div className="profile-settings-page">
          <section className="profile-settings-hero">
            <div className="profile-settings-avatar">
              <IoPersonOutline aria-hidden />
            </div>
            <div>
              <p className="section-kicker">{user.role || "customer"} account</p>
              <h1>{user.fName} {user.lName}</h1>
              <p>Manage your account details and protect your password with email verification.</p>
            </div>
          </section>

          <div className="profile-settings-grid">
            <section className="profile-settings-card">
              <div className="profile-settings-card-heading">
                <IoPersonOutline aria-hidden />
                <div>
                  <p className="section-kicker">Profile</p>
                  <h2>Personal details</h2>
                </div>
              </div>
              <div className="profile-security-list">
                {profileInputs.map((item, index) => (
                  <LoginSecurityCard item={item} key={index} />
                ))}
              </div>
            </section>

            <section className="profile-settings-card">
              <div className="profile-settings-card-heading">
                <IoLockClosedOutline aria-hidden />
                <div>
                  <p className="section-kicker">Security</p>
                  <h2>Change password</h2>
                </div>
              </div>
              <p className="profile-settings-copy">
                We will send a one-time code to {user.email}. Verify it before
                setting a new password.
              </p>
              <form className="profile-password-form" onSubmit={handleProfilePasswordUpdate}>
                <button
                  type="button"
                  className="profile-secondary-button"
                  onClick={handleSendProfileOtp}
                  disabled={isSendingOtp || resendLocked}
                >
                  <IoMailOutline aria-hidden />
                  {otpSent
                    ? resendLocked
                      ? "Code sent"
                      : "Resend code"
                    : isSendingOtp
                    ? "Sending code..."
                    : "Send verification code"}
                </button>

                {otpSent && (
                  <div className="profile-inline-field">
                    <input
                      name="Otp"
                      value={securityForm.Otp}
                      onChange={handleSecurityChange}
                      placeholder="Enter 6-digit verification code"
                      maxLength="6"
                      required
                    />
                    <button
                      type="button"
                      onClick={handleVerifyProfileOtp}
                      disabled={otpVerified || String(securityForm.Otp).length !== 6}
                    >
                      <IoShieldCheckmarkOutline aria-hidden />
                      {otpVerified ? "Verified" : "Verify"}
                    </button>
                  </div>
                )}

                {otpVerified && (
                  <div className="profile-password-grid">
                    <input
                      name="password"
                      type="password"
                      value={securityForm.password}
                      onChange={handleSecurityChange}
                      placeholder="Enter new password"
                      required
                    />
                    <input
                      name="confirmPassword"
                      type="password"
                      value={securityForm.confirmPassword}
                      onChange={handleSecurityChange}
                      placeholder="Confirm new password"
                      required
                    />
                    <button type="submit" className="checkout-primary-button">
                      Update password
                    </button>
                  </div>
                )}
              </form>
            </section>
          </div>
        </div>
      </UserLayout>
    )
  );
};

export default Profile;
