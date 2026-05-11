import React from "react";
import { Form } from "react-bootstrap";
import ShippingAddressForm from "./ShippingAddressForm";
import useForm from "../../hooks/useForm";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import { updateOrderAction } from "../../features/orders/orderActions";
import { IoLocationOutline, IoShieldCheckmarkOutline } from "react-icons/io5";

const AddressUpdate = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { id } = useParams();
  const { handleOnChange, form } = useForm({
    unit: "",
    street: "",
    city: "",
    state: "",
    postalCode: "",
    country: "",
  });

  const { user } = useSelector((state) => state.userInfo);

  const handleShipAddUpdate = async () => {
    const fullAddress = [
      form.unit ? `Unit ${form.unit}` : "",
      form.street,
      form.city,
      form.state,
      form.postalCode,
      form.country,
    ]
      .filter(Boolean)
      .join(", ");

    const update = await dispatch(
      updateOrderAction({ _id: id, shippingAddress: fullAddress })
    );
    if (update) {
      user.role === "admin"
        ? navigate("/admin/orders")
        : navigate("/user/orders");
    }
  };
  return (
    <div className="address-update-page">
      <section className="address-update-hero">
        <span>
          <IoLocationOutline aria-hidden />
        </span>
        <div>
          <p className="section-kicker">Delivery correction</p>
          <h1>Update shipping address</h1>
          <p>
            Replace the delivery address for this order. The order details stay
            the same while the fulfillment team gets the new destination.
          </p>
        </div>
      </section>
      <Form
        onSubmit={(e) => {
          e.preventDefault();
          handleShipAddUpdate();
        }}
        className="checkout-panel checkout-address-form address-update-form"
      >
        <ShippingAddressForm
          handleOnChange={handleOnChange}
          form={form}
          submitLabel="Update address"
        />
      </Form>
      <div className="address-update-note">
        <IoShieldCheckmarkOutline aria-hidden />
        <span>Only the shipping address will be changed for this order.</span>
      </div>
    </div>
  );
};

export default AddressUpdate;
