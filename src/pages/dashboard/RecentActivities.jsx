import React, { useEffect } from "react";
import { Col, Row } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import { getAllRecentActivityAction } from "../../features/recentActivity/recentActivityAction";
import { formatDistanceToNow } from "date-fns";
import { CiUser } from "react-icons/ci";
import { HiMiniShoppingBag } from "react-icons/hi2";
import { MdOutlineLocalOffer } from "react-icons/md";
import { BiCategory } from "react-icons/bi";
import { MdOutlineRateReview } from "react-icons/md";
import { LiaLuggageCartSolid } from "react-icons/lia";

const RecentActivities = () => {
  const dispatch = useDispatch();
  const { recentActivity = [] } = useSelector(
    (state) => state.recentActivityInfo
  );

  const getIcon = (entityType) => {
    switch (entityType) {
      case "order":
        return <HiMiniShoppingBag />;
      case "user":
        return <CiUser />;
      case "banner":
        return <MdOutlineLocalOffer />;
      case "category":
        return <BiCategory />;
      case "review":
        return <MdOutlineRateReview />;
      case "product":
        return <LiaLuggageCartSolid />;
      default:
    }
  };

  useEffect(() => {
    dispatch(getAllRecentActivityAction());
  }, [dispatch]);

  return (
    <Row className="g-3 mt-3">
      <Col>
        <div className="border rounded-4 p-4 bg-white shadow-sm h-100 d-flex flex-column">
          <div className="d-flex justify-content-between align-items-center mb-3">
            <h5 className="mb-0">📋 Recent Activity</h5>
          </div>
          <hr className="mb-3" />
          <div
            className="flex-grow-1 overflow-auto"
            style={{ maxHeight: "400px" }}
          >
            {recentActivity.length > 0 ? (
              <ul className="list-unstyled">
                {recentActivity.map((item) => (
                  <li
                    key={item._id}
                    className="d-flex align-items-center gap-2 mb-3"
                  >
                    <div
                      className="rounded-circle bg-light d-flex align-items-center justify-content-center"
                      style={{
                        width: "40px",
                        height: "40px",
                        minWidth: "40px",
                      }}
                    >
                      {getIcon(item.entityType)}
                    </div>
                    <p className="mb-1 d-flex justify-content-between align-items-center w-100">
                      {item.logMessage}{" "}
                      <small className="text-muted">
                        {formatDistanceToNow(new Date(item.createdAt), {
                          addSuffix: true,
                        })}
                      </small>
                    </p>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-muted">No recent activity to display.</p>
            )}
          </div>
        </div>
      </Col>
    </Row>
  );
};

export default RecentActivities;
