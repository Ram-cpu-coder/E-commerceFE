import { Stack } from "react-bootstrap";
import { MdDashboardCustomize, MdRateReview } from "react-icons/md";
import { useDispatch, useSelector } from "react-redux";
import { Link, useLocation } from "react-router-dom";
import { setSelectedCategory } from "../../features/category/categorySlice";
import { PiSignOutFill } from "react-icons/pi";
import {
  IoAnalyticsOutline,
  IoBagCheckOutline,
  IoCartOutline,
  IoCardOutline,
  IoDocumentTextOutline,
  IoImageOutline,
  IoPeopleOutline,
  IoPricetagsOutline,
  IoSettingsOutline,
  IoShieldCheckmarkOutline,
  IoSparklesOutline,
  IoStorefrontOutline,
} from "react-icons/io5";
import { LuPackageOpen } from "react-icons/lu";

const sidebarLinks = [
  {
    icon: <MdDashboardCustomize />,
    title: "Analytics Dashboard",
    to: "/admin/adminDashboard",
    isAdminOnly: true,
  },
  {
    icon: <IoAnalyticsOutline />,
    title: "Platform Dashboard",
    to: "/admin/superadmin-dashboard",
    isSuperAdminOnly: true,
  },
  {
    icon: <IoDocumentTextOutline />,
    title: "Shop Applications",
    to: "/admin/shop-applications",
    isSuperAdminOnly: true,
  },
  {
    icon: <IoPeopleOutline />,
    title: "Users & Roles",
    to: "/admin/superadmin",
    isSuperAdminOnly: true,
  },
  {
    icon: <IoStorefrontOutline />,
    title: "Shops",
    to: "/admin/shops",
    isSuperAdminOnly: true,
  },
  {
    icon: <IoBagCheckOutline />,
    title: "Global Orders",
    to: "/admin/global-orders",
    isSuperAdminOnly: true,
  },
  {
    icon: <IoCardOutline />,
    title: "Payments & Payouts",
    to: "/admin/payments",
    isSuperAdminOnly: true,
  },
  {
    icon: <LuPackageOpen />,
    title: "Product Moderation",
    to: "/admin/product-moderation",
    isSuperAdminOnly: true,
  },
  {
    icon: <MdRateReview />,
    title: "Review Moderation",
    to: "/admin/reviews",
    isSuperAdminOnly: true,
  },
  {
    icon: <IoPricetagsOutline />,
    title: "Categories",
    to: "/admin/categories",
    isSuperAdminOnly: true,
  },
  {
    icon: <IoImageOutline />,
    title: "Homepage Control",
    to: "/admin/banner",
    isSuperAdminOnly: true,
  },
  {
    icon: <IoSettingsOutline />,
    title: "Platform Settings",
    to: "/admin/platform-settings",
    isSuperAdminOnly: true,
  },
  {
    icon: <IoDocumentTextOutline />,
    title: "Audit Logs",
    to: "/admin/audit-logs",
    isSuperAdminOnly: true,
  },
  {
    icon: <LuPackageOpen />,
    title: "Product Catalog",
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
    icon: <IoImageOutline />,
    title: "Banners",
    to: "/admin/banner",
    isAdminOnly: true,
  },
  {
    icon: <IoBagCheckOutline />,
    title: "Order Management",
    to: "/admin/orders?page=1",
    isAdminOnly: true,
  },
  {
    icon: <IoPeopleOutline />,
    title: "Global Customers",
    to: "/admin/customers?range=all",
    isSuperAdminOnly: true,
  },
  {
    icon: <MdRateReview />,
    title: "Review Moderation",
    to: "/admin/reviews",
    isAdminOnly: true,
  },
  {
    icon: <IoBagCheckOutline />,
    title: "My Orders",
    to: "/user/orders?page=1",
    isCustomerOnly: true,
  },
  {
    icon: <IoCartOutline />,
    title: "Cart",
    to: "/user/cart",
    isCustomerOnly: true,
  },
  {
    icon: <IoSparklesOutline />,
    title: "Wishlist",
    to: "/user/wishlist",
    isCustomerOnly: true,
  },
];

export const UserSidebar = ({ collapsed = false, user: layoutUser }) => {
  const { user: currentUser, menu } = useSelector((state) => state.userInfo);
  const dispatch = useDispatch();
  const location = useLocation();
  const user = layoutUser || currentUser;
  const currentPath = location.pathname;

  const visibleLinks =
    user?.role === "superadmin"
      ? sidebarLinks.filter((link) => link.isSuperAdminOnly)
      : user?.role === "admin"
      ? sidebarLinks.filter((link) => link.isAdminOnly)
      : sidebarLinks.filter((link) => link.isCustomerOnly || link.isUser);

  return (
    <div className="admin-sidebar-content">
      <Stack gap={1} className="admin-sidebar-nav px-2 pb-3">
        {visibleLinks.map(({ title, to, icon }) => {
          const linkPath = to.split("?")[0];
          const isActive =
            currentPath === linkPath ||
            title === menu ||
            (menu === "Dashboard" && title === "Analytics Dashboard") ||
            (menu === "Products" && title === "Product Catalog") ||
            (menu === "Platform Dashboard" && title === "Platform Dashboard") ||
            (menu === "Orders" && title === "Order Management") ||
            (menu === "Reviews" && title === "Review Moderation") ||
            (menu === "Shops" && title === "Shops");

          return (
          <Link
            key={title}
            to={to}
            className={`admin-sidebar-link nav-link ${isActive ? "active" : ""}`}
            title={title}
            aria-label={title}
            aria-current={isActive ? "page" : undefined}
            onClick={() => {
              dispatch(setSelectedCategory(null));
            }}
          >
            <span className="admin-sidebar-icon">{icon}</span>
            <span className="admin-sidebar-label">{title}</span>
          </Link>
          );
        })}
      </Stack>

      <div className="admin-sidebar-footer">
        <div className={`admin-profile-card ${menu === "Settings" ? "active" : ""}`}>
          <Link
            to="/user/account"
            className="admin-profile-avatar"
            title="Open profile settings"
            aria-label="Open profile settings"
          >
            {user?.image ? (
              <img src={user.image} alt={user?.fName || "Profile"} />
            ) : (
              (user?.fName?.[0] || "U").toUpperCase()
            )}
          </Link>
          <Link
            to="/user/account"
            className="admin-profile-copy"
            title={collapsed ? user?.fName || "User" : undefined}
          >
            <strong>{user?.fName || "Profile"}</strong>
            <small>
              {user?.role === "superadmin"
                ? "Super Admin"
                : user?.role === "admin"
                ? "Shop Admin"
                : "Customer"}
            </small>
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
