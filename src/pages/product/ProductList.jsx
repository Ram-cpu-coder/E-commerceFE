import React, { useEffect } from "react";
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
  const { products } = useSelector((state) => state.productInfo);
  useEffect(() => {
    dispatch(setMenu("Products"));
  }, [dispatch]);

  useEffect(() => {
    dispatch(getAdminProductAction());
  }, [user._id]);

  return (
    <UserLayout pageTitle={selectedCategory?.categoryName || "Products"}>
      <BreadCrumbsAdmin />
      <section className="admin-products-hero">
        <div>
          <p className="section-kicker">Inventory control</p>
          <h2>{selectedCategory?.categoryName || "Product catalog"}</h2>
          <p>
            Manage catalog visibility, stock levels, pricing, categories, and
            product details from one focused admin workspace.
          </p>
        </div>
        <div className="admin-products-count">
          <strong>{products?.totalDocs || products?.docs?.length || 0}</strong>
          <span>Products</span>
        </div>
      </section>
      <ProductTable />
    </UserLayout>
  );
};

export default ProductList;
