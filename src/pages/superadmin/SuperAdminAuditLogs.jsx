import React, { useEffect, useMemo, useState } from "react";
import { Form, Table } from "react-bootstrap";
import { useDispatch } from "react-redux";
import BreadCrumbsAdmin from "../../components/breadCrumbs/BreadCrumbsAdmin";
import { UserLayout } from "../../components/layouts/UserLayout";
import { getAuditLogsApi } from "../../features/platform/platformApi";
import { setMenu } from "../../features/user/userSlice";
import { IoDocumentTextOutline } from "react-icons/io5";

const dateText = (value) => {
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? "Date unavailable" : date.toLocaleString();
};

const SuperAdminAuditLogs = () => {
  const dispatch = useDispatch();
  const [logs, setLogs] = useState([]);
  const [query, setQuery] = useState("");

  useEffect(() => {
    dispatch(setMenu("Audit Logs"));
    const loadLogs = async () => {
      const result = await getAuditLogsApi();
      setLogs(result.status === "success" ? result.logs || [] : []);
    };
    loadLogs();
  }, [dispatch]);

  const filteredLogs = useMemo(() => {
    const search = query.trim().toLowerCase();
    if (!search) return logs;
    return logs.filter((log) =>
      `${log.actorName} ${log.actorEmail} ${log.action} ${log.entityType} ${log.description}`.toLowerCase().includes(search)
    );
  }, [logs, query]);

  return (
    <UserLayout pageTitle="Audit Logs">
      <BreadCrumbsAdmin />
      <section className="platform-dashboard-page">
        <div className="platform-hero compact">
          <div>
            <p className="section-kicker">Governance</p>
            <h1>Audit Logs</h1>
            <p>Track Super Admin decisions and marketplace moderation actions so platform operations stay accountable.</p>
          </div>
          <div className="admin-customers-count">
            <IoDocumentTextOutline aria-hidden />
            <strong>{filteredLogs.length}</strong>
            <span>events</span>
          </div>
        </div>

        <div className="admin-customers-toolbar">
          <div className="admin-customers-search">
            <Form.Control value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Search actor, action, entity, or description..." />
          </div>
        </div>

        <div className="platform-panel">
          <Table responsive className="admin-customers-table mb-0">
            <thead>
              <tr>
                <th>Time</th>
                <th>Actor</th>
                <th>Action</th>
                <th>Entity</th>
                <th>Description</th>
              </tr>
            </thead>
            <tbody>
              {filteredLogs.length ? filteredLogs.map((log) => (
                <tr key={log._id}>
                  <td>{dateText(log.createdAt)}</td>
                  <td><strong>{log.actorName || "System"}</strong><div className="text-muted small">{log.actorEmail || "No email"}</div></td>
                  <td><span className="admin-stock-pill warning">{log.action}</span></td>
                  <td>{log.entityType}<div className="text-muted small">{log.entityId}</div></td>
                  <td>{log.description || "No description"}</td>
                </tr>
              )) : (
                <tr><td colSpan="5" className="text-center py-4">No audit logs found.</td></tr>
              )}
            </tbody>
          </Table>
        </div>
      </section>
    </UserLayout>
  );
};

export default SuperAdminAuditLogs;
