import React from "react";
import {
  FaHome,
  FaHeart,
  FaShoppingCart,
  FaSignInAlt,
} from "react-icons/fa";
import { MdStorefront } from "react-icons/md";
import { RiAccountCircleFill } from "react-icons/ri";
import { Link } from "react-router-dom";

const BottomNavBar = ({ handleCart, user }) => {
  const isAdminUser = user?.role === "admin" || user?.role === "superadmin";

  return (
    <nav
      className="bottom-nav-app fixed-bottom d-flex justify-content-between d-md-none border-top"
      style={{ height: "70px" }}
      aria-label="Mobile navigation"
    >
      <div className="d-flex justify-content-around align-items-center left gap-0">
        <Link to="/" className="text-center nav-link py-2">
          <FaHome size={20} aria-hidden />
          <div>Home</div>
        </Link>
        <Link to="/shop/register" className="text-center nav-link py-2">
          <MdStorefront size={22} aria-hidden />
          <div>Sell</div>
        </Link>
      </div>

      <div className="fab-container">
        <button
          type="button"
          className="fab-btn"
          onClick={handleCart}
          aria-label="Open shopping cart"
        >
          <FaShoppingCart size={24} aria-hidden />
        </button>
      </div>

      <div className="d-flex justify-content-around align-items-center right">
        <Link to="/user/wishlist" className="text-center nav-link py-2">
          <FaHeart size={20} aria-hidden />
          <div>Wishlist</div>
        </Link>

        {user?._id ? (
          <Link
            to={isAdminUser ? "/admin/adminDashboard" : "/user/account"}
            className="text-center nav-link py-2"
          >
            <RiAccountCircleFill size={20} aria-hidden />
            <div>{isAdminUser ? "Admin" : "Account"}</div>
          </Link>
        ) : (
          <Link to="/login" className="text-center nav-link py-2">
            <FaSignInAlt size={20} aria-hidden />
            <div>Login</div>
          </Link>
        )}
      </div>
    </nav>
  );
};

export default BottomNavBar;
