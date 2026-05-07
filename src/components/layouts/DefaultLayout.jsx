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
    if (isCartOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isCartOpen]);

  return (
    <div className="position-relative d-flex flex-column min-vh-100">
      <Header handleCart={handleCart} setNavHeight={setNavHeight} />

      <main className="position-relative flex-grow-1">
        <Outlet />

        {isCartOpen && (
          <>
            <button
              type="button"
              className="cart-drawer-backdrop border-0 p-0"
              aria-label="Close cart overlay"
              onClick={handleCart}
              style={{ top: navHeight, WebkitTapHighlightColor: "transparent" }}
            />
            <div
              ref={cartRef}
              className="cart-drawer-host"
              style={{ top: navHeight }}
            >
              <div
                className={`overflow-y-auto cart-drawer-panel ${
                  isClosing ? "cart-animation-close" : "cart-animation-open"
                }`}
                style={{
                  height: `calc(100vh - ${navHeight}px)`,
                  width: "min(100vw, 480px)",
                }}
              >
                <Cart handleCart={handleCart} />
              </div>
            </div>
          </>
        )}
      </main>

      {!isDashboard && <Footer />}
    </div>
  );
};

export default DefaultLayout;
