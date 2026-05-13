import { Suspense, lazy } from "react";
import { Route, Routes, Navigate, useParams } from "react-router-dom";

import DefaultLayout from "../components/layouts/DefaultLayout";
import HomePage from "../pages/home/HomePage";
import { useSelector } from "react-redux";
import RouteFallback from "../components/RouteFallback.jsx";

const Register = lazy(() => import("../pages/auth/Register"));
const ForgetPassword = lazy(() => import("../pages/auth/ForgetPassword"));
const Login = lazy(() => import("../pages/auth/Login"));
const Dashboard = lazy(() => import("../pages/dashboard/Dashboard.jsx"));
const AdminCustomers = lazy(() => import("../pages/dashboard/AdminCustomers.jsx"));
const SuperAdminDashboard = lazy(() => import("../pages/superadmin/SuperAdminDashboard.jsx"));
const SuperAdminApplications = lazy(() => import("../pages/superadmin/SuperAdminApplications.jsx"));
const SuperAdminGlobalOrders = lazy(() => import("../pages/superadmin/SuperAdminGlobalOrders.jsx"));
const SuperAdminPayments = lazy(() => import("../pages/superadmin/SuperAdminPayments.jsx"));
const SuperAdminProductModeration = lazy(() => import("../pages/superadmin/SuperAdminProductModeration.jsx"));
const SuperAdminPlatformSettings = lazy(() => import("../pages/superadmin/SuperAdminPlatformSettings.jsx"));
const SuperAdminAuditLogs = lazy(() => import("../pages/superadmin/SuperAdminAuditLogs.jsx"));
const SuperAdminPortal = lazy(() => import("../pages/superadmin/SuperAdminPortal.jsx"));
const SuperAdminShops = lazy(() => import("../pages/superadmin/SuperAdminShops.jsx"));
const CategoryLanding = lazy(() => import("../pages/CategoryLanding"));
const Profile = lazy(() => import("../pages/account/Profile"));
const VerifyUser = lazy(() => import("../pages/auth/VerifyUser"));
const ProductLandingPage = lazy(
  () => import("../components/products/ProductLandingPage"),
);
const Cart = lazy(() => import("../pages/Cart"));
const ProductList = lazy(() => import("../pages/product/ProductList.jsx"));
const AddNewProduct = lazy(() => import("../pages/product/AddNewProduct.jsx"));
const EditProduct = lazy(() => import("../pages/product/EditProduct.jsx"));
const Categories = lazy(
  () => import("../pages/admin/categories/Categories.jsx"),
);
const EditCategory = lazy(
  () => import("../pages/admin/categories/EditCategory.jsx"),
);
const AddCategory = lazy(() => import("../pages/admin/categories/AddCategory"));
const PaymentResult = lazy(() => import("../pages/payment/PaymentResult.jsx"));
const Order = lazy(() => import("../pages/order/Order.jsx"));
const PaymentMethod = lazy(() => import("../pages/account/PaymentMethod.jsx"));
const AdminOrders = lazy(() => import("../pages/order/AdminOrders.jsx"));
const ShippingAddress = lazy(() => import("../components/ShippingAddress.jsx"));
const AboutPage = lazy(() => import("../pages/AboutPage.jsx"));
const TermsPage = lazy(() => import("../pages/TermsPage.jsx"));
const SearchPage = lazy(() => import("../pages/SearchPage.jsx"));
const AddressUpdate = lazy(
  () => import("../components/shippingAddress/AddressUpdate.jsx"),
);
const Logout = lazy(() => import("../pages/auth/Logout.jsx"));
const Shop = lazy(() => import("../pages/shop/Shop.jsx"));
const ShopRegister = lazy(() => import("../pages/shop/ShopRegister.jsx"));
const WishList = lazy(() => import("../pages/wishList/WishList.jsx"));
const AdminReview = lazy(() => import("../pages/review/AdminReview.jsx"));
const FeatureBanner = lazy(
  () => import("../pages/FeatureBanner/FeatureBanner.jsx"),
);
const ViewProductsListed = lazy(
  () => import("../pages/FeatureBanner/ViewProductsListed.jsx"),
);
const CarouselLandingPage = lazy(
  () => import("../pages/home/CarouselLandingPage.jsx"),
);
const OrderLandingPage = lazy(
  () => import("../components/ordersComponent/OrderLandingPage.jsx"),
);
const UpdateFeatureBanner = lazy(
  () => import("../pages/FeatureBanner/UpdateFeatureBanner.jsx"),
);

const ProtectedRoutes = ({ isAuth, children }) => {
  return isAuth ? children : <Navigate to="/login" replace />;
};

/** Old app used `/:mongoId` for products; redirect to `/product/:id`. */
const LegacyProductRedirect = () => {
  const { legacyId } = useParams();
  if (/^[a-f0-9]{24}$/i.test(legacyId)) {
    return <Navigate to={`/product/${legacyId}`} replace />;
  }
  return <Navigate to="/" replace />;
};

const AdminRoute = ({ children }) => {
  const { user } = useSelector((state) => state.userInfo);
  const accessJWT = sessionStorage.getItem("accessJWT");

  if (!accessJWT) {
    return <Navigate to="/login" replace />;
  }

  if (!user || !Object.keys(user).length) {
    return <RouteFallback />;
  }

  return ["admin", "superadmin"].includes(user.role)
    ? children
    : <Navigate to="/login" replace />;
};

const SuperAdminRoute = ({ children }) => {
  const { user } = useSelector((state) => state.userInfo);
  const accessJWT = sessionStorage.getItem("accessJWT");

  if (!accessJWT) return <Navigate to="/login" replace />;
  if (!user || !Object.keys(user).length) return <RouteFallback />;

  return user.role === "superadmin" ? children : <Navigate to="/admin/adminDashboard" replace />;
};

const AppRoutes = () => {
  const accessJWT = sessionStorage.getItem("accessJWT");

  const isAuthenticated = !!accessJWT;

  return (
    <Suspense fallback={<RouteFallback />}>
      <Routes>
        <Route path="/" element={<DefaultLayout />}>
          <Route index element={<HomePage />} />
          <Route path="/shop" element={<Shop />} />
          <Route path="/shop/register" element={<ShopRegister />} />
          <Route path="/register" element={<Register />} />
          <Route path="/login" element={<Login />} />
          <Route path="/forgetpassword" element={<ForgetPassword />} />
          <Route path="/category/:categoryName" element={<CategoryLanding />} />
          <Route path="/verify-user" element={<VerifyUser />} />
          <Route path="/product/:id" element={<ProductLandingPage />} />
          <Route path="/payment-result" element={<PaymentResult />} />
          <Route path="/about" element={<AboutPage />} />
          <Route path="/terms" element={<TermsPage />} />
          <Route path="/search" element={<SearchPage />} />
          <Route path="/featured/:id" element={<CarouselLandingPage />} />
          <Route path="/:legacyId" element={<LegacyProductRedirect />} />
        </Route>
        <Route
          path="/user"
          element={
            <ProtectedRoutes isAuth={isAuthenticated}>
              <DefaultLayout />
            </ProtectedRoutes>
          }
        >
          <Route index element={<Dashboard />} />
          <Route path="account" element={<Profile />} />
          <Route path="cart" element={<Cart />} />
          <Route path="orders" element={<Order />} />
          <Route path="payment-method" element={<PaymentMethod />} />
          <Route path="logout" element={<Logout />} />
          <Route path="shippingAddress" element={<ShippingAddress />} />
          <Route path="address/:id" element={<AddressUpdate />} />
          <Route path="wishlist" element={<WishList />} />
          <Route path="orders/:id" element={<OrderLandingPage />} />
        </Route>
        <Route
          path="/admin"
          element={
            <AdminRoute>
              <DefaultLayout />
            </AdminRoute>
          }
        >
          <Route path="adminDashboard" element={<Dashboard />} />
          <Route
            path="superadmin-dashboard"
            element={
              <SuperAdminRoute>
                <SuperAdminDashboard />
              </SuperAdminRoute>
            }
          />
          <Route
            path="shop-applications"
            element={
              <SuperAdminRoute>
                <SuperAdminApplications />
              </SuperAdminRoute>
            }
          />
          <Route
            path="global-orders"
            element={
              <SuperAdminRoute>
                <SuperAdminGlobalOrders />
              </SuperAdminRoute>
            }
          />
          <Route
            path="payments"
            element={
              <SuperAdminRoute>
                <SuperAdminPayments />
              </SuperAdminRoute>
            }
          />
          <Route
            path="product-moderation"
            element={
              <SuperAdminRoute>
                <SuperAdminProductModeration />
              </SuperAdminRoute>
            }
          />
          <Route
            path="platform-settings"
            element={
              <SuperAdminRoute>
                <SuperAdminPlatformSettings />
              </SuperAdminRoute>
            }
          />
          <Route
            path="audit-logs"
            element={
              <SuperAdminRoute>
                <SuperAdminAuditLogs />
              </SuperAdminRoute>
            }
          />
          <Route path="customers" element={<AdminCustomers />} />
          <Route
            path="superadmin"
            element={
              <SuperAdminRoute>
                <SuperAdminPortal />
              </SuperAdminRoute>
            }
          />
          <Route
            path="shops"
            element={
              <SuperAdminRoute>
                <SuperAdminShops />
              </SuperAdminRoute>
            }
          />
          <Route path="products" element={<ProductList />} />
          <Route path="products/new" element={<AddNewProduct />} />
          <Route path="products/edit/:_id" element={<EditProduct />} />
          <Route path="categories" element={<Categories />} />
          <Route path="categories/:_id" element={<EditCategory />} />
          <Route path="categories/new" element={<AddCategory />} />
          <Route path="orders" element={<AdminOrders />} />
          <Route path="banner" element={<FeatureBanner />} />
          <Route path="reviews" element={<AdminReview />} />
          <Route path="banner/:id" element={<UpdateFeatureBanner />} />
          <Route
            path="banner/listed-products/:_id"
            element={<ViewProductsListed />}
          />
        </Route>
      </Routes>
    </Suspense>
  );
};

export default AppRoutes;
