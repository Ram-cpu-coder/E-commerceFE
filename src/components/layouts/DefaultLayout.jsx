import React, { useEffect, useRef, useState } from "react";
import Header from "./Header";
import Footer from "./Footer";
import { Outlet, useLocation } from "react-router-dom";
import Cart from "../../pages/Cart";
import { useDispatch } from "react-redux";
import { fetchCartAction } from "../../features/cart/cartAction";

const DefaultLayout = () => {
  const dispatch = useDispatch();
  const cartRef = useRef();
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [navHeight, setNavHeight] = useState(0);
  const [isClosing, setIsClosing] = useState(false);

  const location = useLocation();

  const isDashboard = location.pathname.includes("/admin");

  const handleCart = () => {
    if (isCartOpen) {
      setIsClosing(true);
      setTimeout(() => {
        setIsCartOpen(false);
        setIsClosing(false);
      }, 200);
    } else {
      dispatch(fetchCartAction());
      setIsCartOpen(true);
    }
  };

  useEffect(() => {
    if (!isCartOpen) return;
    const handleClickOutsideCart = (event) => {
      if (cartRef && !cartRef.current.contains(event.target)) {
        handleCart();
      }
    };
    document.addEventListener("mousedown", handleClickOutsideCart);
    return () => {
      document.removeEventListener("mousedown", handleClickOutsideCart);
    };
  }, [isCartOpen]);

  return (
    <div className="position-relative">
      <Header handleCart={handleCart} setNavHeight={setNavHeight} />

      <main className="position-relative">
        <Outlet />

        {isCartOpen && (
          <div ref={cartRef}>
            <div
              className={`col-12 col-lg-6 col-md-8 bg-white overflow-y-scroll ${
                isClosing ? "cart-animation-close" : "cart-animation-open"
              }`}
              style={{
                position: "fixed",
                top: navHeight,
                right: 0,
                zIndex: 100,
                height: "100vh",
              }}
            >
              <Cart handleCart={handleCart} />
            </div>
          </div>
        )}
      </main>

      {!isDashboard && <Footer />}
    </div>
  );
};

export default DefaultLayout;
