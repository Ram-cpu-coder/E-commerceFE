import React, { useEffect, useState } from "react";
import { Container } from "react-bootstrap";
import { useSelector } from "react-redux";
import { UserSidebar } from "./UserSidebar.jsx";
import { AuthRoute } from "../../routes/AuthRoutes.jsx";
import { HiOutlineMenuAlt2 } from "react-icons/hi";

export const UserLayout = ({ pageTitle = "default", children }) => {
  const { user } = useSelector((state) => state.userInfo);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(() => {
    return localStorage.getItem("adminSidebarCollapsed") === "true";
  });

  useEffect(() => {
    localStorage.setItem(
      "adminSidebarCollapsed",
      sidebarCollapsed ? "true" : "false",
    );
  }, [sidebarCollapsed]);

  return (
    <AuthRoute>
      <div
        className={`admin-layout-shell ${
          sidebarCollapsed ? "sidebar-collapsed" : ""
        }`}
      >
        <Container fluid className="px-0">
          <div className="admin-layout-grid">
            <aside className="admin-sidebar admin-sidebar-column heightForSmallScreen">
              <div className="admin-sidebar-top">
                <button
                  type="button"
                  className="sidebar-collapse-button"
                  onClick={() => setSidebarCollapsed((prev) => !prev)}
                  aria-label={
                    sidebarCollapsed ? "Expand sidebar" : "Minimize sidebar"
                  }
                  title={sidebarCollapsed ? "Expand sidebar" : "Minimize sidebar"}
                >
                  <HiOutlineMenuAlt2 aria-hidden />
                </button>
                <div className="admin-sidebar-welcome">
                  <div className="small text-uppercase">Welcome Back</div>
                  <h3 className="mb-0">{user?.fName + " " + user?.lName}</h3>
                </div>
              </div>
              <UserSidebar collapsed={sidebarCollapsed} user={user} />
            </aside>
            <section className="admin-main-panel admin-main-column">
              <div className="admin-page-title">
                <h1 className="mb-0">
                  {pageTitle}
                </h1>
              </div>
              <main className="main position-relative">{children}</main>
            </section>
          </div>
        </Container>
      </div>
    </AuthRoute>
  );
};
