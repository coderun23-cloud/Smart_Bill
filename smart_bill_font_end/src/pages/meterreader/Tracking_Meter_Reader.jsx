import React, { useContext, useState, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { AppContext } from "../context/AppContext";
import {
  HomeIcon,
  BellDotIcon,
  FileTextIcon,
  ActivityIcon,
  Gauge,
  User,
  AlertCircle,
  Clock,
  CheckCircle,
} from "lucide-react";
import { Bar, Pie } from "react-chartjs-2";
import { Chart as ChartJS, registerables } from "chart.js";

ChartJS.register(...registerables);

function Tracking_Meter_Reader() {
  const location = useLocation();
  const { user, token, setUser, setToken } = useContext(AppContext);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [readingData, setReadingData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const nav = useNavigate();

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

  useEffect(() => {
    const fetchReadingData = async () => {
      try {
        const response = await fetch("/api/reading", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (!response.ok) {
          throw new Error("Failed to fetch reading data");
        }

        const data = await response.json();
        setReadingData(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchReadingData();
  }, [token]);

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

  // Prepare chart data
  const chartData = {
    labels: readingData.map((reading) =>
      new Date(reading.reading_date).toLocaleDateString()
    ),
    datasets: [
      {
        label: "Meter Readings (kWh)",
        data: readingData.map((reading) => reading.reading_value),
        backgroundColor: "rgba(54, 162, 235, 0.5)",
        borderColor: "rgba(54, 162, 235, 1)",
        borderWidth: 1,
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: "top",
      },
      title: {
        display: true,
        text: "Your Meter Readings Over the Past Month",
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        title: {
          display: true,
          text: "kWh",
        },
      },
      x: {
        title: {
          display: true,
          text: "Date",
        },
      },
    },
  };

  // Prepare status data for pie chart
  const statusCounts = readingData.reduce((acc, reading) => {
    acc[reading.status] = (acc[reading.status] || 0) + 1;
    return acc;
  }, {});

  const statusData = {
    labels: Object.keys(statusCounts),
    datasets: [
      {
        data: Object.values(statusCounts),
        backgroundColor: [
          "rgba(255, 99, 132, 0.5)",
          "rgba(54, 162, 235, 0.5)",
          "rgba(255, 206, 86, 0.5)",
          "rgba(75, 192, 192, 0.5)",
        ],
        borderColor: [
          "rgba(255, 99, 132, 1)",
          "rgba(54, 162, 235, 1)",
          "rgba(255, 206, 86, 1)",
          "rgba(75, 192, 192, 1)",
        ],
        borderWidth: 1,
      },
    ],
  };

  const statusOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: "top",
      },
      title: {
        display: true,
        text: "Reading Status Distribution",
      },
    },
  };

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
            <h1 className="text-2xl font-bold mb-6">Meter Reading Tracking</h1>

            {loading ? (
              <div className="flex justify-center items-center h-64">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
              </div>
            ) : error ? (
              <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-6">
                <strong className="font-bold">Error: </strong>
                <span className="block sm:inline">{error}</span>
              </div>
            ) : (
              <>
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
                  <div className="bg-white p-6 rounded-lg shadow-md">
                    <h2 className="text-xl font-semibold mb-4">
                      Monthly Readings
                    </h2>
                    <div className="h-80">
                      <Bar data={chartData} options={chartOptions} />
                    </div>
                  </div>

                  <div className="bg-white p-6 rounded-lg shadow-md">
                    <h2 className="text-xl font-semibold mb-4">
                      Reading Status
                    </h2>
                    <div className="h-80">
                      <Pie data={statusData} options={statusOptions} />
                    </div>
                  </div>
                </div>

                <div className="bg-white p-6 rounded-lg shadow-md">
                  <h2 className="text-xl font-semibold mb-4">
                    Recent Readings
                  </h2>
                  <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                      <thead className="bg-gray-50">
                        <tr>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Date
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Meter Number
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Reading (kWh)
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Status
                          </th>
                        </tr>
                      </thead>
                      <tbody className="bg-white divide-y divide-gray-200">
                        {readingData.map((reading, index) => (
                          <tr key={index}>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                              {new Date(
                                reading.created_at
                              ).toLocaleDateString()}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                              {reading.effective_date}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                              {reading.amount}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm">
                              <span
                                className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                                  reading.status === "completed"
                                    ? "bg-green-100 text-green-800"
                                    : reading.status === "pending"
                                    ? "bg-yellow-100 text-yellow-800"
                                    : "bg-red-100 text-red-800"
                                }`}
                              >
                                {reading.status}
                              </span>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </>
            )}
          </main>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-10 mt-80">
        <div className="container mx-auto px-4 text-center">
          <h3 className="text-2xl font-bold mb-4">Smart Bill Billing System</h3>
          <p className="max-w-2xl mx-auto mb-6 text-gray-300">
            A reliable and efficient system for managing electricity billing in
            Ethiopia. We aim to provide accurate billing, transparent services,
            and an improved customer experience.
          </p>

          <div className="flex justify-center space-x-4 mb-6 text-xl">
            <a href="#" className="hover:text-blue-400 transition">
              <i className="bi bi-twitter-x"></i>
            </a>
            <a href="#" className="hover:text-blue-600 transition">
              <i className="bi bi-facebook"></i>
            </a>
            <a href="#" className="hover:text-pink-500 transition">
              <i className="bi bi-instagram"></i>
            </a>
            <a href="#" className="hover:text-blue-300 transition">
              <i className="bi bi-skype"></i>
            </a>
            <a href="#" className="hover:text-blue-500 transition">
              <i className="bi bi-linkedin"></i>
            </a>
          </div>

          <div className="text-sm text-gray-400">
            <div className="mb-2">
              <span>Copyright </span>
              <strong className="px-1">Smart Bill Billing System</strong>
              <span>All Rights Reserved</span>
            </div>
            <div>
              Designed by{" "}
              <span className="text-white font-medium">
                St Mary's University Seniors
              </span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default Tracking_Meter_Reader;
