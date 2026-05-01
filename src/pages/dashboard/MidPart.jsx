import React from "react";
import { Col, Form, Row } from "react-bootstrap";
import SalesPerformance from "./SalesPerformance";
import TopCategories from "./TopCategories";

const MidPart = () => {
  return (
    <Row className="g-3 mt-3">
      <SalesPerformance />
      <TopCategories />
    </Row>
  );
};

export default MidPart;
