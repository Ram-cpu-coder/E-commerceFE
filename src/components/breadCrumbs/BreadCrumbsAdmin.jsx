import { Breadcrumb } from "antd";
import { Link, useLocation } from "react-router-dom";

const staticBreadcrumbMap = {
  "/admin/adminDashboard": "Dashboard",
  "/admin/superadmin-dashboard": "Platform Dashboard",
  "/admin/shop-applications": "Shop Applications",
  "/admin/global-orders": "Global Orders",
  "/admin/payments": "Payments & Payouts",
  "/admin/product-moderation": "Product Moderation",
  "/admin/platform-settings": "Platform Settings",
  "/admin/audit-logs": "Audit Logs",
  "/admin/customers": "Global Customers",
  "/admin/superadmin": "Super Admin",
  "/admin/shops": "Shops",
  "/admin/products": "Products",
  "/admin/products/new": "Add Product",
  "/admin/categories": "Categories",
  "/admin/categories/new": "Add Category",
  "/admin/orders": "Orders",
  "/admin/reviews": "Reviews",
  "/admin/banner": "Banners",
  "/user/account": "Account Settings",
  "/user/orders": "My Orders",
  "/user/cart": "Cart",
  "/user/wishlist": "Wishlist",
  "/user/payment-method": "Payment Method",
  "/user/shippingAddress": "Shipping Address",
};

const dynamicBreadcrumbs = [
  [/^\/admin\/products\/edit\/[^/]+$/, "Edit Product"],
  [/^\/admin\/categories\/[^/]+$/, "Edit Category"],
  [/^\/admin\/banner\/[^/]+$/, "Edit Banner"],
  [/^\/admin\/banner\/listed-products\/[^/]+$/, "Listed Products"],
  [/^\/user\/orders\/[^/]+$/, "Track Order"],
  [/^\/user\/address\/[^/]+$/, "Update Address"],
];

const labelForPath = (path, fallback) => {
  if (staticBreadcrumbMap[path]) return staticBreadcrumbMap[path];
  const dynamicMatch = dynamicBreadcrumbs.find(([pattern]) =>
    pattern.test(path),
  );
  if (dynamicMatch) return dynamicMatch[1];
  return fallback
    .replace(/-/g, " ")
    .replace(/([A-Z])/g, " $1")
    .replace(/^./, (char) => char.toUpperCase());
};

const BreadCrumbsAdmin = () => {
  const location = useLocation();
  const pathNames = location.pathname.split("/").filter(Boolean);

  const items = pathNames
    .map((value, index) => {
      const link = `/${pathNames.slice(0, index + 1).join("/")}`;
      if (link === "/admin" || link === "/user") return null;
      if (["edit", "listed-products", "address"].includes(value)) return null;

      return {
        title: <Link to={link}>{labelForPath(link, value)}</Link>,
      };
    })
    .filter(Boolean);

  return <Breadcrumb items={items} className="pb-3" />;
};

export default BreadCrumbsAdmin;
