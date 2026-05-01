import React, { useEffect, useState } from "react";
import { Card } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import { updateProductActionIndividually } from "../../features/products/productActions";
import Stars from "../rating/Stars";
import { createCartAction } from "../../features/cart/cartAction";
import { useNavigate } from "react-router-dom";

const ProductCard = ({ item }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { _id, name, price, images, reviews, category } = item;

  const { user } = useSelector((state) => state.userInfo);
  const { allPubReviews } = useSelector((state) => state.reviewInfo);
  const { Categories } = useSelector((state) => state.categoryInfo);

  const [itemReviews, setItemReviews] = useState([]);
  const [ttlRatings, setTtlRatings] = useState(0);
  const [avgRating, setAvgRating] = useState(1);

  const selectedCategory = Categories.find((cat) => cat._id === category);

  useEffect(() => {
    if (!allPubReviews || !reviews) {
      setItemReviews([]);
      return;
    }
    const selectedReviews = allPubReviews?.filter((rev) =>
      reviews.includes(rev._id)
    );
    setItemReviews(selectedReviews || []);
  }, [_id, reviews, allPubReviews]);

  useEffect(() => {
    const ratings = itemReviews.map((r) => r.rating);
    if (ratings.length === 0) {
      setAvgRating(1);
      setTtlRatings(0);
      return;
    }
    const total = ratings.reduce((sum, val) => sum + val, 0);
    setAvgRating(total / ratings.length);
    setTtlRatings(ratings.length);
  }, [itemReviews]);

  useEffect(() => {
    if (ttlRatings > 0 && user?._id) {
      dispatch(updateProductActionIndividually(_id, { ratings: avgRating }));
    }
  }, [avgRating, ttlRatings, _id, dispatch, user]);

  const handleProductClick = () => navigate(`/${_id}`);

  const handleAddToCart = (e) => {
    e.stopPropagation();
    e.preventDefault();
    user?._id ? dispatch(createCartAction(_id, 1)) : navigate("/login");
  };

  return (
    <Card
      className="border-0 shadow-sm rounded-4 overflow-hidden h-100 position-relative"
      style={{
        transition: "transform 0.3s ease, box-shadow 0.3s ease",
        cursor: "pointer",
      }}
      onClick={handleProductClick}
      onMouseEnter={(e) => {
        e.currentTarget.style.transform = "scale(1.02)";
        e.currentTarget.style.boxShadow = "0 6px 20px rgba(0,0,0,0.15)";
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.transform = "scale(1)";
        e.currentTarget.style.boxShadow = "0 4px 12px rgba(0,0,0,0.1)";
      }}
    >
      <div
        style={{
          height: "60%",
          minHeight: "14rem",
          backgroundColor: "#fdfdfd",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <Card.Img
          variant="top"
          src={images[0]}
          className="productImg"
          loading="lazy"
          onLoad={(e) => {
            e.target.style.opacity = 1;
          }}
          onError={(e) => {
            e.target.src = "/placeholder-image.png";
          }}
        />
      </div>

      <Card.Body className="d-flex flex-column justify-content-between p-4">
        <div>
          <h5 className="fw-semibold mb-2 text-dark">
            {name.length > 50 ? name.slice(0, 47) + "..." : name}
          </h5>
          <div className="d-flex justify-content-between align-items-center mb-2">
            <span className="fw-bold fs-5 text-success">
              ${price.toFixed(2)}
            </span>
            {ttlRatings > 0 ? (
              <Stars avgRating={avgRating} />
            ) : (
              <span className="badge bg-secondary">New</span>
            )}
          </div>
        </div>

        {selectedCategory && (
          <span className="badge bg-light text-dark rounded-pill px-3 py-2 mb-3 text-uppercase fw-medium">
            {selectedCategory.categoryName}
          </span>
        )}

        <button
          className="btn btn-dark w-100 rounded-pill fw-semibold py-2"
          onClick={handleAddToCart}
        >
          Add to Cart
        </button>
      </Card.Body>
    </Card>
  );
};

export default ProductCard;
