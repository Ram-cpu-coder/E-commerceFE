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

const ShippingAddress = () => {
  const dispatch = useDispatch();
  const { handleOnChange, form } = useForm({});

  const { user } = useSelector((state) => state.userInfo);

  const [addressConfirmed, setAddressConfirmed] = useState(false);
  const [confirmation, setConfirmation] = useState(false);
  const [activeStep, setActiveStep] = useState(0);

  const steps = ["Shipping Address", "Payment", "Confirmation"];

  console.log("confirmation State: ", confirmation);

  // checkout
  const handleCheckoutAction = async (mode) => {
    const fullAddress = `Unit ${form.unit}/${form.street}, ${form.city}, ${form.state}, ${form.postalCode}, ${form.country}`;
    localStorage.setItem("shippingAddressNew", fullAddress);

    if (mode === "update") {
      await dispatch(setShippingAddress(fullAddress));

      if (!user.address || user.address.length === 0) {
        dispatch(updateUserAction({ address: fullAddress }));
      }
    }

    if (mode === "existing") {
      dispatch(setShippingAddress(fullAddress));
    }

    try {
      setAddressConfirmed(true);
      setActiveStep(1);
    } catch (error) {
      alert(
        "Something has gone wrong while setting the address, Try Again Please!"
      );
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
    <div className="container d-flex flex-column align-items-center my-5">
      {/* stepper to show the stages of the order placement */}
      <Stepper activeStep={activeStep} alternativeLabel className="col-10 my-5">
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

      {!addressConfirmed && !confirmation && (
        <div className="row col-12 col-md-8 col-lg-7">
          <h5 className="py-2">Shipping Address</h5>
          <div className="d-flex align-items-start gap-4">
            <Form
              className="w-75 shadow p-3 rounded"
              onSubmit={(e) => {
                e.preventDefault();
                handleCheckoutAction("update");
              }}
            >
              <ShippingAddressForm
                form={form}
                handleOnChange={handleOnChange}
              />
            </Form>

            {/* if user wants to go with existing address */}
            {user.address ? (
              <>
                <div className="d-flex flex-column justify-content-between align-items-center w-25">
                  <p className="mb-0 border px-3 rounded">{user.address}</p>
                  <button
                    className="btn btn-link"
                    onClick={() => handleCheckoutAction("existing")}
                  >
                    Existing address
                  </button>
                </div>
              </>
            ) : (
              ""
            )}
          </div>
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
    </div>
  );
};

export default ShippingAddress;
