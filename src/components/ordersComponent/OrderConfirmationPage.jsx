;import PlaceOrder from "../../pages/payment/PlaceOrder";
import { useNavigate } from "react-router-dom";

const OrderConfirmationPage = () => {
  const navigate = useNavigate();

  const placedOrder = JSON.parse(localStorage.getItem("order"));
  if (!placedOrder) {
    return <div>Loading your order...</div>;
  }
  return (
    <div
      className="text-center d-flex flex-column justify-content-center align-items-center"
      style={{ height: "55vh", margin: "auto" }}
    >
      <h2 className="text-3xl text-green-600">
        🎉 Thank you for your purchase!
      </h2>
      <p className="mt-4 text-gray-600">Your payment was successful.</p>

      {/* placed order detail */}

      <PlaceOrder item={placedOrder} />

      <button
        className="mt-6 px-4 py-2 bg-black text-white rounded col-5 col-sm-2"
        onClick={() => {
          navigate("/");
          localStorage.removeItem("order");
        }}
      >
        Back to Home
      </button>
    </div>
  );
};

export default OrderConfirmationPage;
