import React, { useEffect } from "react";
import { Button, Table } from "react-bootstrap";
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
    <div
      className="d-flex flex-column align-items-center w-100"
      style={{ minHeight: "64vh" }}
    >
      <h3 className="mt-5">My WishList</h3>
      {wishlist?.length <= 0 ? (
        <div className="d-flex align-items-center" style={{ height: "60vh" }}>
          No items Added yet
        </div>
      ) : (
        <>
          <div
            className="d-flex justify-content-end col-12"
            style={{ maxWidth: "60vw" }}
          >
            <Button variant="danger" onClick={handleOnDeleteWhole}>
              Remove All
            </Button>
          </div>

          <Table
            hover
            responsive
            className="col-sm-10 col-12"
            // style={{ minWidth: "60vw" }}
          >
            <thead className="text-start">
              <tr>
                <th>Image</th>
                <th>Product</th>
                <th>Price</th>
                <th>Stock</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody className="text-start">
              {wishlist.map((product, i) => (
                <tr key={product._id}>
                  <td style={{ maxWidth: "50px" }}>
                    <img
                      src={product.image}
                      alt={product.name}
                      height={50}
                      width={50}
                      className="rounded d-block"
                    />
                  </td>
                  <td style={{ width: "600px" }}>
                    <b>{product.name}</b>
                  </td>
                  <td style={{ width: "100px" }}>$ {product.unitPrice}</td>

                  <td
                    className="text-black text-left"
                    style={{ width: "100px" }}
                  >
                    {product?.stockStatus === 0 ? (
                      <div className="">Out of Stock</div>
                    ) : product.stockStatus < 10 ? (
                      <div className="">Low in Stock</div>
                    ) : (
                      <div className="">In Stock</div>
                    )}
                  </td>
                  <td className="">
                    <button
                      onClick={() =>
                        handleAddToCart(product.productId, product._id)
                      }
                      className="btn me-2 btn-light border"
                      title="Add to Cart"
                    >
                      <BiSolidCartAdd />
                    </button>
                    <button
                      onClick={() => handleOnDelete(product._id)}
                      className="btn border btn-danger"
                      title="Remove"
                    >
                      <MdDelete />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>
        </>
      )}
    </div>
  );
};

export default WishList;
