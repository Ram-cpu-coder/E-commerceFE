import React from "react";
import { Col, Row } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import { setSelectedCategory } from "../../features/category/categorySlice";
import { Link } from "react-router-dom";

const CategoryList = ({ isModalView = false }) => {
  const dispatch = useDispatch();
  const { Categories, selectedCategory } = useSelector(
    (state) => state.categoryInfo
  );
  const handleCategoryClick = (category) => {
    dispatch(setSelectedCategory(category));
  };

  return (
    <div className={isModalView ? "p-3" : "category-showcase"}>
      <div className="storefront-section-header mb-3">
        <div>
          <p className="section-kicker">Shop by mood</p>
          <h1 className="display-6 app-section-title mb-1">Categories</h1>
        </div>
      </div>
      <Col
        className={`fw-bold ${
          isModalView
            ? "d-flex flex-wrap justify-content-center gap-5"
            : "category-rail"
        }`}
        style={
          isModalView
            ? {}
            : {
                whiteSpace: "nowrap",
                overflowX: "auto",
              }
        }
      >
        {Categories.map((category, index) => (
          <Link
            to={`/category/${category.categoryName}`}
            key={index}
            onClick={() => handleCategoryClick(category)}
            className="text-decoration-none text-black g-2"
          >
            <div
              className={`text-center category-item category-chip ${
                selectedCategory?._id === category._id ? "active" : ""
              }`}
            >
              <img
                src={category.categoryImage}
                alt={category.categoryName}
              />
              <p className="mt-1">{category.categoryName}</p>
            </div>
          </Link>
        ))}
      </Col>
    </div>
  );
};

export default CategoryList;
