import React, { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { Link } from "react-router-dom";
import { deleteOrderAction } from "../../features/orders/orderActions";
import { generateInvoice } from "../../features/invoice/invoiceApi";
import {
  IoDocumentTextOutline,
  IoLocationOutline,
  IoNavigateOutline,
  IoTrashOutline,
} from "react-icons/io5";

const extractBlob = (response) => {
  if (response instanceof Blob) return response;
  if (response?.data instanceof Blob) return response.data;
  return null;
};

const Actions = ({ item, user }) => {
  const dispatch = useDispatch();
  const [invoiceUrl, setInvoiceUrl] = useState("");

  useEffect(() => {
    return () => {
      if (invoiceUrl) {
        URL.revokeObjectURL(invoiceUrl);
      }
    };
  }, [invoiceUrl]);

  const handleOnCancelOrder = (_id) => {
    dispatch(deleteOrderAction(_id));
  };

  const handleOnInvoice = async (id) => {
    try {
      if (invoiceUrl) {
        window.open(invoiceUrl, "_blank", "noopener,noreferrer");
        return;
      }

      const response = await generateInvoice(id);

      if (response?.status === "error") {
        throw new Error(response.message || "Invoice could not be generated");
      }

      const blob = extractBlob(response);

      if (!blob || !blob.size) {
        throw new Error("Invoice PDF was not returned by the server");
      }

      if (blob.type?.includes("application/json")) {
        const errorText = await blob.text();
        const errorPayload = JSON.parse(errorText);
        throw new Error(errorPayload.message || "Invoice could not be generated");
      }

      const pdfBlob =
        blob.type === "application/pdf"
          ? blob
          : new Blob([blob], { type: "application/pdf" });
      const url = URL.createObjectURL(pdfBlob);
      setInvoiceUrl(url);
      window.open(url, "_blank", "noopener,noreferrer");
    } catch (error) {
      console.error(error?.message || error);
    }
  };

  return (
    <div className="order-card-actions">
      <div className="order-card-shipping">
        <strong className="price-tag">$ {Number(item.totalAmount || 0).toFixed(2)}</strong>
        <div className="order-address-line">
          <IoLocationOutline aria-hidden />
          <span>{item.shippingAddress || "Address not available"}</span>
        </div>
        <div className="order-inline-links">
          {item.status === "pending" || item.status === "confirmed" ? (
            <Link to={`/user/address/${item._id}`}>Change</Link>
          ) : (
            ""
          )}
        </div>
      </div>
      <div className="order-action-buttons">
        <Link to={`/user/orders/${item._id}`} className="order-action-button primary">
          <IoNavigateOutline aria-hidden />
          Track
        </Link>
        <a
          href={invoiceUrl || "#invoice"}
          onClick={(event) => {
            event.preventDefault();
            handleOnInvoice(item._id);
          }}
          title="Invoice"
          className="order-action-button"
        >
          <IoDocumentTextOutline aria-hidden />
          Invoice
        </a>
        {user?.role === "admin" || item.status === "pending" || item.status === "confirmed" ? (
          <button
            type="button"
            className="order-action-button danger"
            onClick={() => handleOnCancelOrder(item._id)}
            title="Cancel"
          >
            <IoTrashOutline aria-hidden />
            Cancel
          </button>
        ) : null}
      </div>
    </div>
  );
};

export default Actions;
