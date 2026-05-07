import { Stack } from "react-bootstrap";
import { MdDashboardCustomize, MdRateReview } from "react-icons/md";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { setSelectedCategory } from "../../features/category/categorySlice";
import { PiSignOutFill } from "react-icons/pi";
import { HiBookmark } from "react-icons/hi";
import {
  IoBagCheckOutline,
  IoCartOutline,
  IoPricetagsOutline,
  IoSettingsOutline,
} from "react-icons/io5";
import { LuPackageOpen } from "react-icons/lu";

const sidebarLinks = [
  {
    icon: <MdDashboardCustomize />,
    title: "Dashboard",
    to: "/admin/adminDashboard",
    isAdminOnly: true,
  },
  {
    icon: <LuPackageOpen />,
    title: "Products",
    to: "/admin/products",
    isAdminOnly: true,
  },
  {
    icon: <IoPricetagsOutline />,
    title: "Categories",
    to: "/admin/categories",
    isAdminOnly: true,
  },
  {
    icon: <HiBookmark />,
    title: "Banners",
    to: "/admin/banner",
    isAdminOnly: true,
  },
  {
    icon: <IoBagCheckOutline />,
    title: "Orders",
    to: "/admin/orders?page=1",
    isAdminOnly: true,
  },
  {
    icon: <MdRateReview />,
    title: "Reviews",
    to: "/admin/reviews",
    isAdminOnly: true,
  },
  {
    icon: <IoCartOutline />,
    title: "My Orders",
    to: "/user/orders?page=1",
    isAdminOnly: false,
  },
];

export const UserSidebar = ({ collapsed = false, user: layoutUser }) => {
  const { user: currentUser, menu } = useSelector((state) => state.userInfo);
  const dispatch = useDispatch();
  const user = layoutUser || currentUser;

  const visibleLinks =
    user?.role === "admin"
      ? sidebarLinks.filter((link) => link.isAdminOnly || link.isUser)
      : sidebarLinks.filter((link) => !link.isAdminOnly || link.isUser);

  return (
    <div className="admin-sidebar-content">
      <Stack gap={1} className="admin-sidebar-nav px-2 pb-3">
        {visibleLinks.map(({ title, to, icon }) => (
          <Link
            key={title}
            to={to}
            className={`admin-sidebar-link nav-link ${
              title === menu ? "active" : ""
            }`}
            title={collapsed ? title : undefined}
            onClick={() => {
              dispatch(setSelectedCategory(null));
            }}
          >
            <span className="admin-sidebar-icon">{icon}</span>
            <span className="admin-sidebar-label">{title}</span>
          </Link>
        ))}
      </Stack>

      <div className="admin-sidebar-footer">
        <div className={`admin-profile-card ${menu === "Settings" ? "active" : ""}`}>
          <Link
            to="/user/account"
            className="admin-profile-avatar"
            title="Open profile settings"
            aria-label="Open profile settings"
          >
            {(user?.fName?.[0] || "U").toUpperCase()}
          </Link>
          <Link
            to="/user/account"
            className="admin-profile-copy"
            title={collapsed ? user?.fName || "User" : undefined}
          >
            <strong>{user?.fName || "Profile"}</strong>
            <small>{user?.role === "admin" ? "Admin" : "Customer"}</small>
          </Link>
          <div className="admin-profile-actions">
            <Link
              to="/user/account"
              className="admin-profile-action"
              title="Login & Security"
              aria-label="Login and security settings"
            >
              <IoSettingsOutline aria-hidden />
            </Link>
            <Link
              to="/user/logout"
              className="admin-profile-action"
              title="Log out"
              aria-label="Log out"
            >
              <PiSignOutFill aria-hidden />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};
