import React, { useEffect, useRef, useState } from "react";
import { Navbar, Container, Nav } from "react-bootstrap";
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
      if (navRef.current) {
        setNavHeight(navRef.current.offsetHeight);
      }
    };
    updateHeight();
    window.addEventListener("resize", updateHeight);
    return () => window.removeEventListener("resize", updateHeight);
  }, [setNavHeight]);

  return (
    <>
      <Navbar
        expand="lg"
        expanded={expanded}
        onToggle={() => setExpanded((prev) => !prev)}
        className="app-navbar bg-body-tertiary w-100 sticky-top"
        ref={navRef}
      >
        <Container>
        <Navbar.Collapse id="navbar-left" className="order-1 order-lg-0">
          <Nav className="align-items-lg-center">
            <Link to="/shop" className="px-3 py-2 nav-link nav-link-app">
              Shop
            </Link>
            <Link to="/about" className="px-3 py-2 nav-link nav-link-app">
              About
            </Link>
            <Link to="/user/wishlist" className="px-3 py-2 nav-link nav-link-app">
              Wishlist
            </Link>
          </Nav>
        </Navbar.Collapse>

        <Navbar.Brand className="fs-4 fw-bold order-0 mx-lg-4 py-0">
          <Link to="/" className="d-inline-block text-decoration-none">
            <picture>
              <source srcSet="/Logo.png" type="image/webp" />
              <img src="/Logo.png" alt="NepaStore home" className="logo" />
            </picture>
          </Link>
        </Navbar.Brand>

        <div id="navbar-search-mobile" className="d-none">
          <Nav className="ms-auto">
            <button
              type="button"
              className="text-center nav-link fs-3 position-relative border-0 bg-transparent"
              onClick={handleInternalChange}
              aria-label={`Open cart, ${cart?.length || 0} items`}
            >
              <MdOutlineShoppingCart aria-hidden />
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

        <Navbar.Toggle
          aria-controls="navbar-left navbar-right"
          className="order-0 ms-auto d-none d-md-block d-lg-none"
        />

        <Navbar.Collapse id="navbar-right" className="order-3 order-lg-0">
          <Nav className="ms-auto align-items-lg-center">
            {user?.role === "admin" ? (
              <Link
                to="/admin/adminDashboard"
                className="px-3 py-2 nav-link nav-link-app"
              >
                Dashboard
              </Link>
            ) : (
              <Link to="/user/account" className="px-3 py-2 nav-link nav-link-app">
                Account
              </Link>
            )}
            <button
              type="button"
              className="px-3 py-2 text-start nav-link nav-link-app border-0 bg-transparent"
              onClick={handleInternalChange}
            >
              Cart
            </button>

            {user?._id ? (
              <Link to="/shop/register" className="px-3 py-2 nav-link nav-link-app">
                Sell
              </Link>
            ) : (
              <Link to="/login" className="px-3 py-2 nav-link nav-link-app">
                Log in
              </Link>
            )}
          </Nav>
        </Navbar.Collapse>

        </Container>
      </Navbar>
      <BottomNavBar handleCart={handleCart} user={user} />
    </>
  );
};

export default Header;
