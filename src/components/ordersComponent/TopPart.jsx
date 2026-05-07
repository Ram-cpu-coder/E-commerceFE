import React, { useEffect, useState } from "react";
import { GoCopy } from "react-icons/go";
import { useDispatch } from "react-redux";
import { updateOrderAction } from "../../features/orders/orderActions";
import { IoBarcodeOutline, IoCalendarClearOutline } from "react-icons/io5";

const TopPart = ({ item, user }) => {
  const dispatch = useDispatch();
  const [showText, setShowText] = useState(false);
  // order status
  const handleOnStatus = async (e, id) => {
    console.log(e.target.value);
    await dispatch(updateOrderAction({ _id: id, status: e.target.value }));
  };
  useEffect(() => {
    if (showText) {
      const timer = setTimeout(() => {
        setShowText(false);
      }, 500);

      return () => clearTimeout(timer);
    }
  }, [showText]);

  const statusLabel = String(item.status || "")
    .replace(/([A-Z])/g, " $1")
    .replace(/^./, (char) => char.toUpperCase());

  return (
    <div className="order-card-top">
      {/* tracking id */}
      <div className="order-card-id">
        <span className="order-meta-label">
          <IoBarcodeOutline aria-hidden />
          Tracking ID
        </span>
        <span className="order-id-value">{item._id}</span>
        <button
          type="button"
          className="order-copy-button"
          onClick={() => {
            navigator.clipboard.writeText(item._id);
            setShowText(true);
          }}
          title="Copy Order Id"
          aria-label="Copy order id"
        >
          <GoCopy aria-hidden />
        </button>
        {showText && (
          <span className="text-success small" style={{ fontWeight: 700 }}>
            Copied!
          </span>
        )}
      </div>

      {/* status of the order*/}
      <div className="order-card-status">
        <span className="order-date">
          <IoCalendarClearOutline aria-hidden />
          {new Date(item.createdAt).toLocaleDateString()}
        </span>
        {user.role === "admin" ? (
          <select
            className="order-status-select"
            value={item.status}
            onChange={(e) => handleOnStatus(e, item?._id)}
            aria-label="Update order status"
          >
            <option value="pending" className="text-warning">
              Pending
            </option>
            <option value="confirmed" className="text-success">
              Confirmed
            </option>
            <option value="shipped" className="text-primary">
              Shipped
            </option>
            <option value="inTransit" className="text-primary">
              In Transit
            </option>
            <option value="outForDelivery" className="text-primary">
              Out For Delivery
            </option>

            <option value="delivered" className="text-success">
              Delivered
            </option>
            <option value="cancelled" className="text-danger">
              Cancelled
            </option>
            <option value="canceled" className="text-danger">
              Canceled
            </option>
          </select>
        ) : (
          <span
            className={`order-status-pill ${
              item.status === "pending"
                ? "status-pending"
                : item.status === "delivered"
                ? "status-delivered"
                : "status-active"
            }`}
          >
            {statusLabel}
          </span>
        )}
      </div>
    </div>
  );
};

export default TopPart;
