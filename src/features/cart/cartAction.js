import { toast } from "react-toastify";
import {
  createCartApi,
  deleteCart,
  deleteCartItemAxios,
  fetchCartApi,
  updateCartItemAxios,
} from "./cartAxios";
import { resetCart, setCart } from "./cartSlice";

export const createCartAction = (_id, quantity) => async (dispatch) => {
  const pending = createCartApi(_id, quantity);
  toast.promise(pending, {
    pending: "Adding item...",
  });
  const { status, message } = await pending;
  toast[status](message);
  dispatch(fetchCartAction())
  return status === "success";
};

export const fetchCartAction = () => async (dispatch) => {
  const { cart } = await fetchCartApi();
  dispatch(setCart(cart.cartItems));
};

export const deleteCartItemAction = (_id) => async (dispatch) => {
  const pending = deleteCartItemAxios(_id);
  toast.promise(pending, {
    pending: "Deleting ...",
  });
  const { status, message } = await pending;
  toast[status](message);
  if (status === "success") {
    dispatch(fetchCartAction());
  }
};

export const updateCartItemAction = ({ quantity, _id, totalPrice }) => async (dispatch) => {
  const { status, message } = await updateCartItemAxios({
    quantity,
    _id,
    totalPrice,
  });
  if (status === "success") {
    dispatch(fetchCartAction());
  } else if (message) {
    toast[status](message);
  }
};

export const deleteCartAction = () => async (dispatch) => {
  const pending = deleteCart();
  toast.promise(pending, {
    pending: "Processing..."
  })
  const { status } = await pending;
  if (status === "success") { dispatch(resetCart()) }
}
