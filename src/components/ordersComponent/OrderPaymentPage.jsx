import { Elements } from "@stripe/react-stripe-js";
import React, { useState } from "react";
import CheckOutForm from "../../pages/payment/CheckOutForm";
import { loadStripe } from "@stripe/stripe-js";
import { Button } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import { makePaymentAction } from "../../features/payment/PaymentActions";
import { toast } from "react-toastify";
import OrderSummaryCard from "./OrderSummaryCard";
import { IoBagCheckOutline, IoCardOutline, IoRefreshOutline } from "react-icons/io5";

const OrderFinalPage = ({
  setConfirmation,
  setActiveStep,
  setAddressConfirmed,
}) => {
  const dispatch = useDispatch();
  const [clientSecret, setClientSecret] = useState(null);

  const { cart } = useSelector((state) => state.cartInfo);

  const subtotal = cart.reduce((total, item) => total + Number(item.totalAmount || 0), 0);

  const handleOrderConfirmationAndInitiatePayment = async () => {
    try {
      const data = await dispatch(makePaymentAction());
      if (data?.paymentIntent?.client_secret) {
        setClientSecret(data.paymentIntent.client_secret);
      }
    } catch {
      toast.error("Something went wrong during checkout");
    }
  };

  const stripePromise = loadStripe(
    "pk_test_51RTBwfFT5aSpx6hL9yjuit9otXGJrq0FfRvDMOVihFGfXwQJv6Hc4hqhGv44091BO8fohBAay5grzEZNHgmMDWlx001lQaMhgU"
  );

  return (
    <div className="checkout-payment-grid">
      <section className="checkout-panel checkout-summary-panel">
        <div className="checkout-panel-heading">
          <span><IoBagCheckOutline aria-hidden /></span>
          <div>
            <p className="section-kicker">Order summary</p>
            <h2>Review your cart</h2>
          </div>
        </div>

        <div className="checkout-summary-list">
          {cart?.length ? (
            <>
              {cart.map((item, index) => (
                <OrderSummaryCard item={item} key={index} />
              ))}
            </>
          ) : (
            <div className="checkout-empty-cart">Your cart is empty.</div>
          )}
        </div>

        <div className="checkout-totals">
          <span><strong>Subtotal</strong><p>$ {subtotal.toFixed(2)}</p></span>
          <span><strong>Shipping</strong><p>$ 0.00</p></span>
          <span><strong>Tax</strong><p>$ 0.00</p></span>
          <span className="grand-total"><strong>Total</strong><p>$ {subtotal.toFixed(2)}</p></span>
        </div>

        {!clientSecret && (
          <Button
            className="checkout-primary-button"
            onClick={() => handleOrderConfirmationAndInitiatePayment()}
            disabled={!cart?.length}
          >
            <IoRefreshOutline aria-hidden /> Check stock and continue
          </Button>
        )}
      </section>

      <section className="checkout-panel checkout-payment-panel">
        <div className="checkout-panel-heading">
          <span><IoCardOutline aria-hidden /></span>
          <div>
            <p className="section-kicker">Payment</p>
            <h2>{clientSecret ? "Enter payment details" : "Ready when stock is confirmed"}</h2>
          </div>
        </div>

        {clientSecret ? (
          <Elements stripe={stripePromise} options={{ clientSecret }}>
            <CheckOutForm
              setConfirmation={setConfirmation}
              setActiveStep={setActiveStep}
              setAddressConfirmed={setAddressConfirmed}
            />
          </Elements>
        ) : (
          <div className="checkout-payment-placeholder">
            Stripe payment fields will appear here after the latest stock and
            pricing check passes.
          </div>
        )}
      </section>
    </div>
  );
};

export default OrderFinalPage;
