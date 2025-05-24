import React from "react";
import { PieChart, Pie, Tooltip, Cell, Legend } from "recharts";
import styles from "./PieChart.module.css";

const COLORS = ["#A000FF", "#FDE006", "#FF9304"];
const TEXT_COLOR = "white";

function CustomLabel({ x, y, value }) {
  return (
    <text
      x={x}
      y={y}
      fill={TEXT_COLOR}
      textAnchor="middle"
      dominantBaseline="central"
      fontSize={12}
    >
      {value}
    </text>
  );
}

function CustomPieChart({ expenses }) {
  if (!expenses || expenses.length === 0) {
    return <p className={styles.noData}>No expense data to display.</p>;
  }

  const aggregatedData = expenses.reduce((acc, curr) => {
    const category = curr.category;
    if (!acc[category]) {
      acc[category] = 0;
    }
    acc[category] += curr.price;
    return acc;
  }, {});

  const pieChartData = Object.entries(aggregatedData).map(([key, value]) => ({
    category: key,
    price: value,
  }));

  return (
    <PieChart width={300} height={300} aria-label="Expense breakdown chart">
      <Pie
        data={pieChartData}
        dataKey="price"
        nameKey="category"
        cx="50%"
        cy="50%"
        outerRadius={110}
        stroke="none"
        label={({ cx, cy, midAngle, innerRadius, outerRadius, percent }) => {
          const RADIAN = Math.PI / 180;
          const radius = 25 + innerRadius + (outerRadius - innerRadius);
          const x = cx + radius * Math.cos(-midAngle * RADIAN);
          const y = cy + radius * Math.sin(-midAngle * RADIAN);
          return (
            <CustomLabel
              x={x}
              y={y}
              value={percent > 0.05 ? `${(percent * 100).toFixed(0)}%` : ""}
            />
          );
        }}
        labelLine={false}
      >
        {pieChartData.map((entry, index) => (
          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
        ))}
      </Pie>
      <Tooltip />
      <Legend />
    </PieChart>
  );
}

export default CustomPieChart;
