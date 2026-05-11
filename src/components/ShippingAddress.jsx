import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import useForm from "../hooks/useForm";
import { Form } from "react-bootstrap";

import { updateUserAction } from "../features/user/userAction";
import ShippingAddressForm from "./shippingAddress/ShippingAddressForm";
import { setShippingAddress } from "../features/orders/orderSlice";
import OrderPaymentPage from "./ordersComponent/OrderPaymentPage";
import Stepper from "@mui/material/Stepper";
import Step from "@mui/material/Step";
import StepLabel from "@mui/material/StepLabel";
import OrderConfirmationPage from "./ordersComponent/OrderConfirmationPage";
import { IoCardOutline, IoLocationOutline, IoShieldCheckmarkOutline } from "react-icons/io5";
import AppDialog from "./dialogs/AppDialog";

const ShippingAddress = () => {
  const dispatch = useDispatch();

  const { user } = useSelector((state) => state.userInfo);
  const { cart } = useSelector((state) => state.cartInfo);
  const { handleOnChange, form } = useForm({
    unit: "",
    street: "",
    city: "",
    state: "",
    postalCode: "",
    country: "",
  });

  const [addressConfirmed, setAddressConfirmed] = useState(false);
  const [confirmation, setConfirmation] = useState(false);
  const [activeStep, setActiveStep] = useState(0);
  const [dialog, setDialog] = useState(null);

  const steps = ["Shipping Address", "Payment", "Confirmation"];

  const buildAddressFromForm = () => {
    const parts = [
      form.unit ? `Unit ${form.unit}` : "",
      form.street,
      form.city,
      form.state,
      form.postalCode,
      form.country,
    ].filter(Boolean);

    return parts.join(", ");
  };

  // checkout
  const handleCheckoutAction = async (mode) => {
    const fullAddress =
      mode === "existing" ? user?.address : buildAddressFromForm();

    if (!fullAddress) {
      setDialog({
        title: "Shipping address needed",
        message: "Please choose your saved address or enter a new shipping address.",
      });
      return;
    }

    localStorage.setItem("shippingAddressNew", fullAddress);

    if (mode === "update") {
      await dispatch(setShippingAddress(fullAddress));

      if (!user.address || user.address.length === 0) {
        dispatch(updateUserAction({ address: fullAddress }));
      }
    }

    if (mode === "existing") {
      await dispatch(setShippingAddress(fullAddress));
    }

    try {
      setAddressConfirmed(true);
      setActiveStep(1);
    } catch {
      setDialog({
        title: "Address could not be set",
        message: "Something went wrong while setting the address. Please try again.",
      });
    }
  };

  // step controllling-- back and forth
  // const handleStepClick = (step) => {
  //   if (step <= activeStep) {
  //     setActiveStep(step);

  //     switch (step) {
  //       case 0:
  //         setAddressConfirmed(false); // show shipping form
  //         break;
  //       case 1:
  //         setAddressConfirmed(true); // show payment (OrderFinalPage)
  //         break;
  //       case 2:
  //         // show confirmation page
  //         setConfirmation(true);
  //         break;
  //       default:
  //         break;
  //     }
  //   }
  // };
  return (
    <div className="checkout-page">
      {!confirmation && (
        <>
          <section className="checkout-hero">
            <div>
              <p className="section-kicker">Secure checkout</p>
              <h1>Complete your order</h1>
              <p>
                Confirm delivery, review stock-backed cart items, and finish payment
                through a protected Stripe checkout flow.
              </p>
            </div>
            <div className="checkout-hero-badges">
              <span><IoShieldCheckmarkOutline aria-hidden /> Stock checked</span>
              <span><IoCardOutline aria-hidden /> Secure payment</span>
            </div>
          </section>

          {/* stepper to show the stages of the order placement */}
          <Stepper activeStep={activeStep} alternativeLabel className="checkout-stepper">
            {steps.map((item, index) => (
              <Step key={item} completed={index < activeStep}>
                <StepLabel
                // style={{ cursor: index <= activeStep ? "pointer" : "default" }}
                // onClick={() => handleStepClick(index)}
                >
                  {item}
                </StepLabel>
              </Step>
            ))}
          </Stepper>
        </>
      )}

      {!addressConfirmed && !confirmation && (
        <div className="checkout-address-grid">
          <section className="checkout-panel checkout-address-panel">
            <div className="checkout-panel-heading">
              <span><IoLocationOutline aria-hidden /></span>
              <div>
                <p className="section-kicker">Delivery address</p>
                <h2>Where should we send it?</h2>
              </div>
            </div>
            <Form
              className="checkout-address-form"
              onSubmit={(e) => {
                e.preventDefault();
                handleCheckoutAction("update");
              }}
            >
              <ShippingAddressForm
                form={form}
                handleOnChange={handleOnChange}
                submitLabel="Continue to payment"
              />
            </Form>
          </section>

          <aside className="checkout-side-panel">
            <div className="checkout-mini-summary">
              <p className="section-kicker">Order snapshot</p>
              <h3>{cart?.length || 0} item{cart?.length === 1 ? "" : "s"} in cart</h3>
              <p>
                Stock availability is checked before payment and again before
                order creation.
              </p>
            </div>
            {user.address ? (
              <div className="checkout-existing-address">
                <span><IoLocationOutline aria-hidden /> Saved address</span>
                <p>{user.address}</p>
                <button
                  type="button"
                  onClick={() => handleCheckoutAction("existing")}
                >
                  Use saved address
                </button>
              </div>
            ) : (
              <div className="checkout-existing-address muted">
                <span><IoLocationOutline aria-hidden /> Saved address</span>
                <p>No saved address yet. Add one now and it can be reused later.</p>
              </div>
            )}
          </aside>
        </div>
      )}

      {/* Order Summary  */}
      {addressConfirmed && (
        <OrderPaymentPage
          setConfirmation={setConfirmation}
          setActiveStep={setActiveStep}
          setAddressConfirmed={setAddressConfirmed}
        />
      )}

      {/* {confirmation page} */}
      {confirmation && !addressConfirmed && <OrderConfirmationPage />}

      <AppDialog
        show={!!dialog}
        variant="warning"
        title={dialog?.title}
        message={dialog?.message}
        confirmOnly
        confirmText="Got It"
        onConfirm={() => setDialog(null)}
      />
    </div>
  );
};

export default ShippingAddress;
