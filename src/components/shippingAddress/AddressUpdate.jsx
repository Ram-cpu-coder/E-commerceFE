import React from "react";
import { Form } from "react-bootstrap";
import ShippingAddressForm from "./ShippingAddressForm";
import useForm from "../../hooks/useForm";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import { updateOrderAction } from "../../features/orders/orderActions";

const AddressUpdate = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { id } = useParams();
  const { handleOnChange, form } = useForm({});

  const { user } = useSelector((state) => state.userInfo);

  console.log(id, "id");
  const handleShipAddUpdate = () => {
    const fullAddress = `Unit ${form.unit}/${form.street}, ${form.city}, ${form.state}, ${form.postalCode}, ${form.country}`;
    console.log(fullAddress, "Address");
    const update = dispatch(
      updateOrderAction({ _id: id, shippingAddress: fullAddress })
    );
    if (update) {
      user.role === "admin"
        ? navigate("/admin/orders")
        : navigate("/user/orders");
    }
  };
  return (
    <div className="d-flex flex-column align-items-center w-100 my-5">
      <h1>Update Shipping Address</h1>
      <Form
        onSubmit={(e) => {
          e.preventDefault();
          handleShipAddUpdate();
        }}
        className="col-10 col-md-6 col-lg-4"
      >
        <ShippingAddressForm handleOnChange={handleOnChange} form={form} />
      </Form>
    </div>
  );
};

export default AddressUpdate;
