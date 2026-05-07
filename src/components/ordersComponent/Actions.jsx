import React from "react";
import { useDispatch } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { deleteOrderAction } from "../../features/orders/orderActions";
import { generateInvoice } from "../../features/invoice/invoiceApi";

const Actions = ({ item }) => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const handleOnCancelOrder = (_id) => {
    dispatch(deleteOrderAction(_id));
  };

  const handleOnInvoice = async (id) => {
    try {
      const response = await generateInvoice(id);
      const blob = new Blob([response], { type: "application/pdf" });
      const url = URL.createObjectURL(blob);
      window.open(url, "_blank");
    } catch (error) {
      console.error(error?.message);
    }
  };

  return (
    <div
      className="d-flex align-items-end justify-content-between"
      style={{ width: "98%" }}
    >
      <p className="d-flex flex-column w-75" style={{ height: "auto" }}>
        $ {item.totalAmount}
        <span className="mb-0 ">
          <b>Shipping to: </b>
          {item.shippingAddress} &nbsp;
          {item.status === "pending" || item.status === "confirmed" ? (
            <Link to={`/user/address/${item._id}`}>Change</Link>
          ) : (
            ""
          )}
          &nbsp; &nbsp;
          <Link to={`/user/orders/${item._id}`}>Track Order</Link>
        </span>
      </p>
      <div className="d-flex gap-2 text-decoration-underline">
        <div
          onClick={() => handleOnInvoice(item._id)}
          title="Invoice"
          className=" text-primary"
          role="button"
          tabIndex={0}
          onKeyDown={(e) =>
            e.key === "Enter" && handleOnInvoice(item._id)
          }
        >
          Invoice
        </div>
        <div
          className="text-danger"
          onClick={() => handleOnCancelOrder(item._id)}
          title="Cancel"
          role="button"
          tabIndex={0}
          onKeyDown={(e) =>
            e.key === "Enter" && handleOnCancelOrder(item._id)
          }
        >
          Cancel
        </div>
      </div>
    </div>
  );
};

export default Actions;
