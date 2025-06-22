import React, { useContext, useEffect, useState, useRef } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { AppContext } from "../context/AppContext";
import {
  HomeIcon,
  BellDotIcon,
  FileTextIcon,
  ActivityIcon,
  Gauge,
  Scan,
  PenTool,
  Camera,
} from "lucide-react";

function Reading() {
  const location = useLocation();
  const { user, token, setUser, setToken } = useContext(AppContext);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [customers, setCustomers] = useState([]);
  const [reading, setReading] = useState([]);
  const [selectedCustomer, setSelectedCustomer] = useState(null);
  const [showDetailsPopup, setShowDetailsPopup] = useState(false);
  const [showReadingPopup, setShowReadingPopup] = useState(false);
  const [showReadingOptions, setShowReadingOptions] = useState(false);
  const [readingMode, setReadingMode] = useState(null);
  const [customersWithReadings, setCustomersWithReadings] = useState({});
  const [success, setSuccess] = useState("");
  const [error, setError] = useState("");
  const [showCamera, setShowCamera] = useState(false);
  const videoRef = useRef(null);
  const [scanResult, setScanResult] = useState("");
  const nav = useNavigate();

  const [newReading, setNewReading] = useState({
    customer_id: "",
    amount: "",
    reading_type: "",
    reading_date: "",
  });

  const menuItems = [
    { name: "Home", icon: <HomeIcon size={18} />, path: "/index" },
    { name: "Reading", icon: <Gauge size={18} />, path: "/reading" },
    {
      name: "Notifications",
      icon: <BellDotIcon size={18} />,
      path: "/notifications_meterreader",
    },
    {
      name: "Report",
      icon: <FileTextIcon size={18} />,
      path: "/report_meterreader",
    },
    {
      name: "Tracking",
      icon: <ActivityIcon size={18} />,
      path: "/tracking_meterreader",
    },
  ];

  async function handleLogout(e) {
    e.preventDefault();
    const res = await fetch("/api/logout", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (res.ok) {
      setUser(null);
      setToken(null);
      localStorage.removeItem("token");
      nav("/");
    }
  }

  async function fetchCustomers() {
    try {
      const res = await fetch("/api/customer", {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const data = await res.json();
      if (res.ok) {
        setCustomers(data);
      }
    } catch (error) {
      console.error("Error fetching customers:", error);
    }
  }

  async function fetchReading(id) {
    try {
      const res = await fetch(`/api/detail/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const data = await res.json();
      if (res.ok) {
        setReading(data);
        const customer = customers.find((c) => c.id === id);
        setSelectedCustomer(customer);
        setCustomersWithReadings((prev) => ({
          ...prev,
          [id]: data.length > 0,
        }));
      }
    } catch (error) {
      console.log(error);
    }
  }

  const handleReadingSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch("/api/reading", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          ...newReading,
          customer_id: selectedCustomer.id,
          reading_type: readingMode,
          amount: scanResult || newReading.amount,
        }),
      });

      const data = await res.json();

      if (res.ok) {
        await fetchReading(selectedCustomer.id);
        setShowReadingPopup(false);
        setReadingMode(null);
        setNewReading({
          customer_id: "",
          amount: "",
          reading_type: "",
          reading_date: "",
        });
        setScanResult("");
        setSuccess(data.message || "Reading submitted successfully.");
        setError("");
        setTimeout(() => setSuccess(""), 3000);
      } else {
        setError(data.message || "Failed to submit reading.");
        setSuccess("");
        setTimeout(() => setError(""), 3000);
      }
    } catch (error) {
      console.error("Error submitting reading:", error);
      setError("Network error. Please try again.");
      setSuccess("");
      setTimeout(() => setError(""), 3000);
    }
  };

  const handleCameraScan = () => {
    setShowCamera(true);
    navigator.mediaDevices
      .getUserMedia({
        video: {
          facingMode: "environment",
          width: { ideal: 1280 },
          height: { ideal: 720 },
        },
      })
      .then((stream) => {
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
        }
      })
      .catch((err) => {
        console.error("Camera error:", err);
        setError("Could not access camera: " + err.message);
      });
  };

  const captureImage = () => {
    const canvas = document.createElement("canvas");
    canvas.width = videoRef.current.videoWidth;
    canvas.height = videoRef.current.videoHeight;
    const ctx = canvas.getContext("2d");

    ctx.filter = "contrast(1.5) brightness(1.2)";
    ctx.drawImage(videoRef.current, 0, 0, canvas.width, canvas.height);

    const imageDataUrl = canvas.toDataURL("image/jpeg");

    videoRef.current.srcObject.getTracks().forEach((track) => track.stop());
    setShowCamera(false);

    processCapturedImage(imageDataUrl);
  };

  const processCapturedImage = async (imageData) => {
    try {
      // In a real implementation, you would send this to your backend for OCR processing
      // For demo purposes, we'll simulate extracting a random number
      const simulatedReading = Math.floor(Math.random() * 900) + 100; // Random number between 100-1000
      setScanResult(simulatedReading.toString());
      setReadingData((prev) => ({
        ...prev,
        amount: simulatedReading.toString(),
      }));
    } catch (error) {
      console.error("Image processing error:", error);
      setError("Failed to process image: " + error.message);
    }
  };
  const [readingData, setReadingData] = useState({
    customer_id: "",
    amount: "",
    reading_type: "scan",
    reading_date: new Date().toISOString().split("T")[0],
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch("/api/reading", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          ...readingData,
          amount: scanResult || readingData.amount,
          user_id: user.id,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to submit reading");
      }

      setSuccess(data.message);
      setError("");

      // Reset form
      setReadingData({
        customer_id: "",
        amount: "",
        reading_type: "scan",
        reading_date: new Date().toISOString().split("T")[0],
      });
      setScanResult("");
    } catch (error) {
      console.error("Submission error:", error);
      setError(error.message);
      setSuccess("");
    }
  };

  useEffect(() => {
    fetchCustomers();
  }, []);

  return (
    <div className="flex flex-col min-h-screen">
      <div className="flex flex-1">
        {/* Sidebar */}
        <div
          className={`${
            isSidebarOpen ? "w-64" : "w-16"
          } bg-gray-800 text-white fixed h-full transition-all duration-300 z-10`}
        >
          <div className="p-6 text-2xl font-bold border-b border-gray-700">
            {isSidebarOpen ? "Dashboard" : "D"}
          </div>
          <nav className="mt-4">
            {menuItems.map((item) => (
              <Link
                key={item.name}
                to={item.path}
                className={`block px-6 py-3 hover:bg-gray-700 transition ${
                  location.pathname === item.path
                    ? "bg-gray-700 font-semibold"
                    : ""
                }`}
              >
                <span className="flex items-center gap-2">
                  {item.icon}
                  {isSidebarOpen && item.name}
                </span>
              </Link>
            ))}
          </nav>
        </div>

        {/* Main Content */}
        <div
          className={`flex-1 flex flex-col ${
            isSidebarOpen ? "ml-64" : "ml-16"
          } transition-all duration-300`}
        >
          {/* Top Navbar */}
          <div className="bg-white shadow-md h-16 flex items-center justify-between px-6 border-b sticky top-0 z-10">
            <button
              className="bg-gray-800 text-white p-2 rounded hover:bg-gray-700 transition cursor-pointer"
              onClick={() => setIsSidebarOpen(!isSidebarOpen)}
            >
              {isSidebarOpen ? "←" : "→"}
            </button>
            <div className="relative">
              <button
                onClick={() => setDropdownOpen(!dropdownOpen)}
                className="flex items-center gap-2 font-semibold text-gray-800 hover:text-gray-600 cursor-pointer"
              >
                {user.name} ▾
              </button>
              {dropdownOpen && (
                <div className="absolute right-0 mt-2 w-40 bg-white border rounded shadow-md z-10">
                  <Link
                    to="/profile"
                    className="block px-4 py-2 hover:bg-gray-100 text-gray-800"
                  >
                    Profile
                  </Link>
                  <form onSubmit={handleLogout}>
                    <button className="w-full text-left px-4 py-2 hover:bg-gray-100 text-gray-800">
                      Logout
                    </button>
                  </form>
                </div>
              )}
            </div>
          </div>

          {/* Page Content */}
          <main className="flex-1 p-6 bg-gray-50">
            <div className="overflow-x-auto bg-white rounded-lg shadow">
              {error && (
                <p className="text-red-600 font-semibold mt-2">{error}</p>
              )}
              {success && (
                <p className="text-green-600 font-semibold mt-2">{success}</p>
              )}

              <h1 className="text-center font-bold text-2xl text-black py-6">
                Customers List
              </h1>
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-100">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      #
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Customer Name
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      See Details
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {customers.length > 0 ? (
                    customers.map((customer, index) => (
                      <tr key={index} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {index + 1}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                          {customer.name || "N/A"}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 space-x-2">
                          <button
                            onClick={() => {
                              setSelectedCustomer(customer);
                              setShowReadingOptions(true);
                            }}
                            className={`px-4 py-2 rounded text-white ${
                              customersWithReadings[customer.id]
                                ? "bg-gray-400 cursor-not-allowed"
                                : "bg-green-600 hover:bg-green-700"
                            }`}
                            disabled={customersWithReadings[customer.id]}
                          >
                            Add Reading
                          </button>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 space-x-2">
                          <button
                            onClick={async () => {
                              await fetchReading(customer.id);
                              setShowDetailsPopup(true);
                            }}
                            className="bg-blue-600 text-white px-4 py-2 rounded"
                          >
                            See Details
                          </button>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td
                        colSpan="5"
                        className="px-6 py-4 text-center text-sm text-gray-500"
                      >
                        No customers found
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </main>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-10 mt-80">
        <div className="container mx-auto px-4 text-center">
          <h3 className="text-2xl font-bold mb-4">Smart Bill Billing System</h3>
          <p className="max-w-2xl mx-auto mb-6 text-gray-300">
            A reliable and efficient system for managing electricity billing in
            Ethiopia.
          </p>
          <div className="text-sm text-gray-400">
            <div className="mb-2">
              <span>Copyright </span>
              <strong className="px-1">Smart Bill Billing System</strong>
              <span>All Rights Reserved</span>
            </div>
          </div>
        </div>
      </footer>

      {/* Customer Details Popup */}
      {showDetailsPopup && selectedCustomer && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
          <div className="bg-white p-6 rounded-lg w-full max-w-2xl">
            <h3 className="text-xl font-bold mb-4">
              Customer Details: {selectedCustomer.name}
            </h3>
            <div className="mb-6 p-4 border rounded">
              <h4 className="font-semibold mb-2">Customer Information</h4>
              <div className="grid grid-cols-2 gap-4">
                <p>
                  <strong>Name:</strong> {selectedCustomer.name}
                </p>
                <p>
                  <strong>Email:</strong> {selectedCustomer.email}
                </p>
                <p>
                  <strong>Phone:</strong> {selectedCustomer.phone_number}
                </p>
                <p>
                  <strong>Address:</strong> {selectedCustomer.address || "N/A"}
                </p>
              </div>
            </div>
            <div className="p-4 border rounded">
              <h4 className="font-semibold mb-2">Reading History</h4>
              {reading.length > 0 ? (
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Date
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Type
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Amount
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {reading.map((readingItem, index) => (
                        <tr key={index}>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {new Date(
                              readingItem.reading_date
                            ).toLocaleDateString()}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {readingItem.reading_type}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {readingItem.amount} kWh
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <p>No reading history available</p>
              )}
            </div>
            <div className="mt-4 text-right">
              <button
                onClick={() => {
                  setShowDetailsPopup(false);
                  setSelectedCustomer(null);
                }}
                className="bg-gray-600 text-white px-4 py-2 rounded"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Reading Options Popup */}
      {showReadingOptions && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
          <div className="bg-white p-6 rounded-lg w-full max-w-md">
            <h3 className="text-xl font-bold mb-4">Select Reading Method</h3>
            <div className="grid grid-cols-2 gap-4">
              <button
                onClick={() => {
                  setReadingMode("manual");
                  setShowReadingOptions(false);
                  setShowReadingPopup(true);
                }}
                className="flex flex-col items-center justify-center p-4 border rounded-lg hover:bg-gray-50 transition"
              >
                <PenTool className="h-8 w-8 mb-2 text-blue-600" />
                <span>Manual Entry</span>
              </button>
              <button
                onClick={() => {
                  setReadingMode("scan");
                  setShowReadingOptions(false);
                  setShowReadingPopup(true);
                }}
                className="flex flex-col items-center justify-center p-4 border rounded-lg hover:bg-gray-50 transition"
              >
                <Scan className="h-8 w-8 mb-2 text-green-600" />
                <span>Scan Meter</span>
              </button>
            </div>
            <div className="mt-4 text-right">
              <button
                onClick={() => setShowReadingOptions(false)}
                className="bg-gray-400 text-white px-4 py-2 rounded"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Add Reading Popup */}
      {showReadingPopup && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
          <div className="bg-white p-6 rounded-lg w-full max-w-md">
            <h3 className="text-xl font-bold mb-4">
              {readingMode === "manual"
                ? "Manual Reading Entry"
                : "Scan Meter Reading"}
            </h3>
            <form onSubmit={handleReadingSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Customer
                </label>
                <input
                  type="text"
                  value={selectedCustomer?.name || ""}
                  readOnly
                  className="w-full p-2 border rounded bg-gray-100"
                />
              </div>

              {readingMode === "scan" && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Meter Scan
                  </label>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={scanResult}
                      onChange={(e) => {
                        setScanResult(e.target.value);
                        setNewReading((prev) => ({
                          ...prev,
                          amount: e.target.value,
                        }));
                      }}
                      placeholder="Scanned value will appear here"
                      className="flex-1 p-2 border rounded"
                    />
                    <button
                      type="button"
                      onClick={handleCameraScan}
                      className="bg-blue-600 text-white px-4 py-2 rounded flex items-center"
                    >
                      <Camera className="h-4 w-4 mr-2" />
                      Scan
                    </button>
                  </div>

                  {showCamera && (
                    <div className="mt-4 relative">
                      <div className="relative">
                        <video
                          ref={videoRef}
                          autoPlay
                          playsInline
                          className="w-full h-auto border rounded"
                        />
                        <div className="absolute inset-0 flex items-center justify-center">
                          <div className="border-2 border-red-500 h-32 w-full max-w-md relative">
                            <div className="absolute bottom-0 left-0 right-0 text-center text-white bg-black bg-opacity-50 py-1">
                              Align meter numbers within this box
                            </div>
                          </div>
                        </div>
                      </div>
                      <button
                        onClick={captureImage}
                        className="absolute bottom-4 left-1/2 transform -translate-x-1/2 bg-red-500 text-white p-2 rounded-full"
                      >
                        <Camera className="h-6 w-6" />
                      </button>
                    </div>
                  )}
                </div>
              )}

              {readingMode === "manual" && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Amount (kWh)
                  </label>
                  <input
                    type="number"
                    value={newReading.amount}
                    onChange={(e) =>
                      setNewReading({ ...newReading, amount: e.target.value })
                    }
                    className="w-full p-2 border rounded"
                    required
                  />
                </div>
              )}

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Date
                </label>
                <input
                  type="date"
                  value={newReading.reading_date}
                  onChange={(e) =>
                    setNewReading({
                      ...newReading,
                      reading_date: e.target.value,
                    })
                  }
                  className="w-full p-2 border rounded"
                  required
                />
              </div>

              <div className="flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => {
                    setShowReadingPopup(false);
                    setReadingMode(null);
                    setScanResult("");
                    if (videoRef.current?.srcObject) {
                      videoRef.current.srcObject
                        .getTracks()
                        .forEach((track) => track.stop());
                    }
                  }}
                  className="bg-gray-400 text-white px-4 py-2 rounded"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="bg-green-600 text-white px-4 py-2 rounded"
                >
                  Submit Reading
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default Reading;
