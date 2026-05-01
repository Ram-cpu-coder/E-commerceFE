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
    <div
      className={`justify-content-center bg-light py-5 ${
        isModalView ? "p-3" : ""
      }`}
    >
      <h1 className="display-5 fw-bold text-dark text-center mb-3">
        Categories
      </h1>
      <Col
        className={`fw-bold ${
          isModalView
            ? "d-flex flex-wrap justify-content-center gap-5"
            : "d-flex gap-5 justify-content-sm-start justify-content-md-center"
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
            <div className="text-center category-item pt-3">
              <img
                src={category.categoryImage}
                alt={category.categoryName}
                style={{
                  width: "60px",
                  height: "60px",
                  objectFit: "cover",
                  borderRadius: "50%",
                }}
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
