import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setMenu } from "../../features/user/userSlice";
import { UserLayout } from "../../components/layouts/UserLayout";
import AdminOrdersCard from "../../components/cards/AdminOrdersCard";
import PaginationRounded from "../../components/pagination/PaginationRounded";
import {
  getAdminOrderAction,
  getOrderAction,
} from "../../features/orders/orderActions";
import BreadCrumbsAdmin from "../../components/breadCrumbs/BreadCrumbsAdmin";

const AdminOrders = () => {
  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(setMenu("Orders"), []);
  });
  const { orders, orderAdminPage } = useSelector((state) => state.orderInfo);
  const { user } = useSelector((state) => state.userInfo);

  useEffect(() => {
    const fetchOrders = async () => {
      await dispatch(getAdminOrderAction());
    };
    fetchOrders();
  }, [dispatch, orderAdminPage]);
  return (
    <UserLayout pageTitle="Orders">
      <BreadCrumbsAdmin />
      <AdminOrdersCard orders={orders} user={user} />
      {orders.length > 10 && (
        <div className="mt-2 d-flex justify-content-center w-100">
          <PaginationRounded
            totalPages={orders.totalPages}
            page={orderAdminPage}
            mode="order"
            client="admin"
          />
        </div>
      )}
    </UserLayout>
  );
};

export default AdminOrders;
