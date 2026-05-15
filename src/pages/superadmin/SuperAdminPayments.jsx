import React, { useEffect, useState } from "react";
import { Table } from "react-bootstrap";
import { useDispatch } from "react-redux";
import BreadCrumbsAdmin from "../../components/breadCrumbs/BreadCrumbsAdmin";
import { UserLayout } from "../../components/layouts/UserLayout";
import { getPlatformOverviewApi } from "../../features/shop/shopApi";
import { setMenu } from "../../features/user/userSlice";
import { IoCardOutline, IoCashOutline, IoStorefrontOutline } from "react-icons/io5";

const money = (value) => Number(value || 0).toLocaleString(undefined, { style: "currency", currency: "AUD" });

const SuperAdminPayments = () => {
  const dispatch = useDispatch();
  const [overview, setOverview] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    dispatch(setMenu("Payments & Payouts"));
    const loadOverview = async () => {
      setLoading(true);
      const result = await getPlatformOverviewApi();
      setOverview(result.status === "success" ? result : null);
      setLoading(false);
    };
    loadOverview();
  }, [dispatch]);

  const metrics = overview?.metrics || {};
  const shops = overview?.shopPerformance || [];
  const pending = overview?.paymentPendingShops || [];

  return (
    <UserLayout pageTitle="Payments & Payouts">
      <BreadCrumbsAdmin />
      <section className="platform-dashboard-page">
        <div className="platform-hero compact">
          <div>
            <p className="section-kicker">Money operations</p>
            <h1>Payments & Payouts</h1>
            <p>Track platform revenue, shop payout readiness, payment setup gaps, and how much each shop should receive from marketplace orders.</p>
          </div>
        </div>

        <div className="platform-metric-grid compact">
          {loading ? [1, 2, 3].map((item) => <span key={item} className="app-skeleton platform-metric-skeleton" />) : (
            <>
              <div className="platform-metric-card green"><span><IoCashOutline /></span><small>Platform sales</small><strong>{money(metrics.totalRevenue)}</strong></div>
              <div className="platform-metric-card gold"><span><IoStorefrontOutline /></span><small>Shops earning</small><strong>{shops.filter((shop) => Number(shop.revenue || 0) > 0).length}</strong></div>
              <div className="platform-metric-card orange"><span><IoCardOutline /></span><small>Payment setup needed</small><strong>{metrics.paymentPendingShops || 0}</strong></div>
            </>
          )}
        </div>

        <div className="platform-grid">
          <div className="platform-panel wide">
            <div className="platform-panel-header">
              <div><p className="section-kicker">Payout ledger</p><h2>Shop revenue split</h2></div>
            </div>
            <Table responsive className="admin-customers-table mb-0">
              <thead><tr><th>Shop</th><th>Orders</th><th>Revenue owed</th><th>Payment status</th></tr></thead>
              <tbody>
                {loading ? (
                  Array.from({ length: 5 }, (_, index) => (
                    <tr key={index}><td colSpan="4"><span className="app-skeleton line wide" /></td></tr>
                  ))
                ) : shops.length ? shops.map((shop) => (
                  <tr key={shop._id}>
                    <td><strong>{shop.name}</strong><div className="text-muted small">{shop.adminEmail || "No admin email"}</div></td>
                    <td>{shop.orders}</td>
                    <td>{money(shop.revenue)}</td>
                    <td><span className={`admin-stock-pill ${shop.paymentSetupStatus === "verified" ? "success" : "warning"}`}>{shop.paymentSetupStatus || "pending"}</span></td>
                  </tr>
                )) : <tr><td colSpan="4" className="text-center py-4">No payout data yet.</td></tr>}
              </tbody>
            </Table>
          </div>

          <div className="platform-panel">
            <div className="platform-panel-header">
              <div><p className="section-kicker">Action required</p><h2>Unverified payout accounts</h2></div>
            </div>
            <div className="platform-attention-list">
              {loading ? (
                <div className="skeleton-stack">
                  {[1, 2, 3].map((item) => <span key={item} className="app-skeleton line wide" />)}
                </div>
              ) : pending.length ? pending.map((shop) => (
                <div key={shop._id}>
                  <strong>{shop.name}</strong>
                  <span>{shop.paymentProvider || "manual"} / {shop.payoutAccountEmail || "No payout email"}</span>
                </div>
              )) : <div className="shop-detail-empty">All shop payouts are verified.</div>}
            </div>
          </div>
        </div>
      </section>
    </UserLayout>
  );
};

export default SuperAdminPayments;
