import React, { useEffect, useState } from "react";
import { Col } from "react-bootstrap";
import {
  HiMiniArrowTrendingDown,
  HiMiniArrowTrendingUp,
} from "react-icons/hi2";
import { IoPeopleSharp } from "react-icons/io5";
import { MdOutlineKeyboardArrowRight } from "react-icons/md";
import {
  getAdminUsersPastWeekTimeFrameAction,
  getAdminUsersPresentWeekTimeFrameAction,
} from "../../features/user/userAction";
import { useDispatch, useSelector } from "react-redux";
import numeral from "numeral";

const NewCustomers = () => {
  const dispatch = useDispatch();
  const [comparedData, setComparedData] = useState(null);

  const { timeFramePastWeekUsers, timeFramePresentWeekUsers } = useSelector(
    (state) => state.userInfo
  );

  // users
  const pastUsersAmount = timeFramePastWeekUsers.length;
  const presentUsersAmount = timeFramePresentWeekUsers.length;

  // dispatching the api to fetch the users with in the range of present week
  const handleTwoWeeksUsers = async () => {
    const now = new Date();

    // present week
    const startWeek = new Date(now);
    startWeek.setDate(now.getDate() - now.getDay());
    startWeek.setHours(0, 0, 0, 0);

    const endWeek = new Date(startWeek);
    endWeek.setDate(startWeek.getDate() + 7);
    endWeek.setHours(0, 0, 0, 0);

    // past week
    const endPastWeek = new Date(startWeek);
    const startPastWeek = new Date(endPastWeek);
    startPastWeek.setDate(endPastWeek.getDate() - 7);

    await Promise.all([
      dispatch(getAdminUsersPresentWeekTimeFrameAction(startWeek, endWeek)),
      dispatch(
        getAdminUsersPastWeekTimeFrameAction(startPastWeek, endPastWeek)
      ),
    ]);
  };

  // percentage change in the past and present week
  const percentageChange = (pastUsersAmount, presentUsersAmount) => {
    const difference = presentUsersAmount - pastUsersAmount;

    const percentageChange =
      pastUsersAmount === 0
        ? presentUsersAmount === 0
          ? 0
          : 100
        : (difference / pastUsersAmount) * 100;

    return {
      percentageChange: parseFloat(percentageChange.toFixed(2)),
      difference,
      isPositive: difference >= 0,
    };
  };

  useEffect(() => {
    handleTwoWeeksUsers();
  }, []);

  useEffect(() => {
    if (pastUsersAmount != null && presentUsersAmount != null) {
      setComparedData(percentageChange(pastUsersAmount, presentUsersAmount));
    }
  }, [pastUsersAmount, presentUsersAmount]);

  return (
    <Col xs={12} sm={6}>
      <div className="border rounded-4 py-3 px-4 h-100">
        <div className="d-flex flex-row align-items-center">
          <div className="d-flex flex-row align-items-center gap-2 me-auto">
            <IoPeopleSharp className="fs-1 bg-secondary rounded-3 p-2" />
            <div className="d-flex flex-column">
              <strong className="fs-5">New Customers</strong>
              <span className="text-muted">
                {timeFramePresentWeekUsers?.length} Signup(s)
              </span>
            </div>
          </div>
          <MdOutlineKeyboardArrowRight className="fs-4" />
        </div>
        <p className="fs-2 my-3">{timeFramePresentWeekUsers?.length}</p>
        <div className="d-flex flex-row align-items-center">
          <p
            className="me-auto"
            style={{
              transition: "transform 0.3s ease, color 0.3s ease",
              color: comparedData?.isPositive ? "#198754" : "#dc3545",
            }}
          >
            {comparedData?.isPositive ? (
              <HiMiniArrowTrendingUp />
            ) : (
              <HiMiniArrowTrendingDown />
            )}{" "}
            <span>
              {comparedData?.isPositive ? "+" : ""}
              {comparedData?.percentageChange}%
            </span>
          </p>
          <p>
            {comparedData?.isPositive ? "+" : ""}
            {numeral(comparedData?.difference).format("0.00a")}{" "}
            <span className="text-muted">this week</span>
          </p>
        </div>
      </div>
    </Col>
  );
};

export default NewCustomers;
