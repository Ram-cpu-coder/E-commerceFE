import { Col, Form, Row } from "react-bootstrap";

const ControlBar = ({ handleOnChange, form }) => {
  return (
    <Form>
      <Row>
        {/* searching feature */}
        <Col md={6}>
          <Form.Control
            name="searchQuery"
            type="text"
            placeholder="Search Orders ..."
            onChange={handleOnChange}
          />
        </Col>
        {/* status and the date sorting orders */}
        <Col className="d-flex justify-content-end gap-1 gap-sm-2 mt-3 mt-sm-0">
          {/* sorting acc to status */}
          <Form.Group>
            <Form.Select
              name="status"
              value={form.status}
              onChange={handleOnChange}
            >
              <option value="all">All</option>
              <option value="pending" className="text-warning">
                Pending
              </option>
              <option value="shipped" className="text-primary">
                Shipped
              </option>
              <option value="delivered" className="text-success">
                Delivered
              </option>
            </Form.Select>
          </Form.Group>
          {/* sorting acc to date */}
          <Form.Group>
            <Form.Select
              name="date"
              value={form.date}
              onChange={handleOnChange}
            >
              <option value="newest">Newest</option>
              <option value="oldest">Oldest</option>
            </Form.Select>
          </Form.Group>
        </Col>
      </Row>
    </Form>
  );
};

export default ControlBar;
