import React, { useEffect, useState } from "react";
import { Col, Form } from "react-bootstrap";
import {
  CartesianGrid,
  Line,
  LineChart,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { getAdminSalesTimeFrameAction } from "../../features/orders/orderActions";
import { useDispatch, useSelector } from "react-redux";

const SalesPerformance = () => {
  const { sales } = useSelector((state) => state.orderInfo);

  const [timeFrame, setTimeFrame] = useState("7d");
  console.log(sales);
  const dispatch = useDispatch();

  const data = sales.sales?.map((item) => item);

  const now = new Date();
  const formatMongoDBDate = (date) => date.toISOString();

  //  in case of  day selection
  const dayInfo = (num) => {
    const startTime = new Date(now);
    const endTime = new Date(startTime);
    startTime.setUTCDate(now.getUTCDate() - num + 1);
    startTime.setUTCHours(0, 0, 0, 0);

    endTime.setUTCDate(now.getUTCDate());
    endTime.setUTCHours(23, 59, 59, 999);

    return [formatMongoDBDate(startTime), formatMongoDBDate(endTime)];
  };

  // in case of month selection
  const monthInfo = (num) => {
    const startTime = new Date(now);
    const endTime = new Date(startTime);
    startTime.setUTCFullYear(now.getUTCFullYear(), now.getUTCMonth() - num, 1);
    startTime.setUTCHours(0, 0, 0, 0);

    // Set endTime to the last day of the month before the current month
    endTime.setUTCFullYear(now.getUTCFullYear(), now.getUTCMonth(), 0);
    endTime.setUTCHours(23, 59, 59, 999);

    return [formatMongoDBDate(startTime), formatMongoDBDate(endTime)];
  };

  // year info
  const yearInfo = (num) => {
    const startTime = new Date(now);
    const endTime = new Date(startTime);
    startTime.setUTCFullYear(now.getUTCFullYear() - num);
    startTime.setUTCHours(0, 0, 0, 0);

    endTime.setUTCHours(23, 59, 59, 999);

    return [formatMongoDBDate(startTime), formatMongoDBDate(endTime)];
  };

  useEffect(() => {
    // calculating the time frame
    switch (timeFrame) {
      case "7d":
        {
          const dateRange = dayInfo(7);
          console.log(dateRange);
          dispatch(
            getAdminSalesTimeFrameAction(dateRange[0], dateRange[1], "day")
          );
        }
        break;
      case "14d":
        {
          const dateRange = dayInfo(14);

          dispatch(
            getAdminSalesTimeFrameAction(dateRange[0], dateRange[1], "day")
          );
        }
        break;
      case "1mnth":
        {
          const dateRange = monthInfo(1);
          dispatch(
            getAdminSalesTimeFrameAction(dateRange[0], dateRange[1], "day")
          );
        }
        break;
      case "3mnths":
        {
          const dateRange = monthInfo(3);
          dispatch(
            getAdminSalesTimeFrameAction(dateRange[0], dateRange[1], "week")
          );
        }
        break;
      case "6mnths":
        {
          const dateRange = monthInfo(6);
          console.log(dateRange);
          dispatch(
            getAdminSalesTimeFrameAction(dateRange[0], dateRange[1], "week")
          );
        }
        break;
      case "1yr":
        {
          const dateRange = yearInfo(1);
          dispatch(
            getAdminSalesTimeFrameAction(dateRange[0], dateRange[1], "month")
          );
        }
        break;

      default:
        break;
    }
  }, [timeFrame]);
  return (
    <Col xs={12} md={7}>
      <div className="border rounded-4 py-3 px-4 h-100 d-flex flex-column gap-4">
        {/* header part  */}
        <div className="d-flex flex-column flex-md-row flex-wrap flex-md-nowrap justify-content-between align-items-start align-items-md-center mb-3">
          <strong className="fs-5 mb-2 mb-md-0">Sales Performance</strong>

          <div
            className="d-flex gap-2 gap-md-3 w-100 w-md-50"
            style={{ width: "50%" }}
          >
            <Form.Select className="w-50 h-100 rounded-4">
              <option>Export Data</option>
              <option value="pdf">Pdf File</option>
              <option value="word">Word File</option>
              <option value="excel">Excel File</option>
            </Form.Select>
            <Form.Select
              className="w-50 h-100 rounded-4"
              name="timeFrame"
              value={timeFrame}
              onChange={(e) => setTimeFrame(e.target.value)}
            >
              <option value="7d">Last 7 Days</option>
              <option value="14d">Last 14 Days</option>
              <option value="1mnth">Last Month</option>
              <option value="3mnths">Last 3 Months</option>
              <option value="6mnths">Last 6 Months</option>
              <option value="1yr">Last 1 year</option>
            </Form.Select>
          </div>
        </div>

        {/* Line chart */}
        <LineChart height={400} width={1000} data={data} className="w-100">
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="_id" />
          <YAxis />
          <Tooltip />
          <CartesianGrid stroke="#ffffff" />
          <Line type="monotone" dataKey="totalSales" stroke="#ff7300" />
          <Line type="monotone" dataKey="totalRevenue" stroke="#387908" />
        </LineChart>
      </div>
    </Col>
  );
};

export default SalesPerformance;
