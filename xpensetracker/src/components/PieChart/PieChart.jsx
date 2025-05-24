import React from "react";
import { Legend } from "recharts";
import styles from "./PieChart.module.css"

import { PieChart, Pie, Tooltip, Cell } from "recharts";




const COLORS = [
    " #A000FF",
    " #FDE006",
    " #FF9304"
    ];


    const TEXT_COLOR = "white"; // Set your desired label text color

    function CustomLabel({ x, y, value }) {
      return (
        <text
          x={x}
          y={y}
          fill={TEXT_COLOR}
          textAnchor="middle"
          dominantBaseline="central"
          fontSize={12} // Adjust font size if needed
        >
          {value}
        </text>
      );
    }
    

function CustomPieChart({expenses}) {
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
        <PieChart width={300} height={300} className={styles.legend}>
          <Pie
            data={pieChartData}
            dataKey="price"
            nameKey="category"
            cx="50%"
            cy="50%"
            outerRadius={110}
            // fill="#8884d8"
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
              value={`${(percent * 100).toFixed(0)}%`}
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
          <Legend  />
        </PieChart>
      );
    
}

export default CustomPieChart;