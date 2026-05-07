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
      mode === "add"
        ? itemCartQuantiy + 1
        : itemCartQuantiy < 1
        ? itemCartQuantiy
        : itemCartQuantiy - 1;
    if (qty === 0) {
      dispatch(removeItem(_id));
    }
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
    <article className="cart-item-card">
      <div className="cart-item-layout">
        <div className="cart-item-media">
          <img
            src={images?.[0]}
            alt={name}
            className="cart-item-image"
            onError={(e) => {
              e.currentTarget.src = "/placeholder-image.png";
            }}
          />
        </div>

        <div className="cart-item-details">
          <div className="cart-item-copy">
            <p className="section-kicker mb-1">In your cart</p>
            <h3>{name}</h3>
          </div>
          <div className="cart-item-meta">
            <div>
              <span
                className="fw-bold me-1"
                style={{ fontSize: "clamp(1.1rem, 1.5vw, 1.25rem)" }}
              >
                $
              </span>
              <span
                className="price-tag"
                style={{ fontSize: "clamp(1.1rem, 1.5vw, 1.25rem)" }}
              >
                {Number(totalPrice || 0).toFixed(2)}
              </span>
            </div>
            <div className="cart-item-qty">
              <span className="me-2 fw-semibold">Qty</span>
              <div className="cart-qty-control">
                <button
                  type="button"
                  onClick={() => handleQuantityChange("subtract", _id)}
                  aria-label={`Decrease quantity for ${name}`}
                >
                  -
                </button>
                <span>{itemCartQuantiy}</span>
                <button
                  type="button"
                  onClick={() => handleQuantityChange("add", _id)}
                  aria-label={`Increase quantity for ${name}`}
                >
                  +
                </button>
              </div>
            </div>
          </div>
        </div>

        <button
          type="button"
          className="cart-remove-button"
          title="Remove Item"
          aria-label={`Remove ${name} from cart`}
          onClick={() => handleDeleteItemFromCart(_id)}
        >
          <RiDeleteBin5Line
            size="1.25rem"
            aria-hidden
          />
        </button>
      </div>
    </article>
  );
};

export default CartCard;
