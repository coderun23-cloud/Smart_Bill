import { useNavigate } from "react-router-dom";
import { useEffect } from "react";

export default function PaymentSuccess() {
  const navigate = useNavigate();

  useEffect(() => {
    const timer = setTimeout(() => {
      navigate("/index"); // Or wherever you want to go back to
    }, 3000); // 3 seconds

    return () => clearTimeout(timer);
  }, [navigate]);

  return (
    <div className="flex flex-col items-center justify-center h-screen">
      <h1 className="text-2xl font-bold text-green-600 mb-4">
        Payment Successful!
      </h1>
      <p className="text-gray-700">Redirecting you shortly...</p>
    </div>
  );
}
