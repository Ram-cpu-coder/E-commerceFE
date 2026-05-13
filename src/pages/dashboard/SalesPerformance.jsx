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

  const data = Array.isArray(sales) ? sales : sales?.sales || [];

  const downloadBlob = (content, filename, type) => {
    const blob = new Blob([content], { type });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = filename;
    link.click();
    URL.revokeObjectURL(url);
  };

  const createSalesPdf = (rows) => {
    const escapePdfText = (value) =>
      String(value ?? "")
        .replace(/\\/g, "\\\\")
        .replace(/\(/g, "\\(")
        .replace(/\)/g, "\\)");

    const lines = [
      "Sales Performance Report",
      `Timeframe: ${timeFrame}`,
      `Generated: ${new Date().toLocaleString()}`,
      "",
      "Period                 Sales      Revenue",
      "----------------------------------------------",
      ...rows.map((row) => {
        const period = String(row.period).slice(0, 18).padEnd(20, " ");
        const sales = String(row.totalSales).padStart(5, " ");
        const revenue = `$${Number(row.totalRevenue).toFixed(2)}`.padStart(12, " ");
        return `${period}${sales}${revenue}`;
      }),
    ];

    const content = [
      "BT",
      "/F1 18 Tf",
      "54 760 Td",
      `(${escapePdfText(lines[0])}) Tj`,
      "/F1 10 Tf",
      ...lines.slice(1).flatMap((line) => [
        "0 -18 Td",
        `(${escapePdfText(line)}) Tj`,
      ]),
      "ET",
    ].join("\n");

    const objects = [
      "<< /Type /Catalog /Pages 2 0 R >>",
      "<< /Type /Pages /Kids [3 0 R] /Count 1 >>",
      "<< /Type /Page /Parent 2 0 R /MediaBox [0 0 612 792] /Resources << /Font << /F1 4 0 R >> >> /Contents 5 0 R >>",
      "<< /Type /Font /Subtype /Type1 /BaseFont /Courier >>",
      `<< /Length ${content.length} >>\nstream\n${content}\nendstream`,
    ];

    let pdf = "%PDF-1.4\n";
    const offsets = [0];
    objects.forEach((object, index) => {
      offsets.push(pdf.length);
      pdf += `${index + 1} 0 obj\n${object}\nendobj\n`;
    });
    const xrefOffset = pdf.length;
    pdf += `xref\n0 ${objects.length + 1}\n`;
    pdf += "0000000000 65535 f \n";
    offsets.slice(1).forEach((offset) => {
      pdf += `${String(offset).padStart(10, "0")} 00000 n \n`;
    });
    pdf += `trailer << /Size ${objects.length + 1} /Root 1 0 R >>\nstartxref\n${xrefOffset}\n%%EOF`;
    return pdf;
  };

  const handleExport = (format) => {
    if (!format) return;

    const rows = data.map((item) => ({
      period: item._id || item.date || "N/A",
      totalSales: item.totalSales || 0,
      totalRevenue: item.totalRevenue || 0,
    }));

    if (format === "excel") {
      const csv = [
        "Period,Total Sales,Total Revenue",
        ...rows.map((row) =>
          [row.period, row.totalSales, row.totalRevenue]
            .map((value) => `"${String(value).replace(/"/g, '""')}"`)
            .join(",")
        ),
      ].join("\n");
      downloadBlob(csv, `sales-performance-${timeFrame}.csv`, "text/csv");
      return;
    }

    const tableRows = rows
      .map(
        (row) =>
          `<tr><td>${row.period}</td><td>${row.totalSales}</td><td>$${Number(
            row.totalRevenue
          ).toFixed(2)}</td></tr>`
      )
      .join("");
    const html = `<!doctype html><html><head><meta charset="utf-8"><title>Sales Performance</title></head><body><h1>Sales Performance</h1><table border="1" cellspacing="0" cellpadding="8"><thead><tr><th>Period</th><th>Total Sales</th><th>Total Revenue</th></tr></thead><tbody>${tableRows}</tbody></table></body></html>`;

    if (format === "word") {
      downloadBlob(html, `sales-performance-${timeFrame}.doc`, "application/msword");
      return;
    }

    if (format === "pdf") {
      downloadBlob(
        createSalesPdf(rows),
        `sales-performance-${timeFrame}.pdf`,
        "application/pdf",
      );
    }
  };

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
            <Form.Select
              className="rounded-4"
              defaultValue=""
              onChange={(e) => {
                handleExport(e.target.value);
                e.target.value = "";
              }}
            >
              <option value="" disabled>Export Data</option>
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
