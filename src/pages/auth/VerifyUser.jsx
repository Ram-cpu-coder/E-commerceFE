import React, { useState } from "react";
import { Button } from "react-bootstrap";
import { useLocation, useNavigate } from "react-router-dom";
import { verifyUserAction } from "../../features/user/userAction";
import { useDispatch } from "react-redux";
import { IoCheckmarkCircleOutline, IoMailUnreadOutline, IoShieldCheckmarkOutline } from "react-icons/io5";

const VerifyUser = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [isVerified, setIsVerified] = useState(null);
  const [isVerifying, setIsVerifying] = useState(false);
  const location = useLocation();
  const query = new URLSearchParams(location.search);

  const sessionId = query.get("sessionId");
  const token = query.get("t");

  const handleOnActivation = async () => {
    if (!sessionId || !token || isVerifying) return;
    setIsVerifying(true);
    const response = await dispatch(verifyUserAction({ sessionId, token }));
    if (response?.status === "success") {
      setIsVerified(true);
      navigate("/login");
    } else {
      setIsVerified(false);
    }
    setIsVerifying(false);
  };

  return isVerified === true ? (
    <div className="activate-account-page">
      <div className="activate-account-card success">
        <IoCheckmarkCircleOutline aria-hidden />
        <p className="section-kicker">Verified</p>
        <h1>Your account is active</h1>
        <p>You can now log in and continue shopping with your verified profile.</p>
      </div>
    </div>
  ) : isVerified === false ? (
    <div className="activate-account-page">
      <div className="activate-account-card error">
        <IoMailUnreadOutline aria-hidden />
        <p className="section-kicker">Verification failed</p>
        <h1>This link is not valid anymore</h1>
        <p>Please request a fresh verification email from the account page.</p>
      </div>
    </div>
  ) : (
    <div className="activate-account-page">
      <div className="activate-account-card">
        <IoShieldCheckmarkOutline aria-hidden />
        <p className="section-kicker">Account activation</p>
        <h1>Verify your NepaStore account</h1>
        <p>Confirm this email address once so your account can be used securely.</p>
        <Button className="btn-luxe rounded-pill px-4" onClick={handleOnActivation} disabled={!sessionId || !token || isVerifying}>
          {isVerifying ? "Verifying..." : "Verify Now"}
        </Button>
      </div>
    </div>
  );
};

export default VerifyUser;
