import React from "react";
import { Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Tooltip,
  Legend,
} from "chart.js";

ChartJS.register(CategoryScale, LinearScale, BarElement, Tooltip, Legend);

const Payoutcards = ({
  icon: LeftIcon,
  rightIcon: RightIcon,
  value,
  label,
  color = "black",       
  bgColor = "#f3f4f6",
  font="noraml"   ,
  showTarget = false,
 
}) => {
 const chartValues = [
  8, 10, 5, 25, 10, 30, 22, 15,
  28, 9, 14, 20, 26, 8, 17
]; 


const data = {
  labels: chartValues.map((_, i) => i + 1),
  datasets: [
    {
      data: chartValues,
      backgroundColor: "rgba(249, 115, 22, 1)",
      borderRadius: 2,
      barThickness: 1,
    },
  ],
};


  
 const options = {
  responsive: true,
  plugins: {
    legend: { display: false },
    tooltip: { enabled: false },
  },
  scales: {
    x: {
      display: false,
      grid: { display: false },
    },
    y: {
      display: false,
      beginAtZero: true,
    },
  },
};


  return (
    <div
      className="rounded-3xl p-3 px-4 space-y-4 w-full"
      style={{ backgroundColor: bgColor }} 
    >
      {/* Top Row */}
      <div className="flex items-center justify-between w-full">
        <div className="flex items-center gap-3">
          <div
            className="h-12 w-12 rounded-xl flex items-center justify-center bg-white text-black font-extralight"
           
          >
            {LeftIcon && <LeftIcon size={22} />}
          </div>

          <div>
            <h3 className="text-[17px] font-extrabold" style={{color }}>
              {value}
            </h3>
            <p className="text-[10px] tracking-tight" style={{ fontWeight:font,color }}>
              {label}
            </p>
          </div>
        </div>

        {RightIcon && (
          <div
            className="h-8 w-8 rounded-2xl flex items-center justify-center bg-white"
           
          >
            <RightIcon size={18} style={{ color }} />
          </div>
        )}
      </div>

      {/* Target Chart Section */}
      {showTarget && (
        <div className="space-y-2">
          <p className="text-xs" style={{ color: "#6b7280" }}>Target</p>
          <div className="h-10">
            <Bar data={data} options={options} />
          </div>
          <div className="flex justify-between text-xs" style={{ color: "#6b7280" }}>
            <span>12.1k</span>
            <span>780</span>
          </div>
        </div>
      )}
    </div>
  );
};

export default Payoutcards;
