import React from "react";
import {
  FaHome,
  FaHeart,
  FaShoppingCart,
  FaSignInAlt,
  FaStore,
} from "react-icons/fa";
import { MdStorefront } from "react-icons/md";
import { RiAccountCircleFill } from "react-icons/ri";
import { NavLink } from "react-router-dom";

const BottomNavBar = ({ handleCart, user }) => {
  const isAdminUser = user?.role === "admin" || user?.role === "superadmin";

  return (
    <nav
      className="bottom-nav-app fixed-bottom d-md-none"
      aria-label="Mobile navigation"
    >
      <div className="bottom-nav-group">
        <NavLink to="/" className="bottom-nav-link nav-link">
          <FaHome size={20} aria-hidden />
          <span>Home</span>
        </NavLink>
        {user?._id ? (
          <NavLink to="/shop/register" className="bottom-nav-link nav-link">
            <MdStorefront size={22} aria-hidden />
            <span>Sell</span>
          </NavLink>
        ) : (
          <NavLink to="/shop" className="bottom-nav-link nav-link">
            <FaStore size={20} aria-hidden />
            <span>Shop</span>
          </NavLink>
        )}
      </div>

      <div className="fab-container">
        <button
          type="button"
          className="bottom-nav-link bottom-nav-cart"
          onClick={handleCart}
          aria-label="Open shopping cart"
        >
          <span className="bottom-nav-cart-icon">
            <FaShoppingCart size={22} aria-hidden />
          </span>
          <span>Cart</span>
        </button>
      </div>

      <div className="bottom-nav-group">
        <NavLink to="/user/wishlist" className="bottom-nav-link nav-link">
          <FaHeart size={20} aria-hidden />
          <span>Wishlist</span>
        </NavLink>

        {user?._id ? (
          <NavLink
            to={isAdminUser ? "/admin/adminDashboard" : "/user/account"}
            className="bottom-nav-link nav-link"
          >
            {user?.image ? (
              <span className="bottom-nav-avatar">
                <img src={user.image} alt={user?.fName || "Account"} />
              </span>
            ) : (
              <RiAccountCircleFill size={20} aria-hidden />
            )}
            <span>{isAdminUser ? "Admin" : "Account"}</span>
          </NavLink>
        ) : (
          <NavLink to="/login" className="bottom-nav-link nav-link">
            <FaSignInAlt size={20} aria-hidden />
            <span>Login</span>
          </NavLink>
        )}
      </div>
    </nav>
  );
};

export default BottomNavBar;
