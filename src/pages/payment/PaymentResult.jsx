import React, { useEffect, useRef, useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import {
  makePaymentAction,
  verifyPaymentAction,
} from "../../features/payment/PaymentActions";
import { toast } from "react-toastify";
import { useDispatch, useSelector } from "react-redux";
import { deleteCartAction } from "../../features/cart/cartAction";
import OrderConfirmationPage from "../../components/ordersComponent/OrderConfirmationPage";
import {
  IoCloseCircleOutline,
  IoHomeOutline,
  IoRefreshOutline,
} from "react-icons/io5";

const PaymentResult = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const sessionId = searchParams.get("session_id");
  const isSuccessParam = searchParams.get("success");

  const [isVerified, setIsVerified] = useState(null);
  const [status, setStatus] = useState("");
  const [placedOrder, setPlacedOrder] = useState({});

  const { user } = useSelector((state) => state.userInfo);
  const { cart } = useSelector((state) => state.cartInfo);

  const hasVerified = useRef(false);

  const handleCheckoutAction = async () => {
    try {
      await dispatch(makePaymentAction());
    } catch {
      toast.error("Something went wrong during checkout");
    }
  };

  useEffect(() => {
    const verify = async () => {
      if (!sessionId) {
        setIsVerified(false);
        return;
      }

      if (!user?._id || !user?.address) return;
      if (hasVerified.current) return;
      hasVerified.current = true;

      const data = await dispatch(verifyPaymentAction({
        shippingAddress: user.address,
        userId: user._id,
        sessionId,
      }));

      if (!data) {
        setIsVerified(false);
        setStatus("error");
        return;
      }

      setPlacedOrder(data?.order || {});
      setIsVerified(data?.verified);
      setStatus(data?.status || "success");
      if (data?.verified) {
        dispatch(deleteCartAction(cart?._id));
      }
    };

    verify();
  }, [user, sessionId, dispatch, cart?._id]);

  if (isVerified === null) {
    return (
      <div className="payment-result-loading">
        <span className="payment-result-spinner" />
        <p>Verifying payment...</p>
      </div>
    );
  }

  if (isVerified && isSuccessParam === "true") {
    return <OrderConfirmationPage order={placedOrder} />;
  }

  return (
    <section className="payment-result-failed">
      <span>
        <IoCloseCircleOutline aria-hidden />
      </span>
      <p className="section-kicker">Payment issue</p>
      <h1>Payment failed or was canceled</h1>
      <p>Payment status: {status || "unknown"}</p>
      <div className="payment-result-actions">
        <button onClick={() => navigate("/")}>
          <IoHomeOutline aria-hidden /> Back to home
        </button>
        <button onClick={handleCheckoutAction}>
          <IoRefreshOutline aria-hidden /> Try again
        </button>
      </div>
    </section>
  );
};

export default PaymentResult;
