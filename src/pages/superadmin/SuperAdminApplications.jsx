import React, { useCallback, useEffect, useState } from "react";
import { Button, Form, Table } from "react-bootstrap";
import { useDispatch } from "react-redux";
import { toast } from "react-toastify";
import BreadCrumbsAdmin from "../../components/breadCrumbs/BreadCrumbsAdmin";
import AppDialog from "../../components/dialogs/AppDialog";
import { UserLayout } from "../../components/layouts/UserLayout";
import { getShopApplicationsApi, respondShopApplicationApi } from "../../features/shop/shopApi";
import { setMenu } from "../../features/user/userSlice";
import { IoCheckmarkCircleOutline, IoCloseCircleOutline, IoStorefrontOutline } from "react-icons/io5";

const dateText = (value) => {
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? "Date unavailable" : date.toLocaleDateString();
};

const SuperAdminApplications = () => {
  const dispatch = useDispatch();
  const [applications, setApplications] = useState([]);
  const [statusFilter, setStatusFilter] = useState("pending");
  const [reviewTarget, setReviewTarget] = useState(null);
  const [reviewDecision, setReviewDecision] = useState("");
  const [responseMessage, setResponseMessage] = useState("");
  const [busy, setBusy] = useState(false);
  const [loading, setLoading] = useState(true);

  const loadApplications = useCallback(async () => {
    setLoading(true);
    const result = await getShopApplicationsApi(statusFilter);
    setApplications(result.status === "success" ? result.applications || [] : []);
    setLoading(false);
  }, [statusFilter]);

  useEffect(() => {
    dispatch(setMenu("Shop Applications"));
    loadApplications();
  }, [dispatch, loadApplications]);

  const openReview = (application, decision) => {
    setReviewTarget(application);
    setReviewDecision(decision);
    setResponseMessage(
      decision === "approved"
        ? "Approved. Your shop and Shop Admin account are ready."
        : "Rejected after Super Admin review. Please update your shop or payout details and contact support.",
    );
  };

  const closeReview = () => {
    setReviewTarget(null);
    setReviewDecision("");
    setResponseMessage("");
    setBusy(false);
  };

  const submitReview = async () => {
    if (!reviewTarget?._id) return;
    setBusy(true);
    const result = await respondShopApplicationApi(reviewTarget._id, {
      decision: reviewDecision,
      responseMessage,
    });
    toast[result.status || "error"](result.message || "Unable to review application.");
    setBusy(false);
    if (result.status === "success") {
      closeReview();
      loadApplications();
    }
  };

  return (
    <UserLayout pageTitle="Shop Applications">
      <BreadCrumbsAdmin />
      <section className="platform-dashboard-page">
        <div className="platform-hero compact">
          <div>
            <p className="section-kicker">Seller onboarding</p>
            <h1>Shop Applications</h1>
            <p>Review seller identity, shop details, payout readiness, and approve only the shops that are ready to operate on the marketplace.</p>
          </div>
          <div className="admin-customers-count">
            <IoStorefrontOutline aria-hidden />
            <strong>{applications.length}</strong>
            <span>{statusFilter} requests</span>
          </div>
        </div>

        <div className="platform-panel">
          <div className="platform-panel-header">
            <div>
              <p className="section-kicker">Review queue</p>
              <h2>Applications</h2>
            </div>
            <Form.Select className="platform-status-filter" value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)}>
              <option value="pending">Pending</option>
              <option value="approved">Approved</option>
              <option value="rejected">Rejected</option>
              <option value="all">All</option>
            </Form.Select>
          </div>

          <Table responsive className="admin-customers-table mb-0">
            <thead>
              <tr>
                <th>Shop</th>
                <th>Owner</th>
                <th>Business</th>
                <th>Payout</th>
                <th>Status</th>
                <th>Submitted</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                Array.from({ length: 5 }, (_, index) => (
                  <tr key={index}><td colSpan="7"><span className="app-skeleton line wide" /></td></tr>
                ))
              ) : applications.length ? applications.map((item) => (
                <tr key={item._id}>
                  <td><strong>{item.shopName}</strong><div className="text-muted small">{item.address}</div></td>
                  <td><strong>{item.ownerFirstName} {item.ownerLastName}</strong><div className="text-muted small">{item.ownerEmail}</div></td>
                  <td><strong>{item.businessType || "Not set"}</strong><div className="text-muted small">{item.businessCategory || "No category"}</div></td>
                  <td><strong>{item.paymentProvider}</strong><div className="text-muted small">{item.payoutCurrency} / {item.payoutAccountEmail}</div></td>
                  <td><span className={`admin-stock-pill ${item.status === "approved" ? "success" : item.status === "rejected" ? "danger" : "warning"}`}>{item.status}</span></td>
                  <td>{dateText(item.createdAt)}</td>
                  <td>
                    <div className="superadmin-actions">
                      <Button size="sm" disabled={item.status !== "pending"} onClick={() => openReview(item, "approved")}><IoCheckmarkCircleOutline /> Approve</Button>
                      <Button size="sm" variant="outline-danger" disabled={item.status !== "pending"} onClick={() => openReview(item, "rejected")}><IoCloseCircleOutline /> Reject</Button>
                    </div>
                  </td>
                </tr>
              )) : (
                <tr><td colSpan="7" className="text-center py-4">No applications found.</td></tr>
              )}
            </tbody>
          </Table>
        </div>
      </section>

      <AppDialog
        show={Boolean(reviewTarget)}
        variant={reviewDecision === "approved" ? "success" : "danger"}
        title={`${reviewDecision === "approved" ? "Approve" : "Reject"} ${reviewTarget?.shopName || "shop"}`}
        message={
          <div className="platform-review-dialog">
            <p>{reviewDecision === "approved" ? "Approval creates the Shop and a verified Shop Admin account." : "Rejection closes the application without creating shop access."}</p>
            <Form.Control as="textarea" rows={3} value={responseMessage} onChange={(e) => setResponseMessage(e.target.value)} />
          </div>
        }
        busy={busy}
        cancelText="Cancel"
        confirmText={reviewDecision === "approved" ? "Approve Shop" : "Reject Shop"}
        onCancel={closeReview}
        onConfirm={submitReview}
      />
    </UserLayout>
  );
};

export default SuperAdminApplications;
