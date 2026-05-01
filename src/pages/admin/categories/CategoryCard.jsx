import React from "react";
import { Card, Button } from "react-bootstrap";
import { FaEdit } from "react-icons/fa";
import { Link } from "react-router-dom";
import { setSelectedCategory } from "../../../features/category/categorySlice";
import { useDispatch } from "react-redux";

const CategoryCard = ({ name, productCount, id, image, category }) => {
  const dispatch = useDispatch();
  const handleCategoryClick = (category) => {
    dispatch(setSelectedCategory(category));
  };

  return (
    <Card className="shadow-sm border-0 rounded-4" style={{ width: "18rem" }}>
      {image && (
        <Card.Img
          variant="top"
          src={image}
          alt={name}
          style={{
            height: "160px",
            objectFit: "cover",
            borderTopLeftRadius: "1rem",
            borderTopRightRadius: "1rem",
          }}
        />
      )}
      <Card.Body>
        <div className="d-flex justify-content-between align-items-start mb-2">
          <Card.Title className="mb-0 fs-5">{name}</Card.Title>
          <Link
            to={`/admin/categories/${id}`}
            onClick={() => handleCategoryClick(category)}
          >
            <FaEdit className="text-secondary cursor-pointer" />
          </Link>
        </div>

        <div className="text-muted mb-3">
          {productCount} product{productCount !== 1 ? "s" : ""}
        </div>

        <div className="d-flex gap-2">
          <Link
            to={`/admin/products`}
            onClick={() => handleCategoryClick(category)}
            className="btn btn-outline-primary btn-sm"
          >
            View Products
          </Link>
          <Link
            to={`/admin/products/new`}
            className="btn btn-outline-secondary btn-sm"
            onClick={() => handleCategoryClick(category)}
          >
            + Add Product
          </Link>
        </div>
      </Card.Body>
    </Card>
  );
};

export default CategoryCard;
