import { useContext, useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { AppContext } from "../context/AppContext";

function Bill_Details() {
  const { token, user } = useContext(AppContext);
  const { id } = useParams();
  const navigate = useNavigate();

  const [loading, setLoading] = useState(true);
  const [customer, setCustomer] = useState(null);
  const [readings, setReadings] = useState([]);
  const [tariff, setTariff] = useState(null);
  const [bills, setBills] = useState([]);
  const [error, setError] = useState(null);

  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  async function handleAddBill() {
    setSuccessMessage("");
    setErrorMessage("");

    if (!readings.length || !tariff || !customer) return;

    const latestReading = readings[0];
    const billAmount =
      parseFloat(latestReading.amount) * parseFloat(tariff.price);

    const payload = {
      user_id: customer.id,
      generated_by: user?.id,
      bill_amount: billAmount,
      status: "unpaid",
      reading_id: latestReading.id,
      tariff_id: tariff.id,
      due_date: new Date(Date.now() + 15 * 24 * 60 * 60 * 1000)
        .toISOString()
        .split("T")[0],
    };

    try {
      const res = await fetch("/api/bill", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      const data = await res.json();

      if (!res.ok) throw new Error(data.error || "Failed to create bill");

      setSuccessMessage("✅ Bill added successfully.");
      setTimeout(() => setSuccessMessage(""), 3000); // auto-hide after 5 seconds

      fetchBills();
    } catch (err) {
      console.error(err);
      setErrorMessage(`❌ ${err.message}`);
      setTimeout(() => setErrorMessage(""), 3000); // auto-hide after 5 seconds
    }
  }

  async function fetchBills() {
    try {
      const res = await fetch(`/api/bills/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error || "Failed to fetch bills");
      }
      const data = await res.json();
      setBills(data);
    } catch (err) {
      console.error(err);
    }
  }

  useEffect(() => {
    async function fetchDetails() {
      try {
        setLoading(true);
        const res = await fetch(`/api/reading_details/${id}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (!res.ok) {
          const err = await res.json();
          throw new Error(err.error || "Failed to fetch reading details");
        }

        const data = await res.json();
        setCustomer(data.customer);
        setReadings(data.readings);
        setTariff(data.tariff);

        await fetchBills();
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }

    fetchDetails();
  }, [token]);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6 bg-red-100 text-red-700 border-l-4 border-red-500">
        <p>{error}</p>
        <button
          onClick={() => navigate(-1)}
          className="mt-2 px-4 py-2 bg-gray-300 rounded hover:bg-gray-400"
        >
          Go Back
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto mt-10 p-6 bg-white shadow rounded-lg">
      <button
        onClick={handleAddBill}
        className="mt-4 mb-5  px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 cursor-pointer"
      >
        + Add Bill
      </button>
      <button
        onClick={() => navigate(-1)}
        className="mt-6 px-4 py-2 float-right bg-blue-600 text-white rounded hover:bg-blue-700 cursor-pointer"
      >
        Go Back
      </button>

      {/* Message display */}
      {successMessage && (
        <p className="text-green-600 font-semibold mt-2">{successMessage}</p>
      )}
      {errorMessage && (
        <p className="text-red-600 font-semibold mt-2">{errorMessage}</p>
      )}

      <h1 className="text-2xl font-bold mb-6">Reading Details</h1>

      {/* Customer Info */}
      {customer && (
        <div className="grid grid-cols-2 gap-4 mb-6">
          <Detail label="Customer Name" value={customer.name} />
          <Detail label="Customer Type" value={customer.customer_type} />
          <Detail label="Phone Number" value={customer.phone_number} />
          <Detail label="Email" value={customer.email} />
        </div>
      )}

      {/* Tariff Info */}
      {tariff && (
        <div className="mb-6">
          <h2 className="text-xl font-semibold mb-2">Tariff Info</h2>
          <p className="text-gray-700">
            Type: <strong>{tariff.tariff_name}</strong> | Rate:{" "}
            <strong>{tariff.price} ETB/kWh</strong>
          </p>
        </div>
      )}

      {/* Reading History */}
      <h2 className="text-xl font-semibold mb-4">Reading History</h2>
      {readings.length > 0 ? (
        <table className="min-w-full border mb-10">
          <thead className="bg-gray-100">
            <tr>
              <th className="p-2 border">Date</th>
              <th className="p-2 border">Amount (kWh)</th>
              <th className="p-2 border">Type</th>
              <th className="p-2 border">Reader Name</th>
              <th className="p-2 border">Created At</th>
            </tr>
          </thead>
          <tbody>
            {readings.map((reading) => (
              <tr key={reading.id}>
                <td className="p-2 border">
                  {new Date(reading.reading_date).toLocaleDateString()}
                </td>
                <td className="p-2 border">{reading.amount}</td>
                <td className="p-2 border">{reading.reading_type}</td>
                <td className="p-2 border">{reading.user?.name || "N/A"}</td>
                <td className="p-2 border">
                  {new Date(reading.created_at).toLocaleString()}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        <p className="text-gray-600 mb-10">No readings found.</p>
      )}

      {/* Bills Table */}
      <h2 className="text-xl font-semibold mb-4">Bills Generated</h2>
      {bills.length > 0 ? (
        <table className="min-w-full border">
          <thead className="bg-gray-100">
            <tr>
              <th className="p-2 border">Bill ID</th>
              <th className="p-2 border">Amount (ETB)</th>
              <th className="p-2 border">Status</th>
              <th className="p-2 border">Due Date</th>
              <th className="p-2 border">Created At</th>
            </tr>
          </thead>
          <tbody>
            {bills.map((bill) => (
              <tr key={bill.id}>
                <td className="p-2 border">{bill.id}</td>
                <td className="p-2 border">{bill.bill_amount}</td>
                <td className="p-2 border capitalize">{bill.status}</td>
                <td className="p-2 border">{bill.due_date}</td>
                <td className="p-2 border">
                  {new Date(bill.created_at).toLocaleDateString()}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        <p className="text-gray-600">No bills found.</p>
      )}
    </div>
  );
}

function Detail({ label, value }) {
  return (
    <div>
      <h3 className="text-gray-500 text-sm font-semibold">{label}</h3>
      <p className="text-lg text-gray-800">{value}</p>
    </div>
  );
}

export default Bill_Details;
