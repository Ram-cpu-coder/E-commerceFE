import React, { useState } from "react";
import { FaRegHeart } from "react-icons/fa";
import { GoHeartFill } from "react-icons/go";
import Stars from "../rating/Stars";
import { Button } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import { createCartAction } from "../../features/cart/cartAction";
import Description from "./Description";

const ProductsDetails = ({
  handleFavourite,
  handleDeleteWishlist,
  selectedProduct,
  avgRating,
  wishlist,
}) => {
  const dispatch = useDispatch();

  const { Categories } = useSelector((state) => state.categoryInfo);
  const selectedCategory = Categories.find(
    (cat) => cat._id === selectedProduct.category
  );
  const [quantity, setQuantity] = useState(1);

  const handleOnAdd = () => {
    setQuantity((prev) => (prev += 1));
  };

  const handleOnSubtract = () => {
    if (quantity <= 1) {
      setQuantity(1);
    } else {
      setQuantity((prev) => (prev -= 1));
    }
  };

  const handleOnAddCart = (_id, quantity) => {
    dispatch(createCartAction(_id, quantity));
  };

  const wishListItem = wishlist.find(
    (item) => selectedProduct._id === item.productId
  );
  const isInWishList = Boolean(wishListItem);

  return (
    // selectedProduct detail
    <div className="col-sm-12 col-md-8 rounded p-3" style={{ height: "auto" }}>
      <h2 className="fs-5" style={{ width: "90%" }}>
        {selectedProduct.name}
      </h2>
      <div className="fs-3 w-100 d-flex flex-column align-items-start w-100 justify-content-center py-3">
        <div className="text-primary" style={{ fontSize: "15px" }}>
          {selectedCategory.categoryName}
        </div>
        <div className="d-flex justify-content-between w-100">
          <span className="d-flex align-items-start">
            <span className="fs-5">$</span>
            <strong>{selectedProduct.price}</strong>
          </span>

          {isInWishList ? (
            <button
              className="border-1 px-3 py-1 rounded bg-transparent"
              onClick={() => handleDeleteWishlist(wishListItem._id)}
            >
              <GoHeartFill className="fs-4" />
            </button>
          ) : (
            <button
              className="border-1 px-3 py-1 rounded bg-transparent"
              onClick={handleFavourite}
            >
              <FaRegHeart className="fs-4" />
            </button>
          )}
        </div>
      </div>
      {/* latest reviews */}
      <div className="my-2 fs-1 d-flex align-items-center">
        <div className="fs-3">
          <Stars avgRating={avgRating} />
        </div>
      </div>
      {/* quantity */}
      <div className="d-flex align-items-center">
        <p className="px-2 my-2">Quantity:</p>
        <button
          className="border border-black px-2 py-0 fs-5"
          onClick={handleOnSubtract}
        >
          -
        </button>

        <span className="px-3" style={{ width: "10px" }}>
          {quantity}
        </span>

        <button
          className="border border-black px-2 py-0 fs-5"
          onClick={handleOnAdd}
        >
          +
        </button>
      </div>
      {/* add cart button */}
      <Button
        className="bg-black w-100 rounded my-3 py-2"
        onClick={() => handleOnAddCart(selectedProduct._id, quantity)}
      >
        Add to cart
      </Button>
      <Description description={selectedProduct.description} />
    </div>
  );
};

export default ProductsDetails;
