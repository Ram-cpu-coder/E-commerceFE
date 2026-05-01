import React, { useEffect, useState } from "react";
import { GoCopy } from "react-icons/go";
import { useDispatch } from "react-redux";
import { updateOrderAction } from "../../features/orders/orderActions";

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

  return (
    <div
      className="d-flex justify-content-between flex-wrap"
      style={{ width: "98%" }}
    >
      {/* tracking id */}
      <div className="mb-0 d-flex align-items-center">
        <span>
          <b>Tracking Id:</b> {item._id}
        </span>
        &nbsp;
        <GoCopy
          onClick={() => {
            navigator.clipboard.writeText(item._id);
            setShowText(true);
          }}
          style={{
            cursor: "pointer",
            userSelect: "text",
            color: "blue",
          }}
          title="Copy Order Id"
        />
        {showText && (
          <span className="text-success ms-2 small" style={{ fontWeight: 500 }}>
            Copied!
          </span>
        )}
      </div>

      {/* status of the order*/}
      <div style={{ height: "auto" }}>
        <b>Placed At:</b> {new Date(item.createdAt).toLocaleDateString()} |
        &nbsp;
        {user.role === "admin" ? (
          <select
            className={
              item.status === "pending"
                ? "text-warning"
                : item.status === "shipped"
                ? "text-primary"
                : "text-success"
            }
            style={{
              border: "0px",
              background: "transparent",
              outline: "none",
            }}
            value={item.status}
            onChange={(e) => handleOnStatus(e, item?._id)}
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
          </select>
        ) : (
          <span
            className={
              item.status === "pending"
                ? "text-warning"
                : item.status === "shipped"
                ? "text-primary"
                : "text-success"
            }
          >
            {item.status.charAt(0).toUpperCase() + item.status.slice(1)}
          </span>
        )}
      </div>
    </div>
  );
};

export default TopPart;
