import PlaceOrder from "../../pages/payment/PlaceOrder";
import { useNavigate } from "react-router-dom";
import {
  IoBagCheckOutline,
  IoHomeOutline,
  IoLocationOutline,
  IoReceiptOutline,
  IoShieldCheckmarkOutline,
} from "react-icons/io5";

const OrderConfirmationPage = ({ order }) => {
  const navigate = useNavigate();

  const placedOrder =
    order || JSON.parse(localStorage.getItem("order") || "null");

  if (!placedOrder) {
    return <div className="order-success-loading">Loading your order...</div>;
  }

  const products = placedOrder.products || [];
  const subtotal = products.reduce(
    (total, product) =>
      total + Number(product.price || 0) * Number(product.quantity || 1),
    0
  );
  const orderNumber =
    placedOrder.orderNumber || placedOrder.invoiceNumber || placedOrder._id;

  return (
    <section className="order-success-page">
      <div className="order-success-hero">
        <span className="order-success-mark">
          <IoShieldCheckmarkOutline aria-hidden />
        </span>
        <div>
          <p className="section-kicker">Order placed</p>
          <h1>Thank you for your purchase</h1>
          <p>
            Payment is complete and your order is now confirmed. Review your
            delivery, items, and receipt details below.
          </p>
        </div>
      </div>

      <div className="order-success-grid">
        <section className="order-success-panel order-success-main">
          <div className="order-success-panel-heading">
            <IoBagCheckOutline aria-hidden />
            <div>
              <p className="section-kicker">Purchased items</p>
              <h2>
                {products.length} item{products.length === 1 ? "" : "s"}{" "}
                confirmed
              </h2>
            </div>
          </div>
          <PlaceOrder item={placedOrder} />
        </section>

        <aside className="order-success-panel order-success-summary">
          <div className="order-success-panel-heading">
            <IoReceiptOutline aria-hidden />
            <div>
              <p className="section-kicker">Receipt</p>
              <h2>Order details</h2>
            </div>
          </div>

          <dl className="order-success-meta">
            <div>
              <dt>Order ID</dt>
              <dd>{orderNumber}</dd>
            </div>
            <div>
              <dt>Status</dt>
              <dd>{placedOrder.status || "confirmed"}</dd>
            </div>
            <div>
              <dt>Payment</dt>
              <dd>Paid</dd>
            </div>
          </dl>

          <div className="order-success-address">
            <IoLocationOutline aria-hidden />
            <div>
              <strong>Shipping address</strong>
              <p>{placedOrder.shippingAddress || "Address not available"}</p>
            </div>
          </div>

          <div className="order-success-totals">
            <span>
              <strong>Subtotal</strong>
              <p>$ {subtotal.toFixed(2)}</p>
            </span>
            <span>
              <strong>Shipping</strong>
              <p>$ 0.00</p>
            </span>
            <span>
              <strong>Tax</strong>
              <p>$ 0.00</p>
            </span>
            <span className="order-success-grand">
              <strong>Total</strong>
              <p>$ {Number(placedOrder.totalAmount || subtotal).toFixed(2)}</p>
            </span>
          </div>

          <button
            className="checkout-primary-button"
            onClick={() => {
              navigate("/");
              localStorage.removeItem("order");
            }}
          >
            <IoHomeOutline aria-hidden /> Back to home
          </button>
        </aside>
      </div>
    </section>
  );
};

export default OrderConfirmationPage;
