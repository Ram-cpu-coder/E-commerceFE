import React, { useEffect } from "react";
import { Col } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import {
  Cell,
  Legend,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
} from "recharts";
import { getAdminProductNoPaginationAction } from "../../features/products/productActions";

const TopCategories = () => {
  const dispatch = useDispatch();

  const { Categories } = useSelector((state) => state.categoryInfo);
  const { allAdminProducts } = useSelector((state) => state.productInfo);

  const selectedCatProductLength = (selectedCat) => {
    const productsAssociated = allAdminProducts?.filter(
      (item) => item.category == selectedCat._id
    );
    return productsAssociated?.length;
  };

  const data = [];

  for (let i = 0; i < Categories?.length; i++) {
    const category = Categories[i];
    const obj = {
      name: category.categoryName,
      value: selectedCatProductLength(category),
    };
    data.push(obj);
  }

  const generateColors = (num) => {
    const colors = [];
    for (let i = 0; i < num; i++) {
      const hue = Math.floor((360 / num) * i);
      colors.push(`hsl(${hue}, 70%, 50%)`);
    }
    return colors;
  };

  const COLORS = generateColors(Categories?.length || 0);

  const renderCustomLabel = ({
    cx,
    cy,
    midAngle,
    outerRadius,
    percent,
    name,
  }) => {
    const RADIAN = Math.PI / 180;
    const radius = outerRadius + 10; // push label further out
    const x = cx + radius * Math.cos(-midAngle * RADIAN);
    const y = cy + radius * Math.sin(-midAngle * RADIAN);

    return (
      <text
        x={x}
        y={y}
        fill="#333"
        textAnchor={x > cx ? "start" : "end"}
        dominantBaseline="central"
        fontSize={12}
      >
        {`${name} (${(percent * 100).toFixed(0)}%)`}
      </text>
    );
  };

  useEffect(() => {
    if (allAdminProducts.length <= 0) {
      dispatch(getAdminProductNoPaginationAction());
    }
  }, []);

  return (
    <Col xs={12} md={5}>
      <div className="border rounded-4 py-4 px-3 h-100 d-flex flex-column">
        <strong className="text-center mb-3 fs-5">Top Categories</strong>

        <div className="flex-grow-1 d-flex justify-content-center align-items-center">
          <ResponsiveContainer width="100%" height={250}>
            <PieChart>
              <Pie
                data={data}
                cx="50%"
                cy="50%"
                outerRadius={80}
                fill="#8884d8"
                dataKey="value"
                labelLine={false}
                label={renderCustomLabel}
              >
                {data.map((entry, index) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={COLORS[index % COLORS.length]}
                  />
                ))}
              </Pie>
              <Tooltip />
              <Legend
                layout="horizontal"
                verticalAlign="bottom"
                align="center"
                iconType="circle"
                wrapperStyle={{ fontSize: "0.8rem" }}
              />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>
    </Col>
  );
};

export default TopCategories;
