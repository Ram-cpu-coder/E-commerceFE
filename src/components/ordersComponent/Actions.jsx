import React from "react";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { deleteOrderAction } from "../../features/orders/orderActions";
import { generateInvoice } from "../../features/invoice/invoiceApi";

const Actions = ({ item, user }) => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  // deleting the order
  const handleOnCancelOrder = (_id) => {
    dispatch(deleteOrderAction(_id));
  };

  // invoice
  const handleOnInvoice = async (id) => {
    try {
      const response = await generateInvoice(id);
      console.log(response);
      const blob = new Blob([response], { type: "application/pdf" });
      const url = URL.createObjectURL(blob);
      window.open(url, "_blank");
    } catch (error) {
      console.log(error?.message);
    }
  };

  return (
    <div
      className="d-flex align-items-end justify-content-between"
      style={{ width: "98%" }}
    >
      <p className="d-flex flex-column w-75" style={{ height: "auto" }}>
        $ {item.totalAmount}
        {/* shipping address and its editing*/}
        <span className="mb-0 ">
          <b>Shipping to: </b>
          {item.shippingAddress} &nbsp;
          {item.status === "pending" || item.status === "confirmed" ? (
            <a href="" onClick={() => navigate(`/user/address/${item._id}`)}>
              Change
            </a>
          ) : (
            ""
          )}
          &nbsp; &nbsp;<a href={`/user/orders/${item._id}`}>Track Order</a>
        </span>
      </p>
      {/* buttons in accordion header */}
      <div className="d-flex gap-2 text-decoration-underline">
        <div
          onClick={() => handleOnInvoice(item._id)}
          title="Invoice"
          className=" text-primary"
        >
          Invoice
        </div>
        <div
          className="text-danger"
          onClick={() => handleOnCancelOrder(item._id)}
          title="Cancel"
        >
          Cancel
        </div>
      </div>
    </div>
  );
};

export default Actions;
