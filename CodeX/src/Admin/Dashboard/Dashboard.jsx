import React from "react";
import "./Dashboard.css";
import { LineChart } from "@mui/x-charts";
import Layout from "./Layout/Layout";

const Dashboard = () => {
  return (
    <Layout>
      {/* Main Content Area */}
      <div className="col-span-3 grid grid-rows-3 gap-6">
        {/* Overview Section */}
        <div className="row-span-1 bg-gray-800 p-4 rounded-lg">
          <h2 className="text-lg font-semibold mb-4">Over View</h2>
          <div className="grid grid-cols-3 gap-4">
            <div className="bg-gray-700 p-2 rounded text-center">
              <p className="text-sm text-green-400">+4.4%</p>
              <p className="text-2xl font-bold">$56,242.00</p>
              <p>Income</p>
            </div>
            <div className="bg-gray-700 p-2 rounded text-center">
              <p className="text-sm text-green-400">+4.4%</p>
              <p className="text-2xl font-bold">$56,242.00</p>
              <p>Spending</p>
            </div>
            <div className="bg-gray-700 p-2 rounded text-center">
              <p className="text-sm text-green-400">+4.4%</p>
              <p className="text-2xl font-bold">$56,242.00</p>
              <p>Net Profit</p>
            </div>
          </div>
        </div>

        <div className="bg-gray-800 p-4 rounded-lg">
          <h2 className="text-lg font-semibold mb-4">
            Total Amount <span className="text-sm text-gray-400">All Time</span>
          </h2>
          <div className="space-y-2">
            <div className="flex justify-between">
              <span>Profit</span>
              <span className="text-purple-400">$400.00</span>
            </div>
            <div className="flex justify-between">
              <span>Loss</span>
              <span className="text-purple-400">$900.00</span>
            </div>
          </div>
          <div className="mt-4">
            <svg className="w-full h-32">
              <rect x="0" y="0" width="50" height="100" fill="#6B46C1" />
              <rect x="60" y="20" width="50" height="80" fill="#A0AEC0" />
              <rect x="120" y="40" width="50" height="60" fill="#6B46C1" />
              <rect x="180" y="30" width="50" height="70" fill="#A0AEC0" />
            </svg>
          </div>
        </div>
        <LineChart
          xAxis={[
            {
              data: [1, 2, 3, 5, 8, 10],
              tickLabelStyle: { fill: "#FFFFFF" }, // X-axis label color
              axisLine: { stroke: "#FFFFFF" }, // X-axis line color
            },
          ]}
          yAxis={[
            {
              tickLabelStyle: { fill: "#FFFFFF" }, // Y-axis label color
              axisLine: { stroke: "#FFFFFF" }, // Y-axis line color
            },
          ]}
          series={[
            {
              data: [2, 5.5, 2, 8.5, 1.5, 5],
              color: "#FFFFFF",
            },
          ]}
          width={800}
          height={400}
        />

        {/* Scheduled Payments */}
        <div className="row-span-1 bg-gray-800 p-4 rounded-lg">
          <h2 className="text-lg font-semibold mb-4">Scheduled Payments</h2>
          <div className="flex items-center space-x-4">
            <div className="w-1/2">
              <div className="w-48 h-48 mx-auto">
                <svg viewBox="0 0 36 36" className="w-full h-full">
                  <path
                    d="M18 2.0845
                       a 15.9155 15.9155 0 0 1 0 31.831
                       a 15.9155 15.9155 0 0 1 0 -31.831"
                    fill="none"
                    stroke="#6B46C1"
                    strokeWidth="3"
                  />
                  <path
                    d="M18 2.0845
                       a 15.9155 15.9155 0 0 1 0 31.831
                       a 15.9155 15.9155 0 0 1 0 -31.831"
                    fill="none"
                    stroke="#A0AEC0"
                    strokeWidth="3"
                    strokeDasharray="50 100"
                  />
                  <text
                    x="18"
                    y="20.35"
                    textAnchor="middle"
                    fontSize="6"
                    fill="#fff"
                  >
                    70%
                  </text>
                </svg>
              </div>
            </div>
            <div className="w-1/2">
              <p>
                Corporate Card{" "}
                <span className="text-purple-400">$2,600.00</span>
              </p>
              <p>
                Debit Card <span className="text-purple-400">$5,832.00</span>
              </p>
              <p>
                Cash <span className="text-purple-400">$900.00</span>
              </p>
            </div>
          </div>
        </div>

        {/* Total Amount and Active Customers */}
        <div className="row-span-1 grid grid-cols-2 gap-6">
          {/* Total Amount */}

          {/* Active Customers */}
          <div className="bg-gray-800 p-4 rounded-lg">
            <h2 className="text-lg font-semibold mb-4">
              Active Customers{" "}
              <span className="text-sm text-gray-400">Inactive</span>
            </h2>
            <div className="space-y-4">
              <div className="flex items-center space-x-2">
                <img
                  src="https://via.placeholder.com/30"
                  alt="Olivia Rhys"
                  className="w-8 h-8 rounded-full"
                />
                <div>
                  <p>Olivia Rhys</p>
                  <p className="text-sm text-gray-400">olivia@gmail.com</p>
                </div>
                <span className="ml-auto">Monthly</span>
              </div>
              <div className="flex items-center space-x-2">
                <img
                  src="https://via.placeholder.com/30"
                  alt="Phoenix Baker"
                  className="w-8 h-8 rounded-full"
                />
                <div>
                  <p>Phoenix Baker</p>
                  <p className="text-sm text-gray-400">phoenix@gmail.com</p>
                </div>
                <span className="ml-auto">Yearly</span>
              </div>
              <div className="flex items-center space-x-2">
                <img
                  src="https://via.placeholder.com/30"
                  alt="Candice Wu"
                  className="w-8 h-8 rounded-full"
                />
                <div>
                  <p>Candice Wu</p>
                  <p className="text-sm text-gray-400">candice@gmail.com</p>
                </div>
                <span className="ml-auto">Monthly</span>
              </div>
            </div>
          </div>
        </div>

        {/* Transactions Overview */}
        <div className="row-span-1 bg-gray-800 p-4 rounded-lg">
          <h2 className="text-lg font-semibold mb-4">Transactions Overview</h2>
          <div className="space-y-2">
            <div className="flex justify-between">
              <span>Invoice #3066</span>
              <span>Jan 6, 2022</span>
              <span className="text-green-400">Paid</span>
              <span>$59.99</span>
            </div>
            <div className="flex justify-between">
              <span>Invoice #3065</span>
              <span>Jan 6, 2022</span>
              <span className="text-green-400">Paid</span>
              <span>$368.84</span>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Dashboard;
