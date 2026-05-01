import { Stack } from "react-bootstrap";
import { FaBoxOpen, FaTags, FaCheck } from "react-icons/fa";
import { MdRateReview } from "react-icons/md";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { setSelectedCategory } from "../../features/category/categorySlice";
import { CgProfile } from "react-icons/cg";
import { PiSignOutFill } from "react-icons/pi";
import { HiBookmark } from "react-icons/hi";

const sidebarLinks = [
  {
    icon: <FaBoxOpen />,
    title: "Dashboard",
    to: "/admin/adminDashboard",
    isAdminOnly: true,
  },
  {
    icon: <FaBoxOpen />,
    title: "Products",
    to: "/admin/products",
    isAdminOnly: true,
  },
  {
    icon: <FaTags />,
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
    icon: <FaCheck />,
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
    icon: <FaCheck />,
    title: "My Orders",
    to: "/user/orders?page=1",
    isAdminOnly: false,
  },
  {
    icon: <CgProfile />,
    title: "Login & Security",
    to: "/user/account",
    isUser: true,
  },

  {
    icon: <PiSignOutFill />,
    title: "Logout",
    to: "/user/logout",
    isUser: true,
  },
];

export const UserSidebar = () => {
  const { user, menu } = useSelector((state) => state.userInfo);
  const dispatch = useDispatch();

  const visibleLinks =
    user?.role === "admin"
      ? sidebarLinks.filter((link) => link.isAdminOnly || link.isUser)
      : sidebarLinks.filter((link) => !link.isAdminOnly || link.isUser);

  return (
    <Stack gap={1}>
      {visibleLinks.map(({ title, to, icon }) => (
        <Link
          key={title}
          to={to}
          className={`p-2 nav-link ${
            title === menu ? "bg-white text-dark rounded" : ""
          }`}
          onClick={() => {
            dispatch(setSelectedCategory(null));
          }}
        >
          {icon} {title}
        </Link>
      ))}
    </Stack>
  );
};
