import { Col, Form, Row } from "react-bootstrap";
import { IoSearchOutline } from "react-icons/io5";

const statusOptions = [
  ["all", "All statuses"],
  ["pending", "Pending"],
  ["confirmed", "Confirmed"],
  ["shipped", "Shipped"],
  ["inTransit", "In Transit"],
  ["outForDelivery", "Out for Delivery"],
  ["delivered", "Delivered"],
  ["cancelled", "Cancelled"],
  ["canceled", "Canceled"],
];

const ControlBar = ({ handleOnChange, form }) => {
  return (
    <Form className="orders-control-panel">
      <Row className="g-3 align-items-center">
        {/* searching feature */}
        <Col lg={6}>
          <div className="orders-search-field">
            <IoSearchOutline aria-hidden />
            <Form.Control
              name="searchQuery"
              type="text"
              placeholder="Search orders, status, address..."
              onChange={handleOnChange}
            />
          </div>
        </Col>
        {/* status and the date sorting orders */}
        <Col className="d-flex justify-content-lg-end gap-2 flex-wrap">
          {/* sorting acc to status */}
          <Form.Group>
            <Form.Select
              name="status"
              value={form.status}
              onChange={handleOnChange}
            >
              {statusOptions.map(([value, label]) => (
                <option value={value} key={value}>
                  {label}
                </option>
              ))}
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
