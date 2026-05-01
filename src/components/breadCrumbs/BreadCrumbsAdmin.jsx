import { Breadcrumb } from "antd";
import { useLocation } from "react-router-dom";

const BreadCrumbsAdmin = () => {
  const breadcrumbMap = {
    "/admin": "Admin",
    "/admin/adminDashboard": "Dashboard",
    "/admin/products": "Products",
    "/admin/products/new": "Add New Product",
    "/admin/products/edit/:_id": "Edit Product",
    "/admin/categories": "Categories",
    "/admin/categories/new": "Add Category",
    "/admin/orders": "Orders",
    "/admin/reviews": "Reviews",
    "/user": "User",
    "/admin/banner": "Banners",
    "/user/account": "Account",
  };

  const location = useLocation();
  const pathNames = location.pathname.split("/").filter((item) => item);

  let itemForBreadCrumbs = [];

  pathNames.map((value, index) => {
    const link = `/${pathNames.slice(0, index + 1).join("/")}`;
    if (link === "/admin") return;
    if (link === "/user") return;
    const name = breadcrumbMap[link] || value;
    itemForBreadCrumbs.push({ title: <a href={link}>{name}</a> });
  });

  return <Breadcrumb items={itemForBreadCrumbs} className="pb-3" />;
};

export default BreadCrumbsAdmin;
