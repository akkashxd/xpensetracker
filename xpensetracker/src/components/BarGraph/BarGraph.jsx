import React from "react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from "recharts";
import styles from './BarGraph.module.css';


const categories = ["Food", "Travel", "Entertainment"];



function CustomBarChart({ data}) {

     const chartData = categories.map((category) => {
    const totalPrice = data
      .filter((item) => item.category.toLowerCase() === category.toLowerCase())
      .reduce((sum, item) => sum + Number(item.price), 0);
    return { category, price: totalPrice };
  });


  return (
    <div>
        <h2>Top Expenses</h2>
       
    <BarChart
      className={styles.barGraph}
      width={500}
      height={300}
      data={chartData}
      layout="vertical"
      margin={{
        top: 20,
        right: 30,
        left: 80,
        bottom: 5,
      }}
    >
      <XAxis type="number" hide={true}/>
      <YAxis type="category" dataKey='category' className={styles.Yaxis} axisLine={false} tickLine={false}/>
      <Tooltip />
      
      <Bar dataKey="price" fill="#8784D2" barSize={22} radius={[0, 10, 10, 0]}/>
    </BarChart>
  
    </div>
  );
}

export default CustomBarChart;
