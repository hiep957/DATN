import { useParams, useSearchParams } from "react-router-dom";
import { customFetch } from "../../features/customFetch";
import { useEffect } from "react";

const Success = () => {
  const [searchParams] = useSearchParams();
  console.log("Success page params:", searchParams.get("status"));
  console.log("Success page params:", searchParams.get("orderCode"));
  const orderCode = searchParams.get("orderCode");
  const status = searchParams.get("status");
  const confirmPayment = async () => {
    try {
      const response = await customFetch(
        `http://localhost:3000/api/payment/confirm/${orderCode}`,
        {
          method: "POST",
          credentials: "include",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      if (!response.ok) {
        throw new Error("Failed to confirm payment");
      }
      const data = await response.json();
      console.log("Payment confirmation data:", data);
    } catch (error) {
      console.error("Error confirming payment:", error);
    }
  };
  // Call confirmPayment when the component mounts
  useEffect(() => {
    confirmPayment();
  }, []);
  return (
    <div className="flex flex-col items-center justify-center h-screen bg-gray-100">
      <div className="bg-white p-8 rounded-lg shadow-md text-center">
        <h1 className="text-2xl font-bold mb-4">Success!</h1>
        <p className="text-gray-700 mb-6">Your operation was successful.</p>
        <button
          onClick={() => (window.location.href = "/")}
          className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
        >
          Go to Home
        </button>
      </div>
    </div>
  );
};

export default Success;
