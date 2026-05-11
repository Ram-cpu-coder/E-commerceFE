import { toast } from "react-toastify";
import { handleStockApi, makePaymentAxios, verifyPaymentSession } from "./PaymentAxios.js";
import { setCart } from "../cart/cartSlice.js";

export const makePaymentAction = () => async (dispatch) => {
  const pending = makePaymentAxios();
  toast.promise(pending, {
    pending: "Loading...",
  });
  const data = await pending;
  toast[data.status](data.message);
  if (data.status === "success") {
    if (data.cart?.cartItems) {
      dispatch(setCart(data.cart.cartItems));
    }
    return data;
  }
};

export const verifyPaymentAction = (obj) => async () => {
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
  } catch {
    toast.error("An unexpected error occurred during verification.");
    return null;
  }
};

export const handleStockAction = () => async () => {
  const { status, message } = await handleStockApi()
  if (status === "success") {
    return true
  } else {
    toast.error(message)
    return false
  }
}
