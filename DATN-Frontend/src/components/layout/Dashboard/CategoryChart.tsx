import { Doughnut } from "react-chartjs-2";
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
  Title,
} from "chart.js";
import { useNavigate } from "react-router-dom";

ChartJS.register(ArcElement, Tooltip, Legend, Title);

type CategoryItem = {
  category: string;
  productCount: number;
};

type Props = {
  categoryData: {
    categories: CategoryItem[];
  };
};

const CategoryChart = ({ categoryData }: Props) => {
  const navigate = useNavigate();

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
        ],
        borderColor: [
          "rgba(255, 99, 132, 1)",
          "rgba(54, 162, 235, 1)",
          "rgba(255, 206, 86, 1)",
          "rgba(75, 192, 192, 1)",
          "rgba(153, 102, 255, 1)",
        ],
        borderWidth: 1,
      },
    ],
  };

  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: "right" as const,
      },
      title: {
        display: true,
        text: "Phân bố sản phẩm theo danh mục",
        font: { size: 16 },
      },
    },
  };

  return <Doughnut data={chartData} options={options} />;
};

export default CategoryChart;
