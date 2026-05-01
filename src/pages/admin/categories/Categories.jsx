import React, { useEffect, useState } from "react";
import { UserLayout } from "../../../components/layouts/UserLayout";
import { setMenu } from "../../../features/user/userSlice";
import { useDispatch, useSelector } from "react-redux";
import CategoryCard from "./CategoryCard";
import { Link } from "react-router-dom";
import { getAdminProductAction } from "../../../features/products/productActions";
import BreadCrumbsAdmin from "../../../components/breadCrumbs/BreadCrumbsAdmin";

const Categories = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(setMenu("Categories"));
  }, [dispatch]);

  const { Categories } = useSelector((state) => state.categoryInfo);
  const { products } = useSelector((state) => state.productInfo);
  useEffect(() => {
    dispatch(getAdminProductAction());
  }, []);
  // Calculate product count per category
  const getProductCount = (categoryId) => {
    return products?.docs?.filter((p) => p.category === categoryId).length || 0;
  };

  const filteredCategories = Categories?.filter((cat) =>
    cat.categoryName.toLowerCase().includes(searchQuery.toLowerCase())
  );
  return (
    <UserLayout pageTitle="Categories">
      <BreadCrumbsAdmin />
      <div className="d-flex justify-content-between align-items-center gap-2">
        <input
          type="text"
          className="form-control w-50 w-md-75"
          placeholder="Search categories..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />

        <Link to="/admin/categories/new" className="btn btn-primary">
          + Add Category
        </Link>
      </div>

      <div className="d-flex flex-wrap justify-content-start gap-4 mt-4">
        {filteredCategories?.length > 0 ? (
          filteredCategories.map((category) => (
            <CategoryCard
              key={category._id}
              name={category.categoryName}
              id={category._id}
              productCount={getProductCount(category._id)}
              image={category.categoryImage}
              category={category}
            />
          ))
        ) : (
          <p className="text-muted mt-4">No matching categories found.</p>
        )}
      </div>
    </UserLayout>
  );
};

export default Categories;
