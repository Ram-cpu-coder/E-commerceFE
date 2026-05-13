import React, { useEffect, useMemo, useState } from "react";
import { Button, Table } from "react-bootstrap";
import { useDispatch } from "react-redux";
import { UserLayout } from "../../components/layouts/UserLayout";
import BreadCrumbsAdmin from "../../components/breadCrumbs/BreadCrumbsAdmin";
import { setMenu } from "../../features/user/userSlice";
import { getShopOverviewApi, getShopsApi } from "../../features/shop/shopApi";
import {
  IoAnalyticsOutline,
  IoBagCheckOutline,
  IoCubeOutline,
  IoPersonCircleOutline,
  IoSettingsOutline,
  IoStorefrontOutline,
} from "react-icons/io5";

const tabs = [
  "Analytics",
  "Shop Admins",
  "Products",
  "Orders",
  "Inventory",
  "Settings",
  "Related Data",
];

const money = (value) =>
  Number(value || 0).toLocaleString(undefined, {
    style: "currency",
    currency: "AUD",
  });

const nameOf = (user) =>
  [user?.fName, user?.lName].filter(Boolean).join(" ") || "Unnamed user";

const SuperAdminShops = () => {
  const dispatch = useDispatch();
  const [shops, setShops] = useState([]);
  const [selectedShopId, setSelectedShopId] = useState("");
  const [overview, setOverview] = useState(null);
  const [activeTab, setActiveTab] = useState("Analytics");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    dispatch(setMenu("Shops"));
    const loadShops = async () => {
      const { status, shops: shopList } = await getShopsApi();
      if (status === "success") {
        setShops(shopList || []);
        setSelectedShopId((current) => current || shopList?.[0]?._id || "");
      }
    };
    loadShops();
  }, [dispatch]);

  useEffect(() => {
    if (!selectedShopId) return;
    const loadOverview = async () => {
      setLoading(true);
      const { status, ...payload } = await getShopOverviewApi(selectedShopId);
      setOverview(status === "success" ? payload : null);
      setLoading(false);
    };
    loadOverview();
  }, [selectedShopId]);

  const selectedShop = overview?.shop || shops.find((shop) => shop._id === selectedShopId);
  const stats = useMemo(
    () => [
      {
        label: "Revenue",
        value: money(overview?.analytics?.totalRevenue),
        icon: <IoAnalyticsOutline />,
      },
      {
        label: "Orders",
        value: overview?.analytics?.totalOrders || 0,
        icon: <IoBagCheckOutline />,
      },
      {
        label: "Products",
        value: overview?.inventory?.totalProducts || 0,
        icon: <IoCubeOutline />,
      },
      {
        label: "Admins",
        value: overview?.admins?.length || 0,
        icon: <IoPersonCircleOutline />,
      },
    ],
    [overview],
  );

  const renderUsers = (rows = []) => (
    <Table responsive className="admin-customers-table mb-0">
      <thead>
        <tr>
          <th>User</th>
          <th>Email</th>
          <th>Phone</th>
          <th>Role</th>
        </tr>
      </thead>
      <tbody>
        {rows.length ? (
          rows.map((user) => (
            <tr key={user._id}>
              <td>
                <div className="admin-customer-person">
                  <span>
                    {user.image ? <img src={user.image} alt={nameOf(user)} /> : <IoPersonCircleOutline />}
                  </span>
                  <strong>{nameOf(user)}</strong>
                </div>
              </td>
              <td>{user.email || "Email unavailable"}</td>
              <td>{user.phone || "Phone unavailable"}</td>
              <td>{user.role === "admin" ? "Shop Admin" : "Customer"}</td>
            </tr>
          ))
        ) : (
          <tr>
            <td colSpan="4" className="text-center py-4">No users found.</td>
          </tr>
        )}
      </tbody>
    </Table>
  );

  const renderProducts = (rows = []) => (
    <Table responsive className="admin-customers-table mb-0">
      <thead>
        <tr>
          <th>Product</th>
          <th>Price</th>
          <th>Stock</th>
          <th>Status</th>
        </tr>
      </thead>
      <tbody>
        {rows.length ? rows.map((product) => (
          <tr key={product._id}>
            <td>{product.name}</td>
            <td>{money(product.price)}</td>
            <td>{product.stock || 0}</td>
            <td>{product.status}</td>
          </tr>
        )) : (
          <tr><td colSpan="4" className="text-center py-4">No products found.</td></tr>
        )}
      </tbody>
    </Table>
  );

  const renderOrders = (rows = []) => (
    <Table responsive className="admin-customers-table mb-0">
      <thead>
        <tr>
          <th>Order</th>
          <th>Total</th>
          <th>Status</th>
          <th>Date</th>
        </tr>
      </thead>
      <tbody>
        {rows.length ? rows.map((order) => (
          <tr key={order._id}>
            <td>{order._id}</td>
            <td>{money(order.totalAmount)}</td>
            <td>{order.status}</td>
            <td>{order.createdAt ? new Date(order.createdAt).toLocaleDateString() : "Date unavailable"}</td>
          </tr>
        )) : (
          <tr><td colSpan="4" className="text-center py-4">No orders found.</td></tr>
        )}
      </tbody>
    </Table>
  );

  const renderTab = () => {
    if (!overview) return <div className="shop-detail-empty">Select a shop to view its data.</div>;
    if (activeTab === "Shop Admins") return renderUsers(overview.admins || []);
    if (activeTab === "Products") return renderProducts(overview.products || []);
    if (activeTab === "Orders") return renderOrders(overview.orders || []);
    if (activeTab === "Inventory") {
      return (
        <div className="shop-insight-grid">
          {Object.entries(overview.inventory || {}).map(([key, value]) => (
            <div key={key} className="shop-insight-card">
              <span>{key.replace(/([A-Z])/g, " $1")}</span>
              <strong>{value}</strong>
            </div>
          ))}
        </div>
      );
    }
    if (activeTab === "Settings") {
      return (
        <div className="shop-settings-grid">
          {Object.entries(overview.settings || {}).map(([key, value]) => (
            <div key={key}>
              <span>{key.replace(/([A-Z])/g, " $1")}</span>
              <strong>{value || "Not set"}</strong>
            </div>
          ))}
        </div>
      );
    }
    if (activeTab === "Related Data") {
      return (
        <div className="shop-related-grid">
          <div>{renderProducts(overview.related?.recentProducts || [])}</div>
          <div>{renderOrders(overview.related?.recentOrders || [])}</div>
        </div>
      );
    }
    return (
      <div className="shop-insight-grid">
        <div className="shop-insight-card"><span>Total revenue</span><strong>{money(overview.analytics.totalRevenue)}</strong></div>
        <div className="shop-insight-card"><span>Average order value</span><strong>{money(overview.analytics.averageOrderValue)}</strong></div>
        <div className="shop-insight-card"><span>Pending orders</span><strong>{overview.analytics.pendingOrders}</strong></div>
        <div className="shop-insight-card"><span>Delivered orders</span><strong>{overview.analytics.deliveredOrders}</strong></div>
        <div className="shop-insight-card"><span>Cancelled orders</span><strong>{overview.analytics.cancelledOrders}</strong></div>
      </div>
    );
  };

  return (
    <UserLayout pageTitle="Shops">
      <BreadCrumbsAdmin />
      <section className="superadmin-shops-page">
        <div className="admin-customers-hero">
          <div>
            <p className="section-kicker">Super Admin</p>
            <h2>Shops Command Center</h2>
            <p>Select a shop and inspect its admins, products, orders, inventory, settings, analytics, and related data.</p>
          </div>
          <div className="admin-customers-count">
            <IoStorefrontOutline aria-hidden />
            <strong>{shops.length}</strong>
            <span>shops</span>
          </div>
        </div>

        <div className="superadmin-shop-workspace">
          <aside className="shop-selector-panel">
            {shops.length ? shops.map((shop) => (
              <button
                type="button"
                key={shop._id}
                className={shop._id === selectedShopId ? "active" : ""}
                onClick={() => setSelectedShopId(shop._id)}
              >
                <IoStorefrontOutline aria-hidden />
                <span>
                  <strong>{shop.name}</strong>
                  <small>{shop.adminName || "Unassigned Shop Admin"}</small>
                </span>
              </button>
            )) : (
              <div className="shop-detail-empty">No shops created yet.</div>
            )}
          </aside>

          <div className="shop-detail-panel">
            <div className="shop-detail-header">
              <div>
                <p className="section-kicker">{selectedShop?.status || "Shop"}</p>
                <h2>{selectedShop?.name || "Select a shop"}</h2>
                <p>{selectedShop?.description || "Everything related to this shop appears here."}</p>
              </div>
              {loading && <span className="admin-stock-pill warning">Loading</span>}
            </div>

            <div className="shop-stat-grid">
              {stats.map((stat) => (
                <div key={stat.label} className="shop-stat-card">
                  {stat.icon}
                  <span>{stat.label}</span>
                  <strong>{stat.value}</strong>
                </div>
              ))}
            </div>

            <div className="shop-tabs">
              {tabs.map((tab) => (
                <Button
                  key={tab}
                  type="button"
                  className={activeTab === tab ? "active" : ""}
                  onClick={() => setActiveTab(tab)}
                >
                  {tab}
                </Button>
              ))}
            </div>

            <div className="admin-customers-table-wrap shop-tab-panel">
              {renderTab()}
            </div>
          </div>
        </div>
      </section>
    </UserLayout>
  );
};

export default SuperAdminShops;
