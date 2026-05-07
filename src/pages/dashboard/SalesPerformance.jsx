import React, { useEffect, useState } from "react";
import { Col, Form } from "react-bootstrap";
import {
  CartesianGrid,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { getAdminSalesTimeFrameAction } from "../../features/orders/orderActions";
import { useDispatch, useSelector } from "react-redux";

const SalesPerformance = () => {
  const { sales } = useSelector((state) => state.orderInfo);

  const [timeFrame, setTimeFrame] = useState("7d");
  const dispatch = useDispatch();

  const data = sales.sales?.map((item) => item);

  useEffect(() => {
    const now = new Date();
    const formatMongoDBDate = (date) => date.toISOString();

    const dayInfo = (num) => {
      const startTime = new Date(now);
      const endTime = new Date(startTime);
      startTime.setUTCDate(now.getUTCDate() - num + 1);
      startTime.setUTCHours(0, 0, 0, 0);

      endTime.setUTCDate(now.getUTCDate());
      endTime.setUTCHours(23, 59, 59, 999);

      return [formatMongoDBDate(startTime), formatMongoDBDate(endTime)];
    };

    const monthInfo = (num) => {
      const startTime = new Date(now);
      const endTime = new Date(startTime);
      startTime.setUTCFullYear(
        now.getUTCFullYear(),
        now.getUTCMonth() - num,
        1
      );
      startTime.setUTCHours(0, 0, 0, 0);

      endTime.setUTCFullYear(now.getUTCFullYear(), now.getUTCMonth(), 0);
      endTime.setUTCHours(23, 59, 59, 999);

      return [formatMongoDBDate(startTime), formatMongoDBDate(endTime)];
    };

    const yearInfo = (num) => {
      const startTime = new Date(now);
      const endTime = new Date(startTime);
      startTime.setUTCFullYear(now.getUTCFullYear() - num);
      startTime.setUTCHours(0, 0, 0, 0);

      endTime.setUTCHours(23, 59, 59, 999);

      return [formatMongoDBDate(startTime), formatMongoDBDate(endTime)];
    };

    // calculating the time frame
    switch (timeFrame) {
      case "7d":
        {
          const dateRange = dayInfo(7);
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
  }, [dispatch, timeFrame]);
  return (
    <Col xs={12} lg={7}>
      <div className="dashboard-panel h-100 d-flex flex-column gap-4">
        {/* header part  */}
        <div className="d-flex flex-column flex-md-row flex-wrap flex-md-nowrap justify-content-between align-items-start align-items-md-center mb-3">
          <strong className="fs-5 mb-2 mb-md-0">Sales Performance</strong>

          <div className="dashboard-filter-group">
            <Form.Select className="rounded-4">
              <option>Export Data</option>
              <option value="pdf">Pdf File</option>
              <option value="word">Word File</option>
              <option value="excel">Excel File</option>
            </Form.Select>
            <Form.Select
              className="rounded-4"
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
        <div className="dashboard-chart-frame">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={data}>
              <CartesianGrid strokeDasharray="3 3" stroke="#eadfce" />
              <XAxis dataKey="_id" />
              <YAxis />
              <Tooltip />
              <Line type="monotone" dataKey="totalSales" stroke="#b86b32" />
              <Line type="monotone" dataKey="totalRevenue" stroke="#0f766e" />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>
    </Col>
  );
};

export default SalesPerformance;
