import AppRoutes from "./routes/AppRoutes";
import { getAllCategoriesAction } from "./features/category/CategoryActions.js";
import { Bounce, ToastContainer } from "react-toastify";
import { useDispatch } from "react-redux";
import { fetchCartAction } from "./features/cart/cartAction.js";
import { autoLogin } from "./features/user/userAction.js";
import { getWishlistAction } from "./features/wishlist/wishlistAction.js";
import { useEffect } from "react";
import { useLocation } from "react-router-dom";

const ScrollToTop = () => {
  const { pathname, search } = useLocation();

  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: "auto" });
  }, [pathname, search]);

  return null;
};

const App = () => {
  const dispatch = useDispatch();

  useEffect(() => {
    const fetchInitialData = async () => {
      await Promise.all([
        dispatch(getAllCategoriesAction()),
        dispatch(autoLogin()),
      ]);

      // Only call private endpoints when a user has tokens.
      // This avoids extra 401/refresh calls during anonymous first loads.
      const hasAuthToken =
        sessionStorage.getItem("accessJWT") || localStorage.getItem("refreshJWT");

      if (hasAuthToken) {
        dispatch(fetchCartAction());
        dispatch(getWishlistAction());
      }
    };

    fetchInitialData();
  }, [dispatch]);

  return (
    <>
      <ScrollToTop />
      <AppRoutes />

      <ToastContainer
        position="bottom-right"
        autoClose={3000}
        limit={3}
        hideProgressBar={false}
        newestOnTop
        closeOnClick={false}
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light"
        transition={Bounce}
      />
    </>
  );
};

export default App;
