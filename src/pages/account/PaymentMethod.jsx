import React, { useEffect } from "react";
import { useDispatch } from "react-redux";
import { setMenu } from "../../features/user/userSlice";
import { UserLayout } from "../../components/layouts/UserLayout";
import { Container } from "react-bootstrap";

const PaymentMethod = () => {
  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(setMenu("Payment Method"), []);
  });
  return (
    <UserLayout pageTitle="Payment Method">
      <Container
        className="d-flex flex-column align-items-center"
        style={{ minHeight: "85vh" }}
      >
        Payment Method
      </Container>
    </UserLayout>
  );
};

export default PaymentMethod;
