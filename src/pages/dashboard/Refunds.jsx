import { Col } from "react-bootstrap";
import { HiMiniArrowTrendingUp } from "react-icons/hi2";
import { IoBagHandleSharp } from "react-icons/io5";
import { MdOutlineKeyboardArrowRight } from "react-icons/md";

const Refunds = () => {
  return (
    <Col xs={12} md={3}>
      <div className="dashboard-stat-card h-100">
        <div className="d-flex flex-row align-items-center">
          <div className="d-flex flex-row align-items-center gap-2 me-auto">
            <IoBagHandleSharp className="dashboard-stat-icon" />
            <div className="d-flex flex-column">
              <strong className="fs-5">Returns</strong>
              <span className="text-muted">85 Refunds</span>
            </div>
          </div>
          <MdOutlineKeyboardArrowRight className="fs-4" />
        </div>
        <p className="fs-2 my-3">-$1,154.00</p>
        <div className="d-flex flex-row align-items-center flex-wrap">
          <p className="me-auto">
            <HiMiniArrowTrendingUp /> <span>-3.1%</span>
          </p>
          <p>
            -24 <span className="text-muted">this week</span>
          </p>
        </div>
      </div>
    </Col>
  );
};

export default Refunds;
