import React, { useEffect, useState } from "react";
import { RiDeleteBin5Line } from "react-icons/ri";
import { useDispatch } from "react-redux";
import {
  deleteCartItemAction,
  updateCartItemAction,
} from "../../features/cart/cartAction";
import { removeItem } from "../../features/cart/cartSlice";

const CartCard = ({ item }) => {
  const dispatch = useDispatch();
  const { images, _id, name, quantity, totalAmount, price } = item;

  const [itemCartQuantiy, setItemCartQuantiy] = useState(quantity);
  const [totalPrice, setTotalPrice] = useState(totalAmount);

  const handleDeleteItemFromCart = (_id) => {
    dispatch(deleteCartItemAction(_id));
  };

  const handleQuantityChange = (mode, _id) => {
    let qty =
      mode == "add"
        ? itemCartQuantiy + 1
        : itemCartQuantiy < 1
        ? itemCartQuantiy
        : itemCartQuantiy - 1;
    qty === 0 ? dispatch(removeItem(_id)) : "";
    setItemCartQuantiy(qty);
    setTotalPrice(qty * price);
    dispatch(
      updateCartItemAction({
        quantity: qty,
        _id,
        totalPrice: qty * price,
      })
    );
  };

  useEffect(() => {
    setItemCartQuantiy(quantity);
  }, [quantity]);
  useEffect(() => {
    setTotalPrice(totalAmount);
  }, [totalAmount]);
  return (
    <div className="container-fluid px-3 bg-white">
      <div className="row align-items-start rounded-3 py-3 position-relative">
        {/* Image */}
        <div
          className="border rounded-3 p-2"
          style={{ width: "150px", height: "100px" }}
        >
          <img
            src={images?.[0]}
            alt="Product"
            className="img-fluid rounded"
            style={{ objectFit: "cover", height: "100%", width: "100%" }}
          />
        </div>

        {/* Product Info */}
        {/* <div className="col-6 col-sm-7 col-md-8"> */}
        <div className="flex-grow-1">
          <p className="mb-1" style={{ fontSize: "clamp(1rem, 2vw, 1.25rem)" }}>
            {name}
          </p>
          <p
            className="mb-1 text-primary"
            style={{ fontSize: "clamp(0.75rem, 1.2vw, 1rem)" }}
          >
            Tag
          </p>

          <div className="d-flex flex-column flex-lg-row align-items-start align-items-lg-center justify-content-between">
            {/* Price */}
            <div>
              <span
                className="fw-bold me-1"
                style={{ fontSize: "clamp(1rem, 2vw, 1.25rem)" }}
              >
                $
              </span>
              <span style={{ fontSize: "clamp(1rem, 2vw, 1.25rem)" }}>
                {Number(totalPrice || 0).toFixed(2)}
              </span>
            </div>

            {/* Quantity */}
            <div
              className="d-flex align-items-center justify-content-center mt-2 mt-lg-0"
              style={{ fontSize: "clamp(0.9rem, 1.5vw, 1.1rem)" }}
            >
              <span>Quantity:</span>
              <div className="d-flex align-items-center">
                <button
                  className="border-0 bg-transparent"
                  style={{
                    fontSize: "clamp(1rem, 1.5vw, 1.2rem)",
                    width: "2rem",
                    height: "2rem",
                  }}
                  onClick={() => handleQuantityChange("subtract", _id)}
                >
                  -
                </button>
                <span style={{ fontSize: "clamp(0.9rem, 1.5vw, 1.1rem)" }}>
                  {itemCartQuantiy}
                </span>
                <button
                  className="border-0 bg-transparent"
                  style={{
                    fontSize: "clamp(1rem, 1.5vw, 1.2rem)",
                    width: "2rem",
                    height: "2rem",
                  }}
                  onClick={() => handleQuantityChange("add", _id)}
                >
                  +
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Delete Icon */}
        {/* <div className="col-2 text-end"> */}
        <div className="flex-shrink-0 ms-md-3 mt-3 mt-md-0 text-end position-absolute">
          <RiDeleteBin5Line
            size="1.5rem"
            className="text-danger"
            style={{ cursor: "pointer" }}
            title="Remove Item"
            onClick={() => handleDeleteItemFromCart(_id)}
          />
        </div>
      </div>
      <hr />
    </div>
  );
};

export default CartCard;
