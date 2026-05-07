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

const formatDateTime = (value) => {
  if (!value) return "-";
  const [date, time = ""] = value.split("T");
  return `${date} ${time ? `at ${time.split(".")[0]}` : ""}`;
};

const OrderLandingPage = () => {
  const inquiryURL = import.meta.env.VITE_BACKEND_BASE_URL + "/inquiry";

  const { id } = useParams();
  const dispatch = useDispatch();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const { ordersNoPagination } = useSelector((state) => state.orderInfo);
  const selectedOrder = ordersNoPagination?.find((item) => item._id === id);

  const steps = ["Pending", "Confirmed", "Shipped", "In Transit", "Delivered"];
  const activeStep = selectedOrder?.status_history?.length || 0;
  const timeline =
    selectedOrder?.status_history?.length > 0
      ? selectedOrder.status_history
      : [
          {
            status: selectedOrder?.status || "pending",
            date: selectedOrder?.createdAt,
            description: "Order received and waiting for confirmation.",
          },
        ];

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    if (message.trim().length < 10) {
      alert("Message should be at least 10 characters long.");
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
        alert("Form could not be submitted! Try again later.");
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
        alert(error.response.data?.message || "Invalid form data.");
      } else {
        alert("Something went wrong. Please try again later.");
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const fetchingAllOrders = async () => {
      await dispatch(getAllOrderNoPaginationAction());
    };
    if (ordersNoPagination.length === 0) {
      fetchingAllOrders();
    }
  }, [dispatch, ordersNoPagination.length]);

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
                {selectedOrder?.status?.charAt(0).toUpperCase() +
                  selectedOrder?.status?.slice(1)}
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
              {steps.map((label) => (
                <Step key={label}>
                  <StepLabel>{label}</StepLabel>
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
                      {status.status?.charAt(0).toUpperCase() +
                        status.status?.slice(1)}
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
                  placeholder="John Doe"
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
                  placeholder="your.email@example.com"
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
                  placeholder="Enter your message here..."
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
    </UserLayout>
  );
};

export default OrderLandingPage;
