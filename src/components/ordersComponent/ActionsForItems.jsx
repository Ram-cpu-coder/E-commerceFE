import React, { useState } from "react";
import { AiOutlineDelete } from "react-icons/ai";
import { deleteOrderItemAction } from "../../features/orders/orderActions";
import { useDispatch } from "react-redux";
import Review from "../../pages/review/Review";

const ActionsForItems = ({
  user,
  item,
  product,
  handleToggleReview,
  isReviewing,
  setIsReviewing,
}) => {
  const dispatch = useDispatch();

  // remove items from the order
  const handleItemsOnOrder = (id, ID) => {
    dispatch(deleteOrderItemAction(id, ID));
  };

  return (
    <div className="d-flex gap-2 align-items-center">
      {user.role === "customer" && (
        <Review
          productId={product._id}
          setIsReviewing={setIsReviewing}
          handleToggleReview={handleToggleReview}
          isReviewing={isReviewing}
        />
      )}
      {user.role === "admin" && (
        <div className="d-flex gap-3">
          <AiOutlineDelete
            className="fs-4 text-danger"
            style={{ cursor: "pointer" }}
            title="Delete"
            onClick={() => handleItemsOnOrder(item._id, product.id)}
          />
        </div>
      )}
    </div>
  );
};

export default ActionsForItems;
