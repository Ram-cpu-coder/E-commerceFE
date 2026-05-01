import { apiProcessor } from "../../services/apiProcessor";

const cartUrl = import.meta.env.VITE_BACKEND_BASE_URL + "/cart";
export const createCartApi = (_id, quantity) => {
  console.log("axios");
  return apiProcessor({
    method: "post",
    url: cartUrl + "/add-to-cart",
    data: { _id: _id, quantity: quantity },
    isPrivate: true,
  });
};

export const fetchCartApi = () => {
  return apiProcessor({
    method: "get",
    url: cartUrl,
    isPrivate: true,
  });
};

export const deleteCartItemAxios = (_id) => {
  return apiProcessor({
    method: "delete",
    url: cartUrl + "/remove-item",
    isPrivate: true,
    data: { _id },
  });
};

export const updateCartItemAxios = ({ quantity, _id, totalPrice }) => {
  return apiProcessor({
    method: "put",
    url: cartUrl,
    isPrivate: true,
    data: { quantity, _id, totalPrice },
  });
};

export const deleteCart = () => {
  return apiProcessor({
    method: "delete",
    url: cartUrl,
    isPrivate: true
  })
}