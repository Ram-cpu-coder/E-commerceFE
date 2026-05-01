import React, { useEffect, useRef, useState } from "react";
import { Navbar, Container, Nav, Form } from "react-bootstrap";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
import BottomNavBar from "./BottomNavBar";
import { MdOutlineShoppingCart } from "react-icons/md";

const Header = ({ handleCart, setNavHeight }) => {
  const { user } = useSelector((state) => state.userInfo);
  const { cart } = useSelector((state) => state.cartInfo);

  const [expanded, setExpanded] = useState(false);

  const navRef = useRef(0);

  const handleInternalChange = () => {
    const isMobile = window.innerWidth < 992;
    if (isMobile) {
      setExpanded(false);
    }
    handleCart();
  };

  useEffect(() => {
    const updateHeight = () => {
      setNavHeight(navRef.current.offsetHeight);
    };
    updateHeight();
    window.addEventListener("resize", updateHeight);
    return () => window.removeEventListener("resize", updateHeight);
  }, []);

  return (
    <Navbar
      expand="lg"
      expanded={expanded}
      onToggle={() => setExpanded((prev) => !prev)}
      className="bg-body-tertiary w-100 sticky-top"
      ref={navRef}
    >
      <Container>
        {/* Left-aligned links (Shop, About) - Hidden on mobile */}
        <Navbar.Collapse id="navbar-left" className="order-1 order-lg-0">
          <Nav>
            <a href="/shop" className="px-3 nav-link">
              SHOP
            </a>
            <a href="/about" className="px-3 nav-link">
              ABOUT
            </a>
            <a href="/user/wishlist" className="px-3 nav-link">
              WISHLIST
            </a>
          </Nav>
        </Navbar.Collapse>

        {/* Brand (Centered) */}
        <Navbar.Brand
          onClick={() => (window.location.href = "/")}
          className=" fs-1 fw-bold order-0"
          style={{ cursor: "pointer" }}
        >
          <picture>
            <source srcSet="/Logo.png" type="image/webp" className="logo" />
            <source srcSet="/Logo.png" type="image/jpeg" className="logo" />
            <img src="/Logo.png" alt="Logo" className="logo" />
          </picture>
        </Navbar.Brand>

        <div id="navbar-search-mobile" className="d-block d-md-none">
          <Nav className="ms-auto">
            {/*  changed to button as we are expecting the div for cart to be rendered above the current page, as we are not navigating to another separate page acc to the figma design */}
            <button
              className="text-center nav-link fs-3 position-relative"
              onClick={handleInternalChange}
            >
              <MdOutlineShoppingCart />
              <span
                className="position-absolute start-100 translate-middle badge rounded-circle bg-danger text-white"
                style={{
                  top: "12px",
                  fontSize: "10px",
                  height: "15px",
                  width: "15px",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                {cart?.length || 0}
              </span>
            </button>
          </Nav>
        </div>

        {/* Toggle button (for mobile) */}
        <Navbar.Toggle
          aria-controls="navbar-left navbar-right"
          className="order-0 ms-auto d-none d-md-block d-lg-none"
        />

        {/* Right-aligned links (Wishlist, Search, Cart) - Hidden on mobile */}
        <Navbar.Collapse id="navbar-right" className="order-3 order-lg-0">
          <Nav className="ms-auto">
            {user && user.role === "admin" ? (
              <a href="/admin/adminDashboard" className="px-3 nav-link">
                DASHBOARD
              </a>
            ) : (
              <a href="/user/account" className="px-3 nav-link">
                ACCOUNT
              </a>
            )}
            <button
              className="px-3 text-start nav-link"
              onClick={handleInternalChange}
            >
              CART
            </button>

            {user._id ? (
              <Link to="/user/logout" className="px-3 nav-link">
                LOG OUT
              </Link>
            ) : (
              <Link to="/login" className="px-3 nav-link">
                LOG IN
              </Link>
            )}
          </Nav>
        </Navbar.Collapse>

        <BottomNavBar handleCart={handleCart} user={user} />
      </Container>
    </Navbar>
  );
};

export default Header;
