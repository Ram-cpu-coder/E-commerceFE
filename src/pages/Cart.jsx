import { useSelector } from "react-redux";
import CartCard from "../components/cards/CartCard";
import { RxCross1 } from "react-icons/rx";
import { useNavigate } from "react-router-dom";

const Cart = ({ handleCart }) => {
  const { cart } = useSelector((state) => state.cartInfo);
  const navigate = useNavigate();

  const finaliseOrder = () => {
    handleCart();
    navigate("/user/shippingAddress");
  };

  return (
    <div className="d-flex flex-column align-items-stretch bg-white position-relative h-100">
      <div
        className="cart-header-bar d-flex align-items-center justify-content-between w-100 px-3 py-3 sticky-top"
        style={{ top: 0, zIndex: 10 }}
      >
        <div className="col-4" aria-hidden />
        <h2 className="col-4 text-center mb-0 fw-semibold fs-6 text-uppercase tracking-wide">
          My cart
        </h2>
        <div className="col-4 text-end">
          <button
            type="button"
            className="border-0 bg-transparent p-2 rounded-2 text-secondary"
            onClick={handleCart}
            aria-label="Close cart"
          >
            <RxCross1 className="fs-4" aria-hidden />
          </button>
        </div>
      </div>

      <div
        className="flex-grow-1 overflow-y-auto px-2 px-sm-3"
        style={{ paddingBottom: "6rem" }}
      >
        {cart.length !== 0 ? (
          <div>
            {cart.map((item) => (
              <CartCard item={item} key={item._id ?? item.productId} />
            ))}
            <div className="d-flex justify-content-center px-3 mt-4 mb-5">
              <button
                type="button"
                className="btn btn-dark rounded-pill px-5 py-2 fw-semibold"
                onClick={finaliseOrder}
              >
                Checkout
              </button>
            </div>
          </div>
        ) : (
          <div className="empty-cart-hint">
            <p className="fw-medium text-dark mb-2">Your cart is empty</p>
            <p className="small mb-0">
              Browse the shop and tap &quot;Add to Cart&quot; on items you like.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Cart;
