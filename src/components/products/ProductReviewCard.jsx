import React from "react";
import Stars from "../rating/Stars";

const ProductReviewCard = ({ item }) => {
  console.log(item, 99);
  console.log("hello");
  const {
    comment,
    createdAt,
    email,
    productImage,
    productName,
    rating,
    userImage,
    userName,
  } = item;
  return (
    <div className="border rounded shadow p-3 h-100">
      <div className="d-flex justify-content-between flex-wrap">
        <div className="d-flex gap-3 mb-2">
          <img
            src={userImage || "default.png"}
            alt="User avatar"
            style={{ height: "3rem", width: "3rem", borderRadius: "50%" }}
          />
          <div>
            <strong className="fs-5">{userName}</strong>
            <p className="m-0 text-secondary">{email}</p>
            <p className="m-0 text-secondary">{createdAt.split("T")[0]}</p>
          </div>
        </div>
        <div className="text-nowrap">
          <Stars avgRating={rating} />
        </div>
      </div>

      <p className="mt-3 mb-1 fw-semibold">Comment:</p>
      <p className="border rounded p-2 bg-light">{comment}</p>
    </div>
  );
};

export default ProductReviewCard;
