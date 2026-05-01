import React, { useEffect, useState } from "react";
import { Col } from "react-bootstrap";
import {
  HiMiniArrowTrendingDown,
  HiMiniArrowTrendingUp,
} from "react-icons/hi2";
import { IoBagHandleSharp } from "react-icons/io5";
import { MdOutlineKeyboardArrowRight } from "react-icons/md";
import { useDispatch, useSelector } from "react-redux";
import {
  getAdminOrdersPastWeekTimeFrameAction,
  getAdminOrdersPresentWeekTimeFrameAction,
} from "../../features/orders/orderActions.js";
import numeral from "numeral";
import { useNavigate } from "react-router-dom";

const TotalSales = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [comparedData, setComparedData] = useState(null);
  const { timeFramePresentWeekOrders, timeFramePastWeekOrders } = useSelector(
    (state) => state.orderInfo
  );

  // total amount of the sales
  const saleAmountFunction = (data) => {
    if (!Array.isArray(data) || data.length === 0) return 0;

    return data
      .map((item) => item.totalAmount || 0)
      .reduce((acc, curr) => acc + curr, 0);
  };

  // past sale
  const pastSaleAmount = saleAmountFunction(timeFramePastWeekOrders);
  const presentSaleAmount = saleAmountFunction(timeFramePresentWeekOrders);

  // percentage change in the past and present week
  const percentageChange = (presentSaleAmount, pastSaleAmount) => {
    const difference = presentSaleAmount - pastSaleAmount;

    const percentageChange =
      pastSaleAmount === 0
        ? presentSaleAmount === 0
          ? 0
          : 100
        : (difference / pastSaleAmount) * 100;

    return {
      percentageChange: parseFloat(percentageChange.toFixed(2)),
      difference,
      isPositive: difference >= 0,
    };
  };

  // dispatching the api to fetch the orders with in the range of present week
  const handleTwoWeeksOrders = async () => {
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
      dispatch(getAdminOrdersPresentWeekTimeFrameAction(startWeek, endWeek)),
      dispatch(
        getAdminOrdersPastWeekTimeFrameAction(startPastWeek, endPastWeek)
      ),
    ]);
  };

  useEffect(() => {
    handleTwoWeeksOrders();
  }, []);

  useEffect(() => {
    if (pastSaleAmount != null && presentSaleAmount != null) {
      setComparedData(percentageChange(presentSaleAmount, pastSaleAmount));
    }
  }, [pastSaleAmount, presentSaleAmount]);

  return (
    <Col
      xs={12}
      sm={6}
      onClick={() => navigate("/admin/orders")}
      style={{ cursor: "pointer" }}
    >
      <div className="border rounded-4 bg-dark text-white py-3 px-4 h-100">
        <div className="d-flex flex-row align-items-center">
          <div className="d-flex flex-row align-items-center gap-2 me-auto">
            <IoBagHandleSharp className="fs-1 bg-secondary rounded-3 p-2" />
            <div className="d-flex flex-column">
              <strong className="fs-5">Total Sales</strong>
              <span className="text-secondary">
                {timeFramePresentWeekOrders?.length} Order(s)
              </span>
            </div>
          </div>
          <MdOutlineKeyboardArrowRight className="fs-4" />
        </div>
        <p className="fs-2 my-3">
          $
          {saleAmountFunction(timeFramePresentWeekOrders)?.toLocaleString(
            "en-US"
          )}
        </p>
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
            {numeral(comparedData?.difference).format("0.00a")}
            <span className="text-secondary"> this week</span>
          </p>
        </div>
      </div>
    </Col>
  );
};

export default TotalSales;
