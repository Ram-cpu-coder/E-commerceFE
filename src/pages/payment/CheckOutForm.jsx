import React, { useState } from "react";
import {
  PaymentElement,
  useElements,
  useStripe,
} from "@stripe/react-stripe-js";
import { Button } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import {
  verifyPaymentAction,
} from "../../features/payment/PaymentActions";
import { updateOrderAction } from "../../features/orders/orderActions";
import { deleteCartAction } from "../../features/cart/cartAction";
import { createUserHistoryAction } from "../../features/userHistory/userHistoryAction";
import Spinner from "react-bootstrap/Spinner";
import { toast } from "react-toastify";
import {
  createRecentActivityWithAuthenticationAction,
} from "../../features/recentActivity/recentActivityAction";
import AppDialog from "../../components/dialogs/AppDialog";

const CheckOutForm = ({
  setConfirmation,
  setActiveStep,
  setAddressConfirmed,
}) => {
  const dispatch = useDispatch();
  const shippingAddress = localStorage.getItem("shippingAddressNew");
  const { user } = useSelector((state) => state.userInfo);
  const { cart } = useSelector((state) => state.cartInfo);

  const [processing, setProcessing] = useState(false);
  const [dialog, setDialog] = useState(null);

  const stripe = useStripe();
  const elements = useElements();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setProcessing(true);
    try {
      if (!stripe || !elements) {
        return;
      }

      const { error, paymentIntent } = await stripe.confirmPayment({
        elements,
        confirmParams: {
          return_url: `${window.location.origin}/`,
        },
        redirect: "if_required",
      });

      if (error) {
        setDialog({
          title: "Payment could not be completed",
          message: error?.message || "Please check your payment details and try again.",
        });
        return;
      }

      if (paymentIntent?.status !== "succeeded") {
        toast("Payment Failed!");
        // I need to add the roll back fucntion for the stock
        return;
      }
      const response = await dispatch(
        verifyPaymentAction({
          shippingAddress:
            shippingAddress || user.address,
          userId: user._id,
          paymentIntent,
        })
      );

      const { order, verified } = response;
      if (verified === true) {
        await dispatch(
          updateOrderAction({
            _id: order?._id,
            status: "confirmed",
            paymentIntent,
          })
        );
        await dispatch(
          createRecentActivityWithAuthenticationAction({
            action: "orderPlaced",
            entityId: order?._id,
            entityType: "order",
          })
        );
        await dispatch(deleteCartAction());

        await dispatch(
          createUserHistoryAction(
            cart?.map((item) => {
              return {
                userId: user._id || null,
                productId: item._id,
                categoryId: item.category,
                action: "purchase",
              };
            })
          )
        );

        // setting the confirmation of payment to true so that we can pop up the confirmation details
        setAddressConfirmed(false);
        setConfirmation(true);
        setActiveStep(2);
        // storing the order info in the local storage
        localStorage.setItem("order", JSON.stringify(order));
      }
    } finally {
      setProcessing(false);
    }
  };
  return (
    <>
      <div className="checkout-stripe-box">
        <form onSubmit={handleSubmit} className="checkout-stripe-form">
          <PaymentElement />
          <div className="checkout-payment-actions">
            <Button disabled={!stripe || processing} type="submit" className="checkout-primary-button">
              {processing ? (
                <div className="d-flex align-items-center gap-2">
                  <Spinner
                    className="border-1"
                    style={{ width: "1rem", height: "1rem" }}
                  />
                  Processing
                </div>
              ) : (
                "Place Order"
              )}
            </Button>
          </div>
        </form>
      </div>

      <AppDialog
        show={!!dialog}
        variant="error"
        title={dialog?.title}
        message={dialog?.message}
        confirmOnly
        confirmText="Got It"
        onConfirm={() => setDialog(null)}
      />
    </>
  );
};

export default CheckOutForm;
