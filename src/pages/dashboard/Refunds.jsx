import { Col } from "react-bootstrap";
import { HiMiniArrowTrendingUp } from "react-icons/hi2";
import { IoBagHandleSharp } from "react-icons/io5";
import { MdOutlineKeyboardArrowRight } from "react-icons/md";

const Refunds = () => {
  return (
    <Col xs={12} md={3}>
      <div className="border rounded-4 py-3 px-4 h-100">
        <div className="d-flex flex-row align-items-center">
          <div className="d-flex flex-row align-items-center gap-2 me-auto">
            <IoBagHandleSharp className="fs-1 bg-info rounded-3 p-2" />
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
