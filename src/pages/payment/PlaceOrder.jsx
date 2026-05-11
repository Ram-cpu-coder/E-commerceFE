import React, { useState } from "react";
import Review from "../review/Review";

const PlaceOrder = ({ item }) => {
  const { products = [] } = item || {};
  const [isReviewing, setIsReviewing] = useState(null);

  const handleToggleReview = (id) => {
    setIsReviewing((prevId) => (prevId === id ? null : id));
  };

  return (
    <div className="placed-order-items">
      {products.map((product) => {
        const image = product.images?.[0] || product.image || "/placeholder-image.png";
        const lineTotal = Number(product.price || 0) * Number(product.quantity || 1);

        return (
          <article className="placed-order-item" key={product._id || product.id}>
            <img
              src={image}
              alt={product.name || "Ordered product"}
              onError={(e) => {
                e.currentTarget.src = "/placeholder-image.png";
              }}
            />
            <div className="placed-order-item-copy">
              <strong>{product.name}</strong>
              <span>Qty {product.quantity || 1}</span>
            </div>
            <div className="placed-order-item-total">
              <strong>$ {lineTotal.toFixed(2)}</strong>
              <Review
                productId={product._id || product.id}
                isReviewing={isReviewing}
                handleToggleReview={handleToggleReview}
              />
            </div>
          </article>
        );
      })}
    </div>
  );
};

export default PlaceOrder;
