import { useEffect, useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";

export default function PaymentCallback() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [message, setMessage] = useState("Verifying payment...");

  useEffect(() => {
    const tx_ref = searchParams.get("tx_ref");

    if (!tx_ref) {
      setMessage("No transaction reference provided.");
      return;
    }

    // Call your backend to verify payment
    async function verifyPayment() {
      try {
        const res = await fetch("/api/payment/callback", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ tx_ref }),
        });

        const data = await res.json();

        if (res.ok && data.redirect_url) {
          // Redirect user to success or failure page
          window.location.href = data.redirect_url;
        } else {
          setMessage(data.message || "Payment verification failed.");
        }
      } catch (err) {
        setMessage("An error occurred while verifying payment.");
      }
    }

    verifyPayment();
  }, [searchParams]);

  return (
    <div className="p-6 max-w-md mx-auto">
      <h2 className="text-xl font-bold mb-4">Payment Status</h2>
      <p>{message}</p>
    </div>
  );
}
