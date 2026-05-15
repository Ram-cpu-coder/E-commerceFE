import React, { useCallback, useEffect, useMemo, useState } from "react";
import { Button, Form, Table } from "react-bootstrap";
import { useDispatch } from "react-redux";
import { toast } from "react-toastify";
import BreadCrumbsAdmin from "../../components/breadCrumbs/BreadCrumbsAdmin";
import AppDialog from "../../components/dialogs/AppDialog";
import { UserLayout } from "../../components/layouts/UserLayout";
import { setMenu } from "../../features/user/userSlice";
import {
  getPlatformOverviewApi,
  getShopApplicationsApi,
  respondShopApplicationApi,
} from "../../features/shop/shopApi";
import {
  IoAlertCircleOutline,
  IoAnalyticsOutline,
  IoCardOutline,
  IoCheckmarkCircleOutline,
  IoCloseCircleOutline,
  IoPeopleOutline,
  IoRocketOutline,
  IoStorefrontOutline,
  IoTrendingDownOutline,
  IoTrendingUpOutline,
} from "react-icons/io5";

const money = (value) =>
  Number(value || 0).toLocaleString(undefined, {
    style: "currency",
    currency: "AUD",
  });

const percent = (value, total) => {
  if (!total) return 0;
  return Math.max(4, Math.round((Number(value || 0) / total) * 100));
};

const dateText = (value) => {
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? "Date unavailable" : date.toLocaleDateString();
};

const SuperAdminDashboard = () => {
  const dispatch = useDispatch();
  const [overview, setOverview] = useState(null);
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState("pending");
  const [reviewTarget, setReviewTarget] = useState(null);
  const [reviewDecision, setReviewDecision] = useState("");
  const [responseMessage, setResponseMessage] = useState("");
  const [reviewing, setReviewing] = useState(false);

  const loadDashboard = useCallback(async () => {
    setLoading(true);
    const [overviewResult, applicationResult] = await Promise.all([
      getPlatformOverviewApi(),
      getShopApplicationsApi(statusFilter),
    ]);
    setOverview(overviewResult.status === "success" ? overviewResult : null);
    setApplications(applicationResult.status === "success" ? applicationResult.applications || [] : []);
    setLoading(false);
  }, [statusFilter]);

  useEffect(() => {
    dispatch(setMenu("Platform Dashboard"));
    loadDashboard();
  }, [dispatch, loadDashboard]);

  const metrics = overview?.metrics || {};
  const maxRevenue = useMemo(
    () => Math.max(...(overview?.shopPerformance || []).map((shop) => Number(shop.revenue || 0)), 0),
    [overview],
  );

  const metricCards = [
    {
      label: "Platform sales",
      value: money(metrics.totalRevenue),
      icon: <IoAnalyticsOutline />,
      tone: "green",
    },
    {
      label: "Shop orders",
      value: metrics.totalShopOrders || 0,
      icon: <IoRocketOutline />,
      tone: "dark",
    },
    {
      label: "Active shops",
      value: `${metrics.activeShops || 0}/${metrics.totalShops || 0}`,
      icon: <IoStorefrontOutline />,
      tone: "gold",
    },
    {
      label: "Customers",
      value: metrics.totalCustomers || 0,
      icon: <IoPeopleOutline />,
      tone: "rose",
    },
    {
      label: "Pending applications",
      value: metrics.pendingApplications || 0,
      icon: <IoAlertCircleOutline />,
      tone: "orange",
    },
    {
      label: "Payment setup needed",
      value: metrics.paymentPendingShops || 0,
      icon: <IoCardOutline />,
      tone: "teal",
    },
  ];

  const renderSkeletonRows = (count = 5) => (
    <div className="skeleton-stack">
      {Array.from({ length: count }, (_, index) => (
        <span key={index} className="app-skeleton line wide" />
      ))}
    </div>
  );

  const openReview = (application, decision) => {
    setReviewTarget(application);
    setReviewDecision(decision);
    setResponseMessage(
      decision === "approved"
        ? "Approved. Your shop and Shop Admin account are ready."
        : "Rejected after Super Admin review. Please update the business or payout details and contact support.",
    );
  };

  const closeReview = () => {
    setReviewTarget(null);
    setReviewDecision("");
    setResponseMessage("");
    setReviewing(false);
  };

  const submitReview = async () => {
    if (!reviewTarget?._id || !reviewDecision) return;
    setReviewing(true);
    const result = await respondShopApplicationApi(reviewTarget._id, {
      decision: reviewDecision,
      responseMessage,
    });
    toast[result.status || "error"](result.message || "Unable to review shop registration.");
    setReviewing(false);
    if (result.status === "success") {
      closeReview();
      loadDashboard();
    }
  };

  return (
    <UserLayout pageTitle="Platform Dashboard">
      <BreadCrumbsAdmin />
      <section className="platform-dashboard-page">
        <div className="platform-hero">
          <div>
            <p className="section-kicker">Super Admin command center</p>
            <h1>Marketplace performance, shop approvals, and payout readiness</h1>
            <p>
              Super Admin sees the whole ecommerce platform here: total sales,
              all shop health, best and weak shops, pending registrations, and payout setup.
            </p>
          </div>
          <div className="platform-hero-visual" aria-hidden>
            <div className="platform-orbit-ring" />
            <div className="platform-visual-card primary">
              <span>Sales</span>
              <strong>{money(metrics.totalRevenue)}</strong>
            </div>
            <div className="platform-visual-card secondary">
              <span>Shops</span>
              <strong>{metrics.totalShops || 0}</strong>
            </div>
            <div className="platform-visual-card tertiary">
              <span>Approvals</span>
              <strong>{metrics.pendingApplications || 0}</strong>
            </div>
          </div>
        </div>

        <div className="platform-metric-grid">
          {loading ? Array.from({ length: 6 }, (_, index) => (
            <span key={index} className="app-skeleton platform-metric-skeleton" />
          )) : metricCards.map((card) => (
            <div key={card.label} className={`platform-metric-card ${card.tone}`}>
              <span>{card.icon}</span>
              <small>{card.label}</small>
              <strong>{card.value}</strong>
            </div>
          ))}
        </div>

        <div className="platform-grid">
          <div className="platform-panel wide">
            <div className="platform-panel-header">
              <div>
                <p className="section-kicker">Shop leaderboard</p>
                <h2>Which shops are doing better</h2>
              </div>
              <IoTrendingUpOutline aria-hidden />
            </div>
            <div className="shop-performance-list">
              {loading ? renderSkeletonRows(6) : (overview?.shopPerformance || []).slice(0, 8).map((shop) => (
                <div key={shop._id} className="shop-performance-row">
                  <div>
                    <strong>{shop.name}</strong>
                    <span>{shop.orders} orders / {shop.products} products / {shop.deliveredOrders} delivered</span>
                  </div>
                  <div className="shop-performance-bar">
                    <span style={{ width: `${percent(shop.revenue, maxRevenue)}%` }} />
                  </div>
                  <b>{money(shop.revenue)}</b>
                </div>
              ))}
              {!loading && !overview?.shopPerformance?.length && (
                <div className="shop-detail-empty">No shop performance data yet.</div>
              )}
            </div>
          </div>

          <div className="platform-panel">
            <div className="platform-panel-header">
              <div>
                <p className="section-kicker">Needs attention</p>
                <h2>Weak shops</h2>
              </div>
              <IoTrendingDownOutline aria-hidden />
            </div>
            <div className="platform-attention-list">
              {loading ? renderSkeletonRows(3) : (overview?.lowPerformingShops || []).map((shop) => (
                <div key={shop._id}>
                  <strong>{shop.name}</strong>
                  <span>No shop orders yet. Review products, inventory, and visibility.</span>
                </div>
              ))}
              {!loading && !overview?.lowPerformingShops?.length && (
                <div className="shop-detail-empty">No weak shops detected.</div>
              )}
            </div>
          </div>
        </div>

        <div className="platform-panel">
          <div className="platform-panel-header">
            <div>
              <p className="section-kicker">Shop registration queue</p>
              <h2>Approve or reject shop applications</h2>
            </div>
            <Form.Select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="platform-status-filter"
            >
              <option value="pending">Pending</option>
              <option value="approved">Approved</option>
              <option value="rejected">Rejected</option>
              <option value="all">All applications</option>
            </Form.Select>
          </div>

          <Table responsive className="admin-customers-table platform-application-table mb-0">
            <thead>
              <tr>
                <th>Shop</th>
                <th>Owner</th>
                <th>Payout</th>
                <th>Status</th>
                <th>Submitted</th>
                <th>Review</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                Array.from({ length: 4 }, (_, index) => (
                  <tr key={index}>
                    <td colSpan="6"><span className="app-skeleton line wide" /></td>
                  </tr>
                ))
              ) : applications.length ? applications.map((application) => (
                <tr key={application._id}>
                  <td>
                    <strong>{application.shopName}</strong>
                    <div className="text-muted small">{application.businessCategory || "Category not set"}</div>
                  </td>
                  <td>
                    <strong>{application.ownerFirstName} {application.ownerLastName}</strong>
                    <div className="text-muted small">{application.ownerEmail}</div>
                  </td>
                  <td>
                    <strong>{application.paymentProvider}</strong>
                    <div className="text-muted small">{application.payoutAccountEmail}</div>
                  </td>
                  <td>
                    <span className={`admin-stock-pill ${application.status === "approved" ? "success" : application.status === "rejected" ? "danger" : "warning"}`}>
                      {application.status}
                    </span>
                  </td>
                  <td>{dateText(application.createdAt)}</td>
                  <td>
                    <div className="superadmin-actions">
                      <Button
                        size="sm"
                        disabled={application.status !== "pending"}
                        onClick={() => openReview(application, "approved")}
                      >
                        <IoCheckmarkCircleOutline aria-hidden /> Approve
                      </Button>
                      <Button
                        size="sm"
                        variant="outline-danger"
                        disabled={application.status !== "pending"}
                        onClick={() => openReview(application, "rejected")}
                      >
                        <IoCloseCircleOutline aria-hidden /> Reject
                      </Button>
                    </div>
                  </td>
                </tr>
              )) : (
                <tr>
                  <td colSpan="6" className="text-center py-4">
                    No shop applications found.
                  </td>
                </tr>
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
            <p>
              {reviewDecision === "approved"
                ? "Approval creates an active shop and a verified Shop Admin account."
                : "Rejection keeps the request closed and does not create a shop."}
            </p>
            <Form.Control
              as="textarea"
              rows={3}
              value={responseMessage}
              onChange={(e) => setResponseMessage(e.target.value)}
              placeholder="Write a response for the applicant"
            />
          </div>
        }
        cancelText="Cancel"
        confirmText={reviewDecision === "approved" ? "Approve Shop" : "Reject Shop"}
        busy={reviewing}
        onCancel={closeReview}
        onConfirm={submitReview}
      />
    </UserLayout>
  );
};

export default SuperAdminDashboard;
