import React, { useCallback, useEffect, useMemo, useState } from "react";
import { Button, Form, Modal, Table } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";
import { UserLayout } from "../../components/layouts/UserLayout";
import BreadCrumbsAdmin from "../../components/breadCrumbs/BreadCrumbsAdmin";
import AppDialog from "../../components/dialogs/AppDialog";
import { setMenu } from "../../features/user/userSlice";
import {
  getAdminAccessRequestsAction,
  getAllUsersAction,
  respondAdminAccessRequestAction,
  updateUserRoleAction,
} from "../../features/user/userAction";
import {
  createShopApi,
  deleteShopApi,
  getShopsApi,
  updateShopApi,
} from "../../features/shop/shopApi";
import {
  IoAddCircleOutline,
  IoCheckmarkCircleOutline,
  IoCreateOutline,
  IoKeyOutline,
  IoPersonCircleOutline,
  IoSearchOutline,
  IoShieldCheckmarkOutline,
  IoStorefrontOutline,
  IoTrashOutline,
} from "react-icons/io5";

const emptyShopForm = {
  name: "",
  description: "",
  status: "active",
  adminId: "",
  contactEmail: "",
  phone: "",
  address: "",
  paymentProvider: "manual",
  payoutAccountName: "",
  payoutAccountEmail: "",
  payoutAccountId: "",
  bankName: "",
  bankAccountLast4: "",
  payoutCurrency: "AUD",
  paymentSetupStatus: "pending",
};

const currencyOptions = [
  ["AUD", "AUD - Australian Dollar"],
  ["USD", "USD - US Dollar"],
  ["EUR", "EUR - Euro"],
  ["GBP", "GBP - British Pound"],
  ["CAD", "CAD - Canadian Dollar"],
  ["NZD", "NZD - New Zealand Dollar"],
  ["JPY", "JPY - Japanese Yen"],
  ["SGD", "SGD - Singapore Dollar"],
  ["INR", "INR - Indian Rupee"],
  ["NPR", "NPR - Nepalese Rupee"],
  ["AED", "AED - UAE Dirham"],
];

const fullName = (user) =>
  [user?.fName, user?.lName].filter(Boolean).join(" ") || "Unnamed user";

const formatDate = (value) => {
  const date = new Date(value);
  return Number.isNaN(date.getTime())
    ? "Date unavailable"
    : date.toLocaleDateString();
};

const money = (value) =>
  Number(value || 0).toLocaleString(undefined, {
    style: "currency",
    currency: "AUD",
  });

const SuperAdminPortal = () => {
  const dispatch = useDispatch();
  const [search, setSearch] = useState("");
  const [shopSearch, setShopSearch] = useState("");
  const [roleFilter, setRoleFilter] = useState("all");
  const [updatingRoleId, setUpdatingRoleId] = useState("");
  const [shops, setShops] = useState([]);
  const [shopForm, setShopForm] = useState(emptyShopForm);
  const [showShopModal, setShowShopModal] = useState(false);
  const [editingShop, setEditingShop] = useState(null);
  const [savingShop, setSavingShop] = useState(false);
  const [deleteShopTarget, setDeleteShopTarget] = useState(null);
  const [deletingShop, setDeletingShop] = useState(false);
  const { adminAccessRequests, allUsers } = useSelector(
    (state) => state.userInfo,
  );

  const loadShops = useCallback(async () => {
    const { status, message, shops: shopList } = await getShopsApi();
    if (status === "success") {
      setShops(shopList || []);
      return true;
    }
    toast[status || "error"](message || "Unable to load shops.");
    return false;
  }, []);

  useEffect(() => {
    dispatch(setMenu("Users & Roles"));
    dispatch(getAdminAccessRequestsAction());
    dispatch(getAllUsersAction());
    loadShops();
  }, [dispatch, loadShops]);

  const adminCandidates = useMemo(
    () =>
      (allUsers || []).filter((user) =>
        ["admin", "customer"].includes(user.role),
      ),
    [allUsers],
  );

  const managedUsers = useMemo(() => {
    const query = search.trim().toLowerCase();
    return adminCandidates
      .filter((user) => roleFilter === "all" || user.role === roleFilter)
      .filter((user) => {
        if (!query) return true;
        return `${fullName(user)} ${user.email} ${user.phone} ${user.role} ${user.shopName}`
          .toLowerCase()
          .includes(query);
      });
  }, [adminCandidates, roleFilter, search]);

  const filteredShops = useMemo(() => {
    const query = shopSearch.trim().toLowerCase();
    return (shops || []).filter((shop) => {
      if (!query) return true;
      return `${shop.name} ${shop.adminName} ${shop.adminEmail} ${shop.status}`
        .toLowerCase()
        .includes(query);
    });
  }, [shopSearch, shops]);

  const openCreateShop = () => {
    setEditingShop(null);
    setShopForm(emptyShopForm);
    setShowShopModal(true);
  };

  const openEditShop = (shop) => {
    setEditingShop(shop);
    setShopForm({
      name: shop.name || "",
      description: shop.description || "",
      status: shop.status || "active",
      adminId: shop.adminId || "",
      contactEmail: shop.contactEmail || "",
      phone: shop.phone || "",
      address: shop.address || "",
      paymentProvider: shop.paymentProvider || "manual",
      payoutAccountName: shop.payoutAccountName || "",
      payoutAccountEmail: shop.payoutAccountEmail || "",
      payoutAccountId: shop.payoutAccountId || "",
      bankName: shop.bankName || "",
      bankAccountLast4: shop.bankAccountLast4 || "",
      payoutCurrency: shop.payoutCurrency || "AUD",
      paymentSetupStatus: shop.paymentSetupStatus || "pending",
    });
    setShowShopModal(true);
  };

  const closeShopModal = () => {
    setShowShopModal(false);
    setEditingShop(null);
    setShopForm(emptyShopForm);
    setSavingShop(false);
  };

  const saveShop = async (e) => {
    e.preventDefault();
    setSavingShop(true);
    const payload = {
      ...shopForm,
      adminId: shopForm.adminId || null,
    };
    const pending = editingShop?._id
      ? updateShopApi(editingShop._id, payload)
      : createShopApi(payload);
    toast.promise(pending, {
      pending: editingShop?._id ? "Updating shop..." : "Creating shop...",
    });
    const { status, message } = await pending;
    toast[status](message);
    setSavingShop(false);
    if (status === "success") {
      await loadShops();
      await dispatch(getAllUsersAction());
      closeShopModal();
    }
  };

  const removeShop = async () => {
    if (!deleteShopTarget?._id) return;
    setDeletingShop(true);
    const pending = deleteShopApi(deleteShopTarget._id);
    toast.promise(pending, { pending: "Deleting shop..." });
    const { status, message } = await pending;
    toast[status](message);
    setDeletingShop(false);
    if (status === "success") {
      setDeleteShopTarget(null);
      await loadShops();
      await dispatch(getAllUsersAction());
    }
  };

  const respond = async (id, decision) => {
    const updated = await dispatch(respondAdminAccessRequestAction(id, decision));
    if (updated) {
      dispatch(getAllUsersAction());
      loadShops();
    }
  };

  const changeRole = async (id, role) => {
    setUpdatingRoleId(id);
    await dispatch(updateUserRoleAction(id, role));
    await loadShops();
    setUpdatingRoleId("");
  };

  return (
    <UserLayout pageTitle="Super Admin">
      <BreadCrumbsAdmin />
      <section className="superadmin-page">
        <div className="admin-customers-hero">
          <div>
            <p className="section-kicker">Super admin</p>
            <h2>Global Shop Operations</h2>
            <p>Create shops, assign Shop Admins, and oversee every ecommerce workspace.</p>
          </div>
          <div className="admin-customers-count">
            <IoStorefrontOutline aria-hidden />
            <strong>{shops.length}</strong>
            <span>shops</span>
          </div>
        </div>

        <div className="superadmin-permissions">
          <div>
            <IoKeyOutline aria-hidden />
            <span>Global shop and operation oversight</span>
          </div>
          <div>
            <IoCheckmarkCircleOutline aria-hidden />
            <span>Approve or reject Shop Admin requests</span>
          </div>
          <div>
            <IoShieldCheckmarkOutline aria-hidden />
            <span>Keep Shop Admins scoped to their own shop</span>
          </div>
        </div>

        <div className="admin-customers-hero superadmin-role-hero">
          <div>
            <p className="section-kicker">Shop CRUD</p>
            <h2>Manage Shops</h2>
            <p>Each shop owns its products, order fulfillments, payout setup, and settings. Customers remain global platform users.</p>
          </div>
          <Button className="admin-product-button" onClick={openCreateShop}>
            <IoAddCircleOutline aria-hidden /> New Shop
          </Button>
        </div>

        <div className="admin-customers-toolbar">
          <div className="admin-customers-search">
            <IoSearchOutline aria-hidden />
            <Form.Control
              value={shopSearch}
              onChange={(e) => setShopSearch(e.target.value)}
              placeholder="Search shops by name, admin, email, or status..."
            />
          </div>
          <Form.Select
            value={shopForm.status}
            onChange={(e) =>
              setShopForm({ ...shopForm, status: e.target.value })
            }
            disabled
          >
            <option>Super Admin sees every shop</option>
          </Form.Select>
        </div>

        <div className="admin-customers-table-wrap mb-3">
          <Table responsive className="admin-customers-table mb-0">
            <thead>
              <tr>
                <th>Shop</th>
                <th>Shop Admin</th>
                <th>Revenue</th>
                <th>Orders</th>
                <th>Status</th>
                <th>Updated</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredShops.length ? (
                filteredShops.map((shop) => (
                  <tr key={shop._id}>
                    <td>
                      <div className="admin-customer-person">
                        <span>
                          <IoStorefrontOutline aria-hidden />
                        </span>
                        <strong>{shop.name}</strong>
                      </div>
                    </td>
                    <td>
                      <strong>{shop.adminName || "Unassigned"}</strong>
                      <div className="text-muted small">{shop.adminEmail || "No admin email"}</div>
                    </td>
                    <td>{money(shop.revenue)}</td>
                    <td>{shop.orders || 0}</td>
                    <td>
                      <span
                        className={`admin-stock-pill ${
                          shop.status === "active" ? "success" : "warning"
                        }`}
                      >
                        {shop.status}
                      </span>
                    </td>
                    <td>{formatDate(shop.updatedAt || shop.createdAt)}</td>
                    <td>
                      <div className="admin-row-actions">
                        <Button
                          type="button"
                          className="admin-icon-button"
                          onClick={() => openEditShop(shop)}
                          title="Edit shop"
                        >
                          <IoCreateOutline aria-hidden />
                        </Button>
                        <Button
                          type="button"
                          className="admin-icon-button danger"
                          onClick={() => setDeleteShopTarget(shop)}
                          title="Delete shop"
                        >
                          <IoTrashOutline aria-hidden />
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="7" className="text-center py-4">
                    No shops found.
                  </td>
                </tr>
              )}
            </tbody>
          </Table>
        </div>

        <div className="admin-customers-table-wrap mb-3">
          <Table responsive className="admin-customers-table mb-0">
            <thead>
              <tr>
                <th>User</th>
                <th>Email</th>
                <th>Message</th>
                <th>Requested</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {adminAccessRequests?.length ? (
                adminAccessRequests.map((request) => (
                  <tr key={request._id}>
                    <td>{fullName(request)}</td>
                    <td>{request.email}</td>
                    <td>{request.adminRequest?.message || "No message provided"}</td>
                    <td>{formatDate(request.adminRequest?.requestedAt)}</td>
                    <td>
                      <div className="superadmin-actions">
                        <Button size="sm" onClick={() => respond(request._id, "approved")}>
                          Approve
                        </Button>
                        <Button
                          size="sm"
                          variant="outline-danger"
                          onClick={() => respond(request._id, "rejected")}
                        >
                          Reject
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="5" className="text-center py-4">
                    No pending Shop Admin access requests.
                  </td>
                </tr>
              )}
            </tbody>
          </Table>
        </div>

        <div className="admin-customers-hero superadmin-role-hero">
          <div>
            <p className="section-kicker">Global role control</p>
            <h2>Shop Admins & Customers</h2>
            <p>Role changes are allowed globally, but Shop Admin data stays shop-scoped.</p>
          </div>
          <div className="admin-customers-count">
            <IoKeyOutline aria-hidden />
            <strong>{managedUsers.length}</strong>
            <span>users</span>
          </div>
        </div>

        <div className="admin-customers-toolbar">
          <div className="admin-customers-search">
            <IoSearchOutline aria-hidden />
            <Form.Control
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search users by name, email, phone, role, or shop..."
            />
          </div>
          <Form.Select
            value={roleFilter}
            onChange={(e) => setRoleFilter(e.target.value)}
          >
            <option value="all">All managed roles</option>
            <option value="admin">Shop Admins only</option>
            <option value="customer">Customers only</option>
          </Form.Select>
        </div>

        <div className="admin-customers-table-wrap">
          <Table responsive className="admin-customers-table mb-0">
            <thead>
              <tr>
                <th>User</th>
                <th>Email</th>
                <th>Phone</th>
                <th>Shop</th>
                <th>Current Role</th>
                <th>Change Role</th>
              </tr>
            </thead>
            <tbody>
              {managedUsers.length ? (
                managedUsers.map((user) => (
                  <tr key={user._id}>
                    <td>
                      <div className="admin-customer-person">
                        <span>
                          {user.image ? (
                            <img src={user.image} alt={user.fName || "User"} />
                          ) : (
                            <IoPersonCircleOutline aria-hidden />
                          )}
                        </span>
                        <strong>{fullName(user)}</strong>
                      </div>
                    </td>
                    <td>{user.email || "Email unavailable"}</td>
                    <td>{user.phone || "Phone unavailable"}</td>
                    <td>{user.role === "admin" ? user.shopName || "No shop assigned" : "Customer account"}</td>
                    <td>
                      <span
                        className={`admin-stock-pill ${
                          user.role === "admin" ? "warning" : "success"
                        }`}
                      >
                        {user.role === "admin" ? "Shop Admin" : "Customer"}
                      </span>
                    </td>
                    <td>
                      <Form.Select
                        className="superadmin-role-select"
                        value={user.role}
                        disabled={updatingRoleId === user._id}
                        onChange={(e) => changeRole(user._id, e.target.value)}
                        aria-label={`Change role for ${fullName(user)}`}
                      >
                        <option value="customer">Customer</option>
                        <option value="admin">Shop Admin</option>
                      </Form.Select>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="6" className="text-center py-4">
                    No admin or customer accounts found.
                  </td>
                </tr>
              )}
            </tbody>
          </Table>
        </div>
      </section>

      <Modal
        show={showShopModal}
        onHide={closeShopModal}
        centered
        contentClassName="admin-management-modal"
      >
        <Form onSubmit={saveShop}>
          <Modal.Header closeButton>
            <Modal.Title>{editingShop?._id ? "Edit Shop" : "Create Shop"}</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <div className="admin-management-form-grid">
              <Form.Group>
                <Form.Label>Shop name</Form.Label>
                <Form.Control
                  value={shopForm.name}
                  onChange={(e) => setShopForm({ ...shopForm, name: e.target.value })}
                  placeholder="Enter shop name"
                  required
                />
              </Form.Group>
              <Form.Group>
                <Form.Label>Shop Admin</Form.Label>
                <Form.Select
                  value={shopForm.adminId}
                  onChange={(e) => setShopForm({ ...shopForm, adminId: e.target.value })}
                >
                  <option value="">Unassigned</option>
                  {adminCandidates.map((user) => (
                    <option key={user._id} value={user._id}>
                      {fullName(user)} - {user.email}
                    </option>
                  ))}
                </Form.Select>
              </Form.Group>
              <Form.Group>
                <Form.Label>Status</Form.Label>
                <Form.Select
                  value={shopForm.status}
                  onChange={(e) => setShopForm({ ...shopForm, status: e.target.value })}
                >
                  <option value="active">Active</option>
                  <option value="inactive">Inactive</option>
                </Form.Select>
              </Form.Group>
              <Form.Group>
                <Form.Label>Contact email</Form.Label>
                <Form.Control
                  type="email"
                  value={shopForm.contactEmail}
                  onChange={(e) =>
                    setShopForm({ ...shopForm, contactEmail: e.target.value })
                  }
                  placeholder="shop@example.com"
                />
              </Form.Group>
              <Form.Group>
                <Form.Label>Phone</Form.Label>
                <Form.Control
                  value={shopForm.phone}
                  onChange={(e) => setShopForm({ ...shopForm, phone: e.target.value })}
                  placeholder="Enter shop phone"
                />
              </Form.Group>
              <Form.Group>
                <Form.Label>Address</Form.Label>
                <Form.Control
                  value={shopForm.address}
                  onChange={(e) => setShopForm({ ...shopForm, address: e.target.value })}
                  placeholder="Enter shop address"
                />
              </Form.Group>
              <Form.Group>
                <Form.Label>Payment provider</Form.Label>
                <Form.Select
                  value={shopForm.paymentProvider}
                  onChange={(e) =>
                    setShopForm({ ...shopForm, paymentProvider: e.target.value })
                  }
                >
                  <option value="manual">Manual payout</option>
                  <option value="stripe-connect">Stripe Connect</option>
                  <option value="bank-transfer">Bank transfer</option>
                </Form.Select>
              </Form.Group>
              <Form.Group>
                <Form.Label>Payment setup</Form.Label>
                <Form.Select
                  value={shopForm.paymentSetupStatus}
                  onChange={(e) =>
                    setShopForm({ ...shopForm, paymentSetupStatus: e.target.value })
                  }
                >
                  <option value="pending">Pending</option>
                  <option value="verified">Verified</option>
                  <option value="rejected">Rejected</option>
                </Form.Select>
              </Form.Group>
              <Form.Group>
                <Form.Label>Payout account name</Form.Label>
                <Form.Control
                  value={shopForm.payoutAccountName}
                  onChange={(e) =>
                    setShopForm({ ...shopForm, payoutAccountName: e.target.value })
                  }
                  placeholder="Registered payout account name"
                />
              </Form.Group>
              <Form.Group>
                <Form.Label>Payout email</Form.Label>
                <Form.Control
                  type="email"
                  value={shopForm.payoutAccountEmail}
                  onChange={(e) =>
                    setShopForm({ ...shopForm, payoutAccountEmail: e.target.value })
                  }
                  placeholder="payout@example.com"
                />
              </Form.Group>
              <Form.Group>
                <Form.Label>Payout account ID</Form.Label>
                <Form.Control
                  value={shopForm.payoutAccountId}
                  onChange={(e) =>
                    setShopForm({ ...shopForm, payoutAccountId: e.target.value })
                  }
                  placeholder="Stripe account ID or payout reference"
                />
              </Form.Group>
              <Form.Group>
                <Form.Label>Bank name</Form.Label>
                <Form.Control
                  value={shopForm.bankName}
                  onChange={(e) => setShopForm({ ...shopForm, bankName: e.target.value })}
                  placeholder="Bank or payout institution"
                />
              </Form.Group>
              <Form.Group>
                <Form.Label>Bank last 4</Form.Label>
                <Form.Control
                  maxLength={4}
                  value={shopForm.bankAccountLast4}
                  onChange={(e) =>
                    setShopForm({ ...shopForm, bankAccountLast4: e.target.value })
                  }
                  placeholder="1234"
                />
              </Form.Group>
              <Form.Group>
                <Form.Label>Payout currency</Form.Label>
                <Form.Select
                  value={shopForm.payoutCurrency}
                  onChange={(e) =>
                    setShopForm({ ...shopForm, payoutCurrency: e.target.value })
                  }
                >
                  {currencyOptions.map(([value, label]) => (
                    <option key={value} value={value}>{label}</option>
                  ))}
                </Form.Select>
              </Form.Group>
              <Form.Group className="full-span">
                <Form.Label>Description</Form.Label>
                <Form.Control
                  as="textarea"
                  rows={3}
                  value={shopForm.description}
                  onChange={(e) =>
                    setShopForm({ ...shopForm, description: e.target.value })
                  }
                  placeholder="Describe this shop workspace"
                />
              </Form.Group>
            </div>
          </Modal.Body>
          <Modal.Footer>
            <Button
              type="button"
              variant="outline-secondary"
              onClick={closeShopModal}
              disabled={savingShop}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={savingShop}>
              {savingShop ? "Saving..." : editingShop?._id ? "Update Shop" : "Create Shop"}
            </Button>
          </Modal.Footer>
        </Form>
      </Modal>

      <AppDialog
        show={Boolean(deleteShopTarget)}
        variant="danger"
        title="Delete Shop"
        message={`Delete ${deleteShopTarget?.name || "this shop"}? The assigned Shop Admin will be returned to customer access.`}
        cancelText="Keep Shop"
        confirmText="Delete Shop"
        busy={deletingShop}
        onCancel={() => setDeleteShopTarget(null)}
        onConfirm={removeShop}
      />
    </UserLayout>
  );
};

export default SuperAdminPortal;
