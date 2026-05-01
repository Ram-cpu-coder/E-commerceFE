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
      <div className="row align-items-start border rounded-3 shadow-sm py-3">
        {/* Image */}
        <div className="col-4 col-sm-3 col-md-2">
          <img
            src={images?.[0]}
            alt="Product"
            className="img-fluid rounded"
            style={{ objectFit: "cover", maxHeight: "100px", width: "150px" }}
          />
        </div>

        {/* Product Info */}
        <div className="col-6 col-sm-7 col-md-8">
          <p
            className="mb-1"
            style={{ fontSize: "clamp(1.55rem, 1.8vw, 1.15rem)" }}
          >
            {name}
          </p>
          <p
            className="mb-1 text-primary"
            style={{ fontSize: "clamp(0.9rem, 1.5vw, 1.1rem)" }}
          >
            Tag
          </p>
          <div className="d-flex flex-column flex-sm-row align-items-start align-items-sm-center justify-content-between">
            <div>
              <span
                className="fw-bold me-1"
                style={{ fontSize: "clamp(1.75rem, 1.5vw, 1.25rem)" }}
              >
                $
              </span>
              <span style={{ fontSize: "clamp(1.75rem, 1.5vw, 1.25rem)" }}>
                {Number(totalPrice || 0).toFixed(2)}
              </span>
            </div>
            <div
              className="d-flex align-items-center justify-content-center"
              style={{
                fontSize: "clamp(1.75rem, 1.5vw, 1.25rem)",
              }}
            >
              Quantity: &nbsp;
              <div className="d-flex align-items-center">
                <button
                  className="border-0 bg-transparent"
                  onClick={() => handleQuantityChange("subtract", _id)}
                >
                  -
                </button>
                <span className="p-2">{itemCartQuantiy}</span>
                <button
                  className="border-0 bg-transparent"
                  onClick={() => handleQuantityChange("add", _id)}
                >
                  +
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Delete Icon */}
        <div className="col-2 text-end">
          <RiDeleteBin5Line
            size="1.5rem"
            className="text-danger"
            style={{ cursor: "pointer" }}
            title="Remove Item"
            onClick={() => handleDeleteItemFromCart(_id)}
          />
        </div>
      </div>
    </div>
  );
};

export default CartCard;
