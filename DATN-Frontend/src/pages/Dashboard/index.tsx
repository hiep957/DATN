import React from "react";
import { Doughnut, Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
  Title,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
} from "chart.js";
import DashBoardLayout from "../../components/layout/Dashboard/LayoutDB";

ChartJS.register(
  ArcElement,
  Tooltip,
  Legend,
  Title,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement
);

// CategoryChart Component
type CategoryItem = {
  category: string;
  productCount: number;
};

type CategoryProps = {
  categoryData: {
    categories: CategoryItem[];
  };
};

const CategoryChart = ({ categoryData }: CategoryProps) => {
  const labels = categoryData?.categories?.map((item) => item.category) || [];
  const dataValues =
    categoryData?.categories?.map((item) => item.productCount) || [];

  const chartData = {
    labels,
    datasets: [
      {
        label: "Số lượng sản phẩm",
        data: dataValues,
        backgroundColor: [
          "rgba(255, 99, 132, 0.6)",
          "rgba(54, 162, 235, 0.6)",
          "rgba(255, 206, 86, 0.6)",
          "rgba(75, 192, 192, 0.6)",
          "rgba(153, 102, 255, 0.6)",
          "rgba(255, 159, 64, 0.6)",
          "rgba(199, 199, 199, 0.6)",
        ],
        borderColor: [
          "rgba(255, 99, 132, 1)",
          "rgba(54, 162, 235, 1)",
          "rgba(255, 206, 86, 1)",
          "rgba(75, 192, 192, 1)",
          "rgba(153, 102, 255, 1)",
          "rgba(255, 159, 64, 1)",
          "rgba(199, 199, 199, 1)",
        ],
        borderWidth: 2,
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: "right" as const,
        labels: {
          font: {
            size: 12,
          },
          padding: 20,
        },
      },
      title: {
        display: true,
        text: "Phân bố sản phẩm theo danh mục",
        font: { size: 18, weight: "bold" as const },
        padding: 20,
      },
    },
  };

  return (
    <div style={{ height: "400px", width: "100%" }}>
      <Doughnut data={chartData} options={options} />
    </div>
  );
};

// OrderChart Component
type OrderProps = {
  dataFromServer: {
    month: string;
    orderStats: Array<{
      day: number;
      orderCount: number;
    }>;
  };
};

const OrderChart = ({ dataFromServer }: OrderProps) => {
  const labels = dataFromServer.orderStats?.map((stat) => `Ngày ${stat.day}`);
  const data = dataFromServer.orderStats?.map((stat) => stat.orderCount);

  const chartData = {
    labels: labels,
    datasets: [
      {
        label: "Số đơn hàng",
        data: data,
        borderColor: "rgba(75, 192, 192, 1)",
        backgroundColor: "rgba(75, 192, 192, 0.2)",
        tension: 0.3,
        fill: true,
        pointBackgroundColor: "rgba(75, 192, 192, 1)",
        pointBorderColor: "#fff",
        pointBorderWidth: 2,
        pointRadius: 5,
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: true,
        labels: {
          font: {
            size: 12,
          },
        },
      },
      title: {
        display: true,
        text: `Đơn hàng trong tháng ${dataFromServer.month}`,
        font: { size: 18, weight: "bold" as const },
        padding: 20,
      },
    },
    scales: {
      x: {
        title: {
          display: true,
          text: "Ngày trong tháng",
          font: { size: 14 },
        },
        grid: {
          display: true,
          color: "rgba(0, 0, 0, 0.1)",
        },
      },
      y: {
        beginAtZero: true,
        title: {
          display: true,
          text: "Số đơn hàng",
          font: { size: 14 },
        },
        grid: {
          display: true,
          color: "rgba(0, 0, 0, 0.1)",
        },
      },
    },
  };

  return (
    <div style={{ height: "400px", width: "100%" }}>
      <Line data={chartData} options={options} />
    </div>
  );
};

// Main Dashboard Component với dữ liệu fake
const Dashboard = () => {
  // Dữ liệu fake cho CategoryChart
  const fakeCategoryData = {
    categories: [
      { category: "Áo thun", productCount: 150 },
      { category: "Áo sơ mi", productCount: 85 },
      { category: "Áo khoác", productCount: 65 },
      { category: "Quần jean", productCount: 120 },
      { category: "Váy", productCount: 45 },
      { category: "Giày", productCount: 90 },
      { category: "Khác", productCount: 30 },
    ],
  };

  // Dữ liệu fake cho OrderChart
  const fakeOrderData = {
    month: "06/2025",
    orderStats: [
      { day: 1, orderCount: 25 },
      { day: 2, orderCount: 30 },
      { day: 3, orderCount: 28 },
      { day: 4, orderCount: 35 },
      { day: 5, orderCount: 40 },
      { day: 6, orderCount: 38 },
      { day: 7, orderCount: 45 },
      { day: 8, orderCount: 42 },
      { day: 9, orderCount: 48 },
      { day: 10, orderCount: 52 },
      { day: 11, orderCount: 47 },
      { day: 12, orderCount: 55 },
      { day: 13, orderCount: 58 },
      { day: 14, orderCount: 60 },
      { day: 15, orderCount: 62 },
      { day: 16, orderCount: 59 },
      { day: 17, orderCount: 65 },
      { day: 18, orderCount: 68 },
      { day: 19, orderCount: 70 },
      { day: 20, orderCount: 72 },
      { day: 21, orderCount: 75 },
      { day: 22, orderCount: 73 },
      { day: 23, orderCount: 78 },
      { day: 24, orderCount: 80 },
      { day: 25, orderCount: 82 },
      { day: 26, orderCount: 85 },
      { day: 27, orderCount: 88 },
    ],
  };

  return (
    <DashBoardLayout>
      <div
        style={{
          padding: "20px",
          fontFamily: "Arial, sans-serif",
          backgroundColor: "#f5f5f5",
          minHeight: "100vh",
        }}
      >
        <h1
          style={{
            textAlign: "center",
            color: "#333",
            marginBottom: "40px",
            fontSize: "32px",
            fontWeight: "bold",
          }}
        >
          Dashboard Thống Kê
        </h1>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            gap: "30px",
            maxWidth: "1400px",
            margin: "0 auto",
          }}
        >
          <div
            style={{
              backgroundColor: "white",
              padding: "20px",
              borderRadius: "12px",
              boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
            }}
          >
            <CategoryChart categoryData={fakeCategoryData} />
          </div>

          <div
            style={{
              backgroundColor: "white",
              padding: "20px",
              borderRadius: "12px",
              boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
            }}
          >
            <OrderChart dataFromServer={fakeOrderData} />
          </div>
        </div>

        <div
          style={{
            marginTop: "40px",
            padding: "20px",
            backgroundColor: "white",
            borderRadius: "12px",
            boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
            maxWidth: "1400px",
            margin: "40px auto 0",
          }}
        >
          <h2 style={{ color: "#333", marginBottom: "15px" }}>
            Thông tin dữ liệu:
          </h2>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "1fr 1fr",
              gap: "20px",
            }}
          >
            <div>
              <h3 style={{ color: "#666", marginBottom: "10px" }}>
                Danh mục sản phẩm:
              </h3>
              <ul style={{ color: "#777", lineHeight: "1.6" }}>
                {fakeCategoryData.categories.map((item, index) => (
                  <li key={index}>
                    {item.category}: {item.productCount} sản phẩm
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <h3 style={{ color: "#666", marginBottom: "10px" }}>
                Thống kê đơn hàng:
              </h3>
              <p style={{ color: "#777", lineHeight: "1.6" }}>
                Tổng số ngày: {fakeOrderData.orderStats.length} ngày
                <br />
                Đơn hàng cao nhất:{" "}
                {Math.max(
                  ...fakeOrderData.orderStats.map((s) => s.orderCount)
                )}{" "}
                đơn
                <br />
                Đơn hàng thấp nhất:{" "}
                {Math.min(
                  ...fakeOrderData.orderStats.map((s) => s.orderCount)
                )}{" "}
                đơn
                <br />
                Trung bình:{" "}
                {Math.round(
                  fakeOrderData.orderStats.reduce(
                    (sum, s) => sum + s.orderCount,
                    0
                  ) / fakeOrderData.orderStats.length
                )}{" "}
                đơn/ngày
              </p>
            </div>
          </div>
        </div>
      </div>
    </DashBoardLayout>
  );
};

export default Dashboard;
