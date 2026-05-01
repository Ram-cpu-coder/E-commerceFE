import React, { useEffect } from "react";
import { Col, Form, Row } from "react-bootstrap";

const ControlBarReview = ({ form, handleOnChange }) => {
  return (
    <Form>
      <Row>
        <Col md={6}>
          <Form.Control
            name="searchQuery"
            type="text"
            placeholder="Search Products ..."
            onChange={handleOnChange}
          />
        </Col>
        <Col className="d-flex justify-content-end gap-1 gap-sm-2 mt-sm-0 mt-1">
          <Form.Group>
            <Form.Select
              name="status"
              value={form.status}
              onChange={handleOnChange}
            >
              <option value="all">All</option>
              <option value="true">Active</option>
              <option value="false">Inactive</option>
            </Form.Select>
          </Form.Group>

          <Form.Group>
            <Form.Select
              name="others"
              value={form.others}
              onChange={handleOnChange}
            >
              <option value="newest">Newest</option>
              <option value="toHigh">Rating : Low to High</option>
              <option value="toLow">Rating : High to Low </option>
              <option value="toZ">Name : A to Z </option>
              <option value="toA">Name : Z to A </option>
            </Form.Select>
          </Form.Group>
        </Col>
      </Row>
    </Form>
  );
};

export default ControlBarReview;
