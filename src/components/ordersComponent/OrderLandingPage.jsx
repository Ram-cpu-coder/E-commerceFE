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
  console.log(selectedOrder, 9999);
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    // Basic validation before hitting backend
    if (message.trim().length < 10) {
      alert("Message should be at least 10 characters long.");
      return;
    }

    try {
      const obj = {
        customer_name: name.trim(),
        customer_email: email.trim(),
        customer_message: message.trim(),
        orderNumber: selectedOrder?._id || "N/A", // dynamic fallback
      };

      const response = await axios.post(inquiryURL, obj, {
        headers: { "Content-Type": "application/json" },
      });

      // Check for valid response
      if (response.status !== 200 && response.status !== 201) {
        alert("Form could not be submitted! Try again later.");
        return;
      }

      setEmail("");
      setName("");
      setMessage("");
      toast("Submitted");
      setLoading(false);
    } catch (error) {
      console.error(
        "❌ Submission error:",
        error.response?.data || error.message
      );

      // More user-friendly feedback
      if (error.response?.status === 400) {
        alert(error.response.data?.message || "Invalid form data.");
      } else {
        alert("Something went wrong. Please try again later.");
      }
    }
  };

  const steps = ["Pending", "Confirmed", "Shipped", "In Transit", "Delivered"];
  const activeStep = selectedOrder?.status_history.length;

  useEffect(() => {
    const fetchingAllOrders = async () => {
      await dispatch(getAllOrderNoPaginationAction());
    };
    ordersNoPagination.length === 0 ? fetchingAllOrders() : "";
  }, [dispatch]);

  return (
    <UserLayout pageTitle="Track Your Order">
      {!selectedOrder ? (
        <div>Loading order details...</div>
      ) : (
        <section className="d-flex flex-column align-items-center col-12 col-md-11 col-lg-8">
          <div className="col-10 d-flex flex-column align-items-center">
            <header className="d-flex justify-content-between w-100">
              <div className="d-flex w-100">
                <h3 className="h5 fw-semibold mb-3 text-dark">
                  Tracking Number:{" "}
                </h3>
                <span> &nbsp;{selectedOrder?._id}</span>
              </div>
            </header>
            {/*  Stepper */}
            <div className="d-flex w-100">
              <h3 className="h5 fw-semibold mb-3 text-dark">Courier: &nbsp;</h3>
              <span>{selectedOrder?.courier}</span>
            </div>
          </div>

          {/* for stepper we will control the activeStep */}
          <Stepper
            activeStep={activeStep}
            alternativeLabel
            className="col-12 my-5"
          >
            {steps.map((label) => (
              <Step key={label}>
                <StepLabel>{label}</StepLabel>
              </Step>
            ))}
          </Stepper>
          {/* ordered products images */}
          <div className="col-10 mb-5 d-flex flex-column">
            <h3 className="h5 fw-semibold mb-3 text-dark">Ordered Items</h3>
            <span className="d-flex flex-column">
              {selectedOrder?.products?.map((item, index) => {
                return (
                  <div className="d-flex align-items-center" key={index}>
                    {" "}
                    <img
                      src={item.images[0]}
                      alt={item.name}
                      className="me-3"
                      style={{
                        height: "50px",
                        width: "50px",
                        aspectRatio: "10/5",
                      }}
                    />
                    <span>{item?.name}</span>
                    <span> &nbsp;X&nbsp; {item?.quantity}</span>
                  </div>
                );
              })}
            </span>
          </div>

          {/* Status Timeline */}
          <div className="mb-10 col-10 d-flex flex-column">
            <h3 className="h5 fw-semibold mb-3 text-dark">Status Timeline</h3>
            <div className="border border-gray-200 rounded-lg overflow-hidden col-12 px-3 bg-white">
              <table className="min-w-full divide-y divide-gray-200 w-100 px-2">
                <thead className="bg-gray-50">
                  <tr className="w-100 border-bottom">
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider col-4">
                      Status
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider col-4">
                      Date & Time
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider col-4">
                      Description
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200 ">
                  {selectedOrder?.status === "pending" && (
                    <tr>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div></div>
                          <span>
                            {selectedOrder?.status.charAt(0).toUpperCase() +
                              selectedOrder?.status.slice(1)}
                          </span>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {status.date ? (
                          <>
                            <i>{status.date.split("T")[0]}</i> at{" "}
                            <i>{status.date.split("T")[1].split(".")[0]}</i>
                          </>
                        ) : (
                          <span className="text-gray-400">-</span>
                        )}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-500">
                        {status.description || (
                          <span className="text-gray-400">-</span>
                        )}
                      </td>
                    </tr>
                  )}
                  {selectedOrder.status_history.map((status, index) => (
                    <tr key={index}>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div></div>
                          <span>
                            {status.status.charAt(0).toUpperCase() +
                              status.status.slice(1)}
                          </span>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {status.date ? (
                          <>
                            <i>{status.date.split("T")[0]}</i> at{" "}
                            <i>{status.date.split("T")[1].split(".")[0]}</i>
                          </>
                        ) : (
                          <span className="text-gray-400">-</span>
                        )}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-500">
                        {status.description || (
                          <span className="text-gray-400">-</span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Contact Form */}
          <div className="bg-light rounded col-10 my-5 d-flex flex-column">
            <h3 className="h5 fw-semibold mb-3 text-dark">Contact Support</h3>
            <p className="text-secondary mb-3">
              Have questions about your order? Send us a message.
            </p>

            <form
              onSubmit={handleSubmit}
              className="d-flex flex-column align-items-center col-12"
            >
              {[
                {
                  id: "name",
                  label: "Name",
                  type: "text",
                  value: name,
                  setter: setName,
                  placeholder: "John Doe",
                },
                {
                  id: "email",
                  label: "Email Address",
                  type: "email",
                  value: email,
                  setter: setEmail,
                  placeholder: "your.email@example.com",
                },
              ].map((field) => (
                <div key={field.id} className="mb-3 w-100">
                  <label htmlFor={field.id} className="form-label">
                    {field.label}
                  </label>
                  <input
                    type={field.type}
                    id={field.id}
                    value={field.value}
                    onChange={(e) => field.setter(e.target.value)}
                    placeholder={field.placeholder}
                    required
                    className="form-control"
                  />
                </div>
              ))}

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
                ></textarea>
              </div>

              <button
                type="submit"
                className="btn btn-primary rounded py-2 px-4"
                disabled={loading}
              >
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
