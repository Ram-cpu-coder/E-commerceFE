import React, { useEffect, useMemo, useState } from "react";
import { Button, Form, Table } from "react-bootstrap";
import { useDispatch } from "react-redux";
import { toast } from "react-toastify";
import BreadCrumbsAdmin from "../../components/breadCrumbs/BreadCrumbsAdmin";
import { UserLayout } from "../../components/layouts/UserLayout";
import { getAdminProductApi, updateProductApiIndividually } from "../../features/products/productAxios";
import { setMenu } from "../../features/user/userSlice";
import { IoBanOutline, IoCheckmarkCircleOutline, IoCubeOutline } from "react-icons/io5";

const money = (value) => Number(value || 0).toLocaleString(undefined, { style: "currency", currency: "AUD" });

const SuperAdminProductModeration = () => {
  const dispatch = useDispatch();
  const [products, setProducts] = useState([]);
  const [query, setQuery] = useState("");
  const [status, setStatus] = useState("all");
  const [updatingId, setUpdatingId] = useState("");

  const loadProducts = async () => {
    const result = await getAdminProductApi();
    setProducts(result.status === "success" ? result.products || [] : []);
  };

  useEffect(() => {
    dispatch(setMenu("Product Moderation"));
    loadProducts();
  }, [dispatch]);

  const filteredProducts = useMemo(() => {
    const search = query.trim().toLowerCase();
    return products
      .filter((product) => status === "all" || product.status === status)
      .filter((product) => {
        if (!search) return true;
        return `${product.name} ${product.shopName} ${product.status}`.toLowerCase().includes(search);
      });
  }, [products, query, status]);

  const changeStatus = async (product, nextStatus) => {
    setUpdatingId(product._id);
    const result = await updateProductApiIndividually(product._id, { status: nextStatus });
    toast[result.status || "error"](result.message || "Unable to moderate product.");
    setUpdatingId("");
    if (result.status === "success") {
      loadProducts();
    }
  };

  return (
    <UserLayout pageTitle="Product Moderation">
      <BreadCrumbsAdmin />
      <section className="platform-dashboard-page">
        <div className="platform-hero compact">
          <div>
            <p className="section-kicker">Marketplace trust</p>
            <h1>Product Moderation</h1>
            <p>Super Admin can inspect all shop products and force unsafe, incomplete, or policy-breaking products inactive across the marketplace.</p>
          </div>
          <div className="admin-customers-count">
            <IoCubeOutline aria-hidden />
            <strong>{filteredProducts.length}</strong>
            <span>products</span>
          </div>
        </div>

        <div className="admin-customers-toolbar">
          <div className="admin-customers-search">
            <Form.Control value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Search product, shop, or status..." />
          </div>
          <Form.Select value={status} onChange={(e) => setStatus(e.target.value)}>
            <option value="all">All products</option>
            <option value="active">Active only</option>
            <option value="inactive">Inactive only</option>
          </Form.Select>
        </div>

        <div className="platform-panel">
          <Table responsive className="admin-customers-table mb-0">
            <thead>
              <tr>
                <th>Product</th>
                <th>Shop</th>
                <th>Price</th>
                <th>Stock</th>
                <th>Rating</th>
                <th>Status</th>
                <th>Moderation</th>
              </tr>
            </thead>
            <tbody>
              {filteredProducts.length ? filteredProducts.map((product) => (
                <tr key={product._id}>
                  <td><strong>{product.name}</strong><div className="text-muted small">{product._id}</div></td>
                  <td>{product.shopName || "Unassigned"}</td>
                  <td>{money(product.price)}</td>
                  <td>{product.stock || 0}</td>
                  <td>{product.ratings || 0}</td>
                  <td><span className={`admin-stock-pill ${product.status === "active" ? "success" : "warning"}`}>{product.status}</span></td>
                  <td>
                    <div className="superadmin-actions">
                      <Button size="sm" disabled={updatingId === product._id || product.status === "active"} onClick={() => changeStatus(product, "active")}><IoCheckmarkCircleOutline /> Activate</Button>
                      <Button size="sm" variant="outline-danger" disabled={updatingId === product._id || product.status === "inactive"} onClick={() => changeStatus(product, "inactive")}><IoBanOutline /> Force inactive</Button>
                    </div>
                  </td>
                </tr>
              )) : (
                <tr><td colSpan="7" className="text-center py-4">No products found.</td></tr>
              )}
            </tbody>
          </Table>
        </div>
      </section>
    </UserLayout>
  );
};

export default SuperAdminProductModeration;
