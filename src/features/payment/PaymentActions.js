import { toast } from "react-toastify";
import { handleStockApi, makePaymentAxios, verifyPaymentSession } from "./PaymentAxios.js";

export const makePaymentAction = () => async (dispatch) => {
  const pending = makePaymentAxios();
  toast.promise(pending, {
    pending: "Loading...",
  });
  const data = await pending;
  toast[data.status](data.message);
  if (data.status === "success") {
    return data;
  }
};

export const verifyPaymentAction = (obj) => async (dispatch) => {
  const pending = verifyPaymentSession(obj);
  toast.promise(pending, {
    pending: "Verifying the payment ...",
  });

  try {
    const data = await pending;
    if (data?.verified === true) {
      toast.success("Successfully placed the order!");
      return data;
    }

    toast.error(data.message || "Order verification failed.");
    return null;
  } catch (error) {
    toast.error("An unexpected error occurred during verification.");
    return null;
  }
};

export const handleStockAction = () => async (dispatch) => {
  const { status, message } = await handleStockApi()
  if (status === "success") {
    return true
  } else {
    toast.error(message)
    return false
  }
}
