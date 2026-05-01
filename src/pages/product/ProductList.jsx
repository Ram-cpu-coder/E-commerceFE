import React, { useEffect, useState } from "react";
import { MdOutlineAddBox } from "react-icons/md";
import { useDispatch, useSelector } from "react-redux";
import { setMenu } from "../../features/user/userSlice";
import { UserLayout } from "../../components/layouts/UserLayout";
import { ProductTable } from "./ProductTable";
import { getAdminProductAction } from "../../features/products/productActions";
import BreadCrumbsAdmin from "../../components/breadCrumbs/BreadCrumbsAdmin";

const ProductList = () => {
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.userInfo);
  const { selectedCategory } = useSelector((state) => state.categoryInfo);
  useEffect(() => {
    dispatch(setMenu("Products"));
  }, [dispatch]);

  useEffect(() => {
    dispatch(getAdminProductAction());
  }, [user._id]);

  return (
    <UserLayout pageTitle={selectedCategory?.categoryName || "Products"}>
      <BreadCrumbsAdmin />
      <ProductTable />
    </UserLayout>
  );
};

export default ProductList;
