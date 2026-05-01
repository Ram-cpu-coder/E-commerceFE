import { Elements } from "@stripe/react-stripe-js";
import React, { useState } from "react";
import CheckOutForm from "../../pages/payment/CheckOutForm";
import { loadStripe } from "@stripe/stripe-js";
import { Button } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import { makePaymentAction } from "../../features/payment/PaymentActions";
import { toast } from "react-toastify";
import OrderSummaryCard from "./OrderSummaryCard";

const OrderFinalPage = ({
  setConfirmation,
  setActiveStep,
  setAddressConfirmed,
}) => {
  const dispatch = useDispatch();
  const [clientSecret, setClientSecret] = useState(null);

  const { cart } = useSelector((state) => state.cartInfo);

  const priceArr = cart.map((item) => item.totalAmount);

  const handleOrderConfirmationAndInitiatePayment = async () => {
    try {
      const data = await dispatch(makePaymentAction());
      setClientSecret(data?.paymentIntent?.client_secret);
    } catch (error) {
      toast.error("Something went wrong during checkout");
    }
  };

  const stripePromise = loadStripe(
    "pk_test_51RTBwfFT5aSpx6hL9yjuit9otXGJrq0FfRvDMOVihFGfXwQJv6Hc4hqhGv44091BO8fohBAay5grzEZNHgmMDWlx001lQaMhgU"
  );

  return (
    <div className="row col-12 col-md-8 col-lg-7 vh-auto mb-5 pb-5">
      <div className="container d-flex justify-content-center gap-3 mb-5 pb-5">
        <section className={`${clientSecret ? "col-6" : "col-12"}`}>
          <h5>Order Summary</h5>

          <div className="d-flex flex-column align-items-center bg-white py-3 position-relative vh-100">
            <div className="col-12">
              {cart.map((item, index) => (
                <OrderSummaryCard item={item} key={index} />
              ))}
            </div>

            <span className="d-flex justify-content-between col-11">
              <strong>Total</strong>
              <p>$ {priceArr.reduce((ttl, acc) => ttl + acc, 0)}</p>
            </span>

            <span className="d-flex justify-content-between col-11">
              <strong>Shipping</strong>
              <p>0</p>
            </span>

            <span className="d-flex justify-content-between col-11">
              <strong>Tax</strong>
              <p>0</p>
            </span>

            <span className="d-flex justify-content-between col-11">
              <strong>SubTotal</strong>
              <p>$ {priceArr.reduce((ttl, acc) => ttl + acc, 0)}</p>
            </span>

            {clientSecret ? (
              ""
            ) : (
              <Button
                onClick={() => handleOrderConfirmationAndInitiatePayment()}
              >
                Confirm
              </Button>
            )}
          </div>
        </section>

        {clientSecret && (
          <section className="w-50 border-start px-3">
            <h5 className="pb-4">Payment</h5>
            <Elements stripe={stripePromise} options={{ clientSecret }}>
              <CheckOutForm
                setConfirmation={setConfirmation}
                setActiveStep={setActiveStep}
                setAddressConfirmed={setAddressConfirmed}
              />
            </Elements>
          </section>
        )}
      </div>
    </div>
  );
};

export default OrderFinalPage;
