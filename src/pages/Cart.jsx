import { useSelector } from "react-redux";
import CartCard from "../components/cards/CartCard";
import { RxCross1 } from "react-icons/rx";
import { Link, useNavigate } from "react-router-dom";
import { HiOutlineShoppingBag } from "react-icons/hi2";

const Cart = ({ handleCart }) => {
  const { cart } = useSelector((state) => state.cartInfo);
  const navigate = useNavigate();

  const subtotal = cart.reduce(
    (sum, item) =>
      sum +
      Number(
        item.totalAmount ?? Number(item.price || 0) * Number(item.quantity || 0),
      ),
    0,
  );
  const itemCount = cart.reduce(
    (sum, item) => sum + Number(item.quantity || 0),
    0,
  );
  const isDrawer = typeof handleCart === "function";

  const finaliseOrder = () => {
    if (isDrawer) {
      handleCart();
    }
    navigate("/user/shippingAddress");
  };

  return (
    <div className={`cart-surface ${isDrawer ? "cart-surface-drawer" : "cart-surface-page"}`}>
      <div
        className="cart-header-bar d-flex align-items-center justify-content-between w-100 px-3 py-3"
        style={{ top: 0, zIndex: 10 }}
      >
        <div className="d-flex align-items-center gap-2">
          <span className="cart-title-icon">
            <HiOutlineShoppingBag aria-hidden />
          </span>
          <div>
            <h2 className="mb-0 fw-bold fs-5">My cart</h2>
            <p className="mb-0 small text-muted">
              {itemCount} {itemCount === 1 ? "item" : "items"} ready for checkout
            </p>
          </div>
        </div>
        <button
          type="button"
          className="border-0 bg-transparent p-2 rounded-2 text-secondary"
          onClick={isDrawer ? handleCart : () => navigate("/user/account")}
          aria-label="Close cart"
        >
          <RxCross1 className="fs-4" aria-hidden />
        </button>
      </div>

      <div className="cart-content">
        {cart.length !== 0 ? (
          <>
            <div className="cart-items-list">
              {cart.map((item) => (
                <CartCard item={item} key={item._id ?? item.productId} />
              ))}
            </div>
            <aside className="cart-summary-panel">
              <div className="d-flex justify-content-between align-items-center mb-2">
                <span className="text-muted">Subtotal</span>
                <strong className="price-tag">${subtotal.toFixed(2)}</strong>
              </div>
              <div className="d-flex justify-content-between align-items-center mb-3">
                <span className="text-muted">Delivery</span>
                <span className="fw-semibold">Calculated next</span>
              </div>
              <p className="small text-muted mb-3">
                Taxes, delivery, and payment details are finalized after you
                confirm your shipping address.
              </p>
              <button
                type="button"
                className="btn btn-luxe rounded-pill w-100 py-3 fw-bold"
                onClick={finaliseOrder}
              >
                Checkout
              </button>
              <Link to="/shop" className="btn btn-link text-decoration-none w-100 mt-2">
                Continue shopping
              </Link>
            </aside>
          </>
        ) : (
          <div className="empty-cart-hint">
            <p className="fw-bold text-dark mb-2">Your cart is empty</p>
            <p className="small mb-0">
              Browse the shop and tap &quot;Add to Cart&quot; on items you like.
            </p>
            <Link to="/shop" className="btn btn-luxe rounded-pill px-4 mt-4">
              Start shopping
            </Link>
          </div>
        )}
      </div>
    </div>
  );
};

export default Cart;
