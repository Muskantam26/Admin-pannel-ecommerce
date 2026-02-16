import React from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
  Legend,
} from "recharts";

const OrderChart = ({ data }) => {
  return (
    <div className="w-full h-60.5">
      <ResponsiveContainer>
        <LineChart data={data} 
        
        >
          <CartesianGrid strokeDasharray="1 1" />

          <XAxis dataKey="month"
          fontSize={10}
          />
          <YAxis 
          fontSize={10}
          />

          <Tooltip />
          <Legend />

          {/* Previous Line */}
          <Line
            type="monotone"
            dataKey="previous"
            stroke="#2563eb"
            strokeWidth={1}
            dot={{ r: 2 }}
          />

          {/* Current Line */}
          <Line
            type="monotone"
            dataKey="current"
            stroke="#10b981"
            strokeWidth={1}
            dot={{ r: 2 }}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};

export default OrderChart;
