import React, { useEffect, useMemo, useState } from "react";
import { Form, Table } from "react-bootstrap";
import { useDispatch } from "react-redux";
import BreadCrumbsAdmin from "../../components/breadCrumbs/BreadCrumbsAdmin";
import { UserLayout } from "../../components/layouts/UserLayout";
import { getAllOrdersNoPagination } from "../../features/orders/orderAxios";
import { setMenu } from "../../features/user/userSlice";
import { IoBagCheckOutline } from "react-icons/io5";

const money = (value) => Number(value || 0).toLocaleString(undefined, { style: "currency", currency: "AUD" });
const dateText = (value) => {
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? "Date unavailable" : date.toLocaleDateString();
};

const SuperAdminGlobalOrders = () => {
  const dispatch = useDispatch();
  const [orders, setOrders] = useState([]);
  const [query, setQuery] = useState("");
  const [status, setStatus] = useState("all");

  useEffect(() => {
    dispatch(setMenu("Global Orders"));
    const loadOrders = async () => {
      const result = await getAllOrdersNoPagination();
      setOrders(result.status === "success" ? result.orders || [] : []);
    };
    loadOrders();
  }, [dispatch]);

  const filteredOrders = useMemo(() => {
    const search = query.trim().toLowerCase();
    return orders
      .filter((order) => status === "all" || order.status === status)
      .filter((order) => {
        if (!search) return true;
        return `${order._id} ${order.status} ${order.shippingAddress} ${(order.fulfillments || []).map((item) => item.shopName).join(" ")}`.toLowerCase().includes(search);
      });
  }, [orders, query, status]);

  const totalRevenue = filteredOrders.reduce((sum, order) => sum + Number(order.totalAmount || 0), 0);

  return (
    <UserLayout pageTitle="Global Orders">
      <BreadCrumbsAdmin />
      <section className="platform-dashboard-page">
        <div className="platform-hero compact">
          <div>
            <p className="section-kicker">Marketplace operations</p>
            <h1>Global Orders</h1>
            <p>Inspect every customer order across every shop, including split fulfillments and shop delivery ownership.</p>
          </div>
          <div className="admin-customers-count">
            <IoBagCheckOutline aria-hidden />
            <strong>{filteredOrders.length}</strong>
            <span>{money(totalRevenue)}</span>
          </div>
        </div>

        <div className="admin-customers-toolbar">
          <div className="admin-customers-search">
            <Form.Control value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Search order, shop, status, or address..." />
          </div>
          <Form.Select value={status} onChange={(e) => setStatus(e.target.value)}>
            <option value="all">All statuses</option>
            <option value="pending">Pending</option>
            <option value="confirmed">Confirmed</option>
            <option value="shipped">Shipped</option>
            <option value="inTransit">In transit</option>
            <option value="outForDelivery">Out for delivery</option>
            <option value="delivered">Delivered</option>
            <option value="cancelled">Cancelled</option>
          </Form.Select>
        </div>

        <div className="platform-panel">
          <Table responsive className="admin-customers-table mb-0">
            <thead>
              <tr>
                <th>Order</th>
                <th>Customer</th>
                <th>Shops</th>
                <th>Total</th>
                <th>Status</th>
                <th>Placed</th>
                <th>Shipping</th>
              </tr>
            </thead>
            <tbody>
              {filteredOrders.length ? filteredOrders.map((order) => (
                <tr key={order._id}>
                  <td><strong>{String(order._id).slice(-8).toUpperCase()}</strong><div className="text-muted small">{order._id}</div></td>
                  <td>{order.userId?.email || order.userId || "Customer unavailable"}</td>
                  <td>{(order.fulfillments || []).map((item) => item.shopName || "Shop").join(", ") || "No shop split"}</td>
                  <td>{money(order.totalAmount)}</td>
                  <td><span className={`admin-stock-pill ${order.status === "delivered" ? "success" : order.status === "cancelled" ? "danger" : "warning"}`}>{order.status}</span></td>
                  <td>{dateText(order.createdAt)}</td>
                  <td>{order.shippingAddress || "Address unavailable"}</td>
                </tr>
              )) : (
                <tr><td colSpan="7" className="text-center py-4">No orders found.</td></tr>
              )}
            </tbody>
          </Table>
        </div>
      </section>
    </UserLayout>
  );
};

export default SuperAdminGlobalOrders;
