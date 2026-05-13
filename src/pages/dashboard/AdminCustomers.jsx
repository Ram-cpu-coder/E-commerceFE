import React, { useCallback, useEffect, useMemo, useState } from "react";
import { Button, Form, Modal, Table } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import { useSearchParams } from "react-router-dom";
import { UserLayout } from "../../components/layouts/UserLayout";
import BreadCrumbsAdmin from "../../components/breadCrumbs/BreadCrumbsAdmin";
import AppDialog from "../../components/dialogs/AppDialog";
import { setMenu } from "../../features/user/userSlice";
import {
  deleteUserAction,
  getAdminUsersPresentWeekTimeFrameAction,
  getAllUsersAction,
  updateUserByAdminAction,
} from "../../features/user/userAction";
import {
  IoCreateOutline,
  IoMailOutline,
  IoPeopleOutline,
  IoPersonCircleOutline,
  IoSearchOutline,
  IoTrashOutline,
} from "react-icons/io5";

const emptyEditForm = {
  fName: "",
  lName: "",
  phone: "",
  verified: false,
};

const getCurrentWeekRange = () => {
  const now = new Date();
  const startWeek = new Date(now);
  startWeek.setDate(now.getDate() - now.getDay());
  startWeek.setHours(0, 0, 0, 0);

  const endWeek = new Date(startWeek);
  endWeek.setDate(startWeek.getDate() + 7);
  endWeek.setHours(0, 0, 0, 0);

  return [startWeek, endWeek];
};

const formatDate = (value) => {
  const date = new Date(value);
  return Number.isNaN(date.getTime())
    ? "Date unavailable"
    : date.toLocaleDateString();
};

const fullName = (user) =>
  [user?.fName, user?.lName].filter(Boolean).join(" ") || "Unnamed customer";

const AdminCustomers = () => {
  const dispatch = useDispatch();
  const [searchParams, setSearchParams] = useSearchParams();
  const [search, setSearch] = useState("");
  const [selectedCustomer, setSelectedCustomer] = useState(null);
  const [editForm, setEditForm] = useState(emptyEditForm);
  const [saving, setSaving] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [deleting, setDeleting] = useState(false);
  const range = searchParams.get("range") || "all";
  const { allUsers, timeFramePresentWeekUsers } = useSelector(
    (state) => state.userInfo,
  );

  const refreshCustomers = useCallback(() => {
    dispatch(getAllUsersAction());
    const [startWeek, endWeek] = getCurrentWeekRange();
    dispatch(getAdminUsersPresentWeekTimeFrameAction(startWeek, endWeek));
  }, [dispatch]);

  useEffect(() => {
    dispatch(setMenu("Global Customers"));
    refreshCustomers();
  }, [dispatch, refreshCustomers]);

  const sourceUsers =
    range === "this-week" ? timeFramePresentWeekUsers : allUsers;

  const customers = useMemo(() => {
    const query = search.trim().toLowerCase();
    return (sourceUsers || [])
      .filter((user) => user.role === "customer")
      .filter((user) => {
        if (!query) return true;
        return `${fullName(user)} ${user.email} ${user.phone}`
          .toLowerCase()
          .includes(query);
      });
  }, [search, sourceUsers]);

  const openEdit = (customer) => {
    setSelectedCustomer(customer);
    setEditForm({
      fName: customer.fName || "",
      lName: customer.lName || "",
      phone: customer.phone || "",
      verified: Boolean(customer.verified),
    });
  };

  const closeEdit = () => {
    setSelectedCustomer(null);
    setEditForm(emptyEditForm);
  };

  const handleEditSubmit = async (e) => {
    e.preventDefault();
    if (!selectedCustomer?._id) return;
    setSaving(true);
    const updated = await dispatch(
      updateUserByAdminAction(selectedCustomer._id, editForm),
    );
    setSaving(false);
    if (updated) {
      refreshCustomers();
      closeEdit();
    }
  };

  const confirmDelete = async () => {
    if (!deleteTarget?._id) return;
    setDeleting(true);
    const deleted = await dispatch(deleteUserAction(deleteTarget._id));
    setDeleting(false);
    if (deleted) {
      refreshCustomers();
      setDeleteTarget(null);
    }
  };

  return (
    <UserLayout pageTitle="Customers">
      <BreadCrumbsAdmin />
      <section className="admin-customers-page">
        <div className="admin-customers-hero">
          <div>
            <p className="section-kicker">
              {range === "this-week" ? "This week" : "Customer directory"}
            </p>
            <h2>{range === "this-week" ? "New Customers" : "All Customers"}</h2>
            <p>
              {range === "this-week"
                ? "Customers who created an account during the current week."
                : "Search, update, verify, and manage customer accounts."}
            </p>
          </div>
          <div className="admin-customers-count">
            <IoPeopleOutline aria-hidden />
            <strong>{customers.length}</strong>
            <span>{range === "this-week" ? "new signups" : "customers"}</span>
          </div>
        </div>

        <div className="admin-customers-toolbar">
          <div className="admin-customers-search">
            <IoSearchOutline aria-hidden />
            <Form.Control
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search customers by name, email, or phone..."
            />
          </div>
          <Form.Select
            value={range}
            onChange={(e) => setSearchParams({ range: e.target.value })}
          >
            <option value="all">All customers</option>
            <option value="this-week">New this week</option>
          </Form.Select>
        </div>

        <div className="admin-customers-table-wrap">
          <Table responsive className="admin-customers-table mb-0">
            <thead>
              <tr>
                <th>Customer</th>
                <th>Email</th>
                <th>Phone</th>
                <th>Status</th>
                <th>Joined</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {customers.length ? (
                customers.map((customer) => (
                  <tr key={customer._id}>
                    <td>
                      <div className="admin-customer-person">
                        <span>
                          {customer.image ? (
                            <img
                              src={customer.image}
                              alt={customer.fName || "Customer"}
                            />
                          ) : (
                            <IoPersonCircleOutline aria-hidden />
                          )}
                        </span>
                        <strong>{fullName(customer)}</strong>
                      </div>
                    </td>
                    <td>
                      <IoMailOutline aria-hidden />{" "}
                      {customer.email || "Email unavailable"}
                    </td>
                    <td>{customer.phone || "Phone unavailable"}</td>
                    <td>
                      <span
                        className={`admin-stock-pill ${
                          customer.verified ? "success" : "warning"
                        }`}
                      >
                        {customer.verified ? "Verified" : "Unverified"}
                      </span>
                    </td>
                    <td>{formatDate(customer.createdAt)}</td>
                    <td>
                      <div className="admin-row-actions">
                        <Button
                          type="button"
                          className="admin-icon-button"
                          onClick={() => openEdit(customer)}
                          title="Edit customer"
                          aria-label={`Edit ${fullName(customer)}`}
                        >
                          <IoCreateOutline aria-hidden />
                        </Button>
                        <Button
                          type="button"
                          className="admin-icon-button danger"
                          onClick={() => setDeleteTarget(customer)}
                          title="Delete customer"
                          aria-label={`Delete ${fullName(customer)}`}
                        >
                          <IoTrashOutline aria-hidden />
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="6" className="text-center py-4">
                    No customers found.
                  </td>
                </tr>
              )}
            </tbody>
          </Table>
        </div>
      </section>

      <Modal
        show={Boolean(selectedCustomer)}
        onHide={closeEdit}
        centered
        contentClassName="admin-management-modal"
      >
        <Form onSubmit={handleEditSubmit}>
          <Modal.Header closeButton>
            <Modal.Title>Edit Customer</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <div className="admin-management-form-grid">
              <Form.Group>
                <Form.Label>First name</Form.Label>
                <Form.Control
                  value={editForm.fName}
                  onChange={(e) =>
                    setEditForm({ ...editForm, fName: e.target.value })
                  }
                  placeholder="Enter first name"
                  required
                />
              </Form.Group>
              <Form.Group>
                <Form.Label>Last name</Form.Label>
                <Form.Control
                  value={editForm.lName}
                  onChange={(e) =>
                    setEditForm({ ...editForm, lName: e.target.value })
                  }
                  placeholder="Enter last name"
                  required
                />
              </Form.Group>
              <Form.Group>
                <Form.Label>Phone</Form.Label>
                <Form.Control
                  value={editForm.phone}
                  onChange={(e) =>
                    setEditForm({ ...editForm, phone: e.target.value })
                  }
                  placeholder="Enter phone number"
                  required
                />
              </Form.Group>
              <Form.Group>
                <Form.Label>Email</Form.Label>
                <Form.Control
                  value={selectedCustomer?.email || ""}
                  placeholder="Email cannot be changed"
                  disabled
                />
              </Form.Group>
              <Form.Check
                className="admin-management-check"
                type="switch"
                id="customer-verified"
                label="Mark customer as verified"
                checked={editForm.verified}
                onChange={(e) =>
                  setEditForm({ ...editForm, verified: e.target.checked })
                }
              />
            </div>
          </Modal.Body>
          <Modal.Footer>
            <Button
              type="button"
              variant="outline-secondary"
              onClick={closeEdit}
              disabled={saving}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={saving}>
              {saving ? "Saving..." : "Save Customer"}
            </Button>
          </Modal.Footer>
        </Form>
      </Modal>

      <AppDialog
        show={Boolean(deleteTarget)}
        variant="danger"
        title="Delete Customer"
        message={`Delete ${fullName(deleteTarget)}? This removes the customer account and cannot be undone.`}
        cancelText="Keep Customer"
        confirmText="Delete Customer"
        busy={deleting}
        onCancel={() => setDeleteTarget(null)}
        onConfirm={confirmDelete}
      />
    </UserLayout>
  );
};

export default AdminCustomers;
