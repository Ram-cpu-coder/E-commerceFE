import React from "react";
import { Col, Row } from "react-bootstrap";
import Refunds from "./Refunds";
import TotalSales from "./TotalSales";
import NewCustomers from "./NewCustomers";

const TopBar = () => {
  return (
    <Row className="g-3">
      <Col xs={12} md={9}>
        <Row className="g-3">
          {/* Total Sales  */}
          <TotalSales />
          {/* New Customers */}
          <NewCustomers />
        </Row>
      </Col>
      {/* Refunds */}
      <Refunds />
    </Row>
  );
};

export default TopBar;
