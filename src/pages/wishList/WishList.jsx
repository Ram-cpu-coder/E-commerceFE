import React, { useEffect } from "react";
import { Button } from "react-bootstrap";
import { BiSolidCartAdd } from "react-icons/bi";
import { MdDelete } from "react-icons/md";
import { useDispatch, useSelector } from "react-redux";
import { createCartAction } from "../../features/cart/cartAction";
import {
  deleteWishlistAction,
  deleteWishlistItemAction,
  getWishlistAction,
} from "../../features/wishlist/wishlistAction";

const WishList = () => {
  const dispatch = useDispatch();

  const handleAddToCart = (_id, id) => {
    const quantity = 1;
    dispatch(createCartAction(_id, quantity));
    dispatch(deleteWishlistItemAction(id));
  };

  const handleOnDelete = (id) => {
    dispatch(deleteWishlistItemAction(id));
  };

  const handleOnDeleteWhole = () => {
    dispatch(deleteWishlistAction());
  };

  const { wishlist } = useSelector((state) => state.wishlistSliceInfo);

  useEffect(() => {
    const fetchWishList = async () => {
      await dispatch(getWishlistAction());
    };
    fetchWishList();
  }, []);

  return (
    <div className="wishlist-page">
      <div className="wishlist-shell">
        <div className="storefront-section-header">
          <div>
            <p className="section-kicker">Saved for later</p>
            <h1 className="display-6 app-section-title mb-2">My Wishlist</h1>
            <p className="section-subcopy">
              Keep your favorite finds close and move them into your cart when
              you are ready.
            </p>
          </div>
          {wishlist?.length > 0 && (
            <Button className="btn-luxe rounded-pill px-4" onClick={handleOnDeleteWhole}>
              Remove All
            </Button>
          )}
        </div>

      {wishlist?.length <= 0 ? (
        <div className="wishlist-empty">
          <strong>No items added yet</strong>
          <span>Products you save will appear here.</span>
        </div>
      ) : (
        <div className="wishlist-grid">
          {wishlist.map((product) => (
            <article className="wishlist-card" key={product._id}>
              <div className="wishlist-card-media">
                <img src={product.image} alt={product.name} />
              </div>
              <div className="wishlist-card-content">
                <div>
                  <p className="section-kicker mb-1">
                    {product?.stockStatus === 0
                      ? "Out of Stock"
                      : product.stockStatus < 10
                      ? "Low in Stock"
                      : "In Stock"}
                  </p>
                  <h2>{product.name}</h2>
                </div>
                <div className="wishlist-card-footer">
                  <span className="price-tag">$ {product.unitPrice}</span>
                  <div className="wishlist-actions">
                    <button
                      onClick={() =>
                        handleAddToCart(product.productId, product._id)
                      }
                      className="wishlist-icon-button"
                      title="Add to Cart"
                      aria-label={`Add ${product.name} to cart`}
                    >
                      <BiSolidCartAdd />
                    </button>
                    <button
                      onClick={() => handleOnDelete(product._id)}
                      className="wishlist-icon-button danger"
                      title="Remove"
                      aria-label={`Remove ${product.name} from wishlist`}
                    >
                      <MdDelete />
                    </button>
                  </div>
                </div>
              </div>
            </article>
          ))}
        </div>
      )}
      </div>
    </div>
  );
};

export default WishList;
