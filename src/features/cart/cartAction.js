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
  const { response, status, message } = await pending;
  console.log(status, message);
  toast[status](message);
  dispatch(fetchCartAction())
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
  const { status, message, response } = await updateCartItemAxios({
    quantity,
    _id,
    totalPrice,
  });
};

export const deleteCartAction = () => async (dispatch) => {
  const pending = deleteCart();
  toast.promise(pending, {
    pending: "Processing..."
  })
  const { status, message } = await pending;
  if (status === "success") { dispatch(resetCart()) }
}