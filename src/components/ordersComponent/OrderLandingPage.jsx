import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import { getAllOrderNoPaginationAction } from "../../features/orders/orderActions";
import Stepper from "@mui/material/Stepper";
import Step from "@mui/material/Step";
import StepLabel from "@mui/material/StepLabel";
import { UserLayout } from "../layouts/UserLayout";
import axios from "axios";
import { toast } from "react-toastify";
import {
  IoDocumentTextOutline,
  IoLocationOutline,
  IoMailOutline,
  IoPersonOutline,
  IoSendOutline,
} from "react-icons/io5";
import AppDialog from "../dialogs/AppDialog";

const formatDateTime = (value) => {
  if (!value) return "Date unavailable";
  const dateValue = new Date(value);
  if (Number.isNaN(dateValue.getTime())) return "Date unavailable";
  const [date, time = ""] = dateValue.toISOString().split("T");
  return `${date} ${time ? `at ${time.split(".")[0]}` : ""}`;
};

const statusSteps = [
  { key: "pending", label: "Pending" },
  { key: "confirmed", label: "Confirmed" },
  { key: "shipped", label: "Shipped" },
  { key: "inTransit", label: "In Transit" },
  { key: "outForDelivery", label: "Out for Delivery" },
  { key: "delivered", label: "Delivered" },
];

const statusCopy = {
  pending: "Order received and waiting for confirmation.",
  confirmed: "Order confirmed and being prepared.",
  shipped: "Package has left the warehouse.",
  inTransit: "Package is moving through the courier network.",
  outForDelivery: "Courier is taking the package to the delivery address.",
  delivered: "Order has been delivered.",
  cancelled: "Order has been cancelled.",
  canceled: "Order has been canceled.",
};

const formatStatusLabel = (status = "") =>
  String(status)
    .replace(/([A-Z])/g, " $1")
    .replace(/^./, (char) => char.toUpperCase());

const OrderLandingPage = () => {
  const inquiryURL = import.meta.env.VITE_BACKEND_BASE_URL + "/inquiry";

  const { id } = useParams();
  const dispatch = useDispatch();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [dialog, setDialog] = useState(null);

  const { ordersNoPagination } = useSelector((state) => state.orderInfo);
  const selectedOrder = ordersNoPagination?.find((item) => item._id === id);

  const currentStatus = selectedOrder?.status || "pending";
  const activeStep = Math.max(
    statusSteps.findIndex((step) => step.key === currentStatus),
    0
  );
  const historyByStatus = new Map(
    (selectedOrder?.status_history || []).map((entry) => [entry.status, entry])
  );
  const timeline =
    selectedOrder && (currentStatus === "cancelled" || currentStatus === "canceled")
      ? [
          {
            status: currentStatus,
            date:
              historyByStatus.get(currentStatus)?.date ||
              selectedOrder.updatedAt ||
              selectedOrder.createdAt,
            description: statusCopy[currentStatus],
          },
        ]
      : statusSteps.slice(0, activeStep + 1).map((step, index) => {
          const existing = historyByStatus.get(step.key);
          return {
            status: step.key,
            date:
              existing?.date ||
              (index === 0 ? selectedOrder?.createdAt : selectedOrder?.updatedAt),
            description: existing?.description || statusCopy[step.key],
          };
        });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    if (message.trim().length < 10) {
      setDialog({
        title: "Message is too short",
        message: "Please write at least 10 characters so support has enough context.",
      });
      setLoading(false);
      return;
    }

    try {
      const obj = {
        customer_name: name.trim(),
        customer_email: email.trim(),
        customer_message: message.trim(),
        orderNumber: selectedOrder?._id || "N/A",
      };

      const response = await axios.post(inquiryURL, obj, {
        headers: { "Content-Type": "application/json" },
      });

      if (response.status !== 200 && response.status !== 201) {
        setDialog({
          title: "Message not sent",
          message: "The support form could not be submitted. Please try again later.",
        });
        setLoading(false);
        return;
      }

      setEmail("");
      setName("");
      setMessage("");
      toast("Submitted");
    } catch (error) {
      console.error("Submission error:", error.response?.data || error.message);

      if (error.response?.status === 400) {
        setDialog({
          title: "Invalid form data",
          message: error.response.data?.message || "Please check the form and try again.",
        });
      } else {
        setDialog({
          title: "Something went wrong",
          message: "Please try sending your message again later.",
        });
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const fetchingAllOrders = async () => {
      await dispatch(getAllOrderNoPaginationAction());
    };
    fetchingAllOrders();
  }, [dispatch, id]);

  return (
    <UserLayout pageTitle="Track Your Order">
      {!selectedOrder ? (
        <div className="orders-empty-state">
          <strong>Loading order details...</strong>
          <span>We are getting the latest information for this order.</span>
        </div>
      ) : (
        <section className="order-detail-page">
          <div className="order-detail-hero">
            <div>
              <p className="section-kicker">Live order tracking</p>
              <h2>
                {formatStatusLabel(selectedOrder?.status)}
              </h2>
              <p>
                Tracking number <strong>{selectedOrder?._id}</strong>
              </p>
            </div>
            <div className="order-detail-total">
              <span>Total</span>
              <strong>${Number(selectedOrder?.totalAmount || 0).toFixed(2)}</strong>
            </div>
          </div>

          <div className="order-stepper-card">
            <Stepper activeStep={activeStep} alternativeLabel>
              {statusSteps.map((step) => (
                <Step key={step.key}>
                  <StepLabel>{step.label}</StepLabel>
                </Step>
              ))}
            </Stepper>
          </div>

          <div className="order-detail-grid">
            <div className="order-info-card">
              <span className="section-kicker">Courier</span>
              <strong>{selectedOrder?.courier || "Preparing shipment"}</strong>
            </div>
            <div className="order-info-card">
              <span className="section-kicker">Shipping address</span>
              <strong>
                <IoLocationOutline aria-hidden /> {selectedOrder?.shippingAddress}
              </strong>
            </div>
            <div className="order-info-card">
              <span className="section-kicker">Documents</span>
              <strong>
                <IoDocumentTextOutline aria-hidden /> Invoice available from
                order list
              </strong>
            </div>
          </div>

          <div className="order-detail-panel">
            <h3>Ordered Items</h3>
            <div className="order-detail-items">
              {selectedOrder?.products?.map((item, index) => (
                <div className="order-detail-item" key={index}>
                  <img
                    src={item.images?.[0]}
                    alt={item.name}
                    onError={(e) => {
                      e.currentTarget.src = "/placeholder-image.png";
                    }}
                  />
                  <span>{item?.name}</span>
                  <strong>x{item?.quantity}</strong>
                </div>
              ))}
            </div>
          </div>

          <div className="order-detail-panel">
            <h3>Status Timeline</h3>
            <div className="order-timeline">
              {timeline.map((status, index) => (
                <div className="order-timeline-item" key={index}>
                  <span className="order-timeline-dot" />
                  <div>
                    <strong>
                      {formatStatusLabel(status.status)}
                    </strong>
                    <small>{formatDateTime(status.date)}</small>
                    <p>{status.description || "Status updated."}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="order-detail-panel support-panel">
            <h3>Contact Support</h3>
            <p className="text-secondary mb-3">
              Have questions about your order? Send us a message.
            </p>

            <form onSubmit={handleSubmit} className="order-support-form">
              <div className="order-input-wrap">
                <label htmlFor="name" className="form-label">
                  Name
                </label>
                <IoPersonOutline aria-hidden />
                <input
                  type="text"
                  id="name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Your full name"
                  required
                  className="form-control"
                />
              </div>

              <div className="order-input-wrap">
                <label htmlFor="email" className="form-label">
                  Email Address
                </label>
                <IoMailOutline aria-hidden />
                <input
                  type="email"
                  id="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@example.com"
                  required
                  className="form-control"
                />
              </div>

              <div className="mb-3 w-100">
                <label htmlFor="message" className="form-label">
                  Message
                </label>
                <textarea
                  id="message"
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  rows="4"
                  className="form-control"
                  placeholder="Tell us what you need help with..."
                  required
                />
              </div>

              <button
                type="submit"
                className="btn btn-luxe rounded-pill py-3 px-4"
                disabled={loading}
              >
                <IoSendOutline aria-hidden />{" "}
                {loading ? "Submitting..." : "Send Message"}
              </button>
            </form>
          </div>
        </section>
      )}

      <AppDialog
        show={!!dialog}
        variant="warning"
        title={dialog?.title}
        message={dialog?.message}
        confirmOnly
        confirmText="Got It"
        onConfirm={() => setDialog(null)}
      />
    </UserLayout>
  );
};

export default OrderLandingPage;
