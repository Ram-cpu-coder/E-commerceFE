import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setMenu } from "../../features/user/userSlice";
import { UserLayout } from "../../components/layouts/UserLayout";
import AdminOrdersCard from "../../components/cards/AdminOrdersCard";
import { getOrderAction } from "../../features/orders/orderActions";
import PaginationRounded from "../../components/pagination/PaginationRounded";

const Order = () => {
  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(setMenu("My Orders"));
  }, [dispatch]);

  const { orders, customerOrderPage } = useSelector((state) => state.orderInfo);
  const { user } = useSelector((state) => state.userInfo);

  useEffect(() => {
    const fetchOrders = async () => {
      await dispatch(getOrderAction());
    };
    fetchOrders();
  }, [dispatch, customerOrderPage]);
  return (
    <UserLayout pageTitle="My Orders">
      <div className="orders-page-shell">
        <div className="orders-page-hero">
          <div>
            <p className="section-kicker">Purchases & tracking</p>
            <h2>Order history</h2>
            <p>
              Track deliveries, review shipping details, download invoices, and
              manage orders that are still being prepared.
            </p>
          </div>
          <div className="orders-page-count">
            <strong>{orders?.totalDocs || orders?.docs?.length || 0}</strong>
            <span>Total orders</span>
          </div>
        </div>
        <AdminOrdersCard orders={orders} user={user} />
      </div>
      <div className="mt-3 d-flex justify-content-center w-100">
        <PaginationRounded
          totalPages={orders?.totalPages}
          page={customerOrderPage}
          mode="order"
          client="customer"
        />
      </div>
    </UserLayout>
  );
};

export default Order;
