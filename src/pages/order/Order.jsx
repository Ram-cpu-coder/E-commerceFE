import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setMenu } from "../../features/user/userSlice";
import { UserLayout } from "../../components/layouts/UserLayout";
import AdminOrdersCard from "../../components/cards/AdminOrdersCard";
import { getOrderAction } from "../../features/orders/orderActions";
import PaginationRounded from "../../components/pagination/PaginationRounded";

const Order = () => {
  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(setMenu("My Orders"), []);
  });

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
      <AdminOrdersCard orders={orders} user={user} />
      <div className="mt-2 d-flex justify-content-center w-100">
        <PaginationRounded
          totalPages={orders.totalPages}
          page={customerOrderPage}
          mode="order"
          client="customer"
        />
      </div>
    </UserLayout>
  );
};

export default Order;
