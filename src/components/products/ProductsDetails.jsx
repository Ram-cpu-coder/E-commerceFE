import React, { useState } from "react";
import { FaRegHeart } from "react-icons/fa";
import { GoHeartFill } from "react-icons/go";
import Stars from "../rating/Stars";
import { Button } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import { createCartAction } from "../../features/cart/cartAction";
import Description from "./Description";
import {
  IoBagAddOutline,
  IoCubeOutline,
  IoShieldCheckmarkOutline,
} from "react-icons/io5";

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
    <div className="col-sm-12 col-lg-8 product-info-panel">
      <h2 className="product-detail-title">{selectedProduct.name}</h2>
      <div className="fs-3 w-100 d-flex flex-column align-items-start w-100 justify-content-center py-3">
        <div className="section-kicker">
          {selectedCategory?.categoryName}
        </div>
        <div className="d-flex justify-content-between w-100">
          <span className="d-flex align-items-start">
            <span className="fs-5">$</span>
            <strong className="price-tag fs-2">{selectedProduct.price}</strong>
          </span>

          {isInWishList ? (
            <button
              className="wishlist-button"
              onClick={() => handleDeleteWishlist(wishListItem._id)}
              aria-label="Remove from wishlist"
            >
              <GoHeartFill className="fs-4" />
            </button>
          ) : (
            <button
              className="wishlist-button"
              onClick={handleFavourite}
              aria-label="Add to wishlist"
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
      <div className="product-assurance-strip">
        <span>
          <IoCubeOutline aria-hidden />
          {selectedProduct.stock ? "In stock" : "Limited availability"}
        </span>
        <span>
          <IoShieldCheckmarkOutline aria-hidden />
          Secure checkout
        </span>
      </div>
      {/* quantity */}
      <div className="d-flex align-items-center gap-3 flex-wrap">
        <p className="my-2 fw-semibold">Quantity</p>
        <div className="quantity-control">
          <button
            className="quantity-button"
            onClick={handleOnSubtract}
            aria-label="Decrease quantity"
          >
            -
          </button>

          <span className="px-2 fw-bold" style={{ minWidth: "20px" }}>
            {quantity}
          </span>

          <button
            className="quantity-button"
            onClick={handleOnAdd}
            aria-label="Increase quantity"
          >
            +
          </button>
        </div>
      </div>
      {/* add cart button */}
      <Button
        className="btn-luxe w-100 rounded-pill my-4 py-3 fw-bold"
        onClick={() => handleOnAddCart(selectedProduct._id, quantity)}
      >
        <IoBagAddOutline className="me-2" aria-hidden />
        Add to cart
      </Button>
      <Description description={selectedProduct.description} />
    </div>
  );
};

export default ProductsDetails;
