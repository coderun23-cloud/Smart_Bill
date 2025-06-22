import React, { useContext, useState } from "react";
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

function MeterReader() {
  const location = useLocation();
  const { user, token, setUser, setToken } = useContext(AppContext);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
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

  // Sample data for meter reading charts
  const weeklyReadingsData = {
    labels: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat"],
    datasets: [
      {
        label: "Meters Read",
        data: [45, 62, 58, 71, 63, 40],
        backgroundColor: "rgba(75, 192, 192, 0.5)",
        borderColor: "rgba(75, 192, 192, 1)",
        borderWidth: 1,
      },
    ],
  };

  const readingStatusData = {
    labels: ["Completed", "Pending", "Issues"],
    datasets: [
      {
        data: [320, 85, 12],
        backgroundColor: [
          "rgba(75, 192, 192, 0.5)",
          "rgba(255, 206, 86, 0.5)",
          "rgba(255, 99, 132, 0.5)",
        ],
        borderColor: [
          "rgba(75, 192, 192, 1)",
          "rgba(255, 206, 86, 1)",
          "rgba(255, 99, 132, 1)",
        ],
        borderWidth: 1,
      },
    ],
  };

  // Sample data for tables
  const recentReadings = [
    {
      id: 1,
      customer: "John Doe",
      address: "123 Main St",
      previous: "04567",
      current: "04892",
      usage: 425,
      date: "2023-06-15",
      status: "completed",
    },
    {
      id: 2,
      customer: "Jane Smith",
      address: "456 Oak Ave",
      previous: "07823",
      current: "07945",
      usage: 122,
      date: "2023-06-15",
      status: "completed",
    },
    {
      id: 3,
      customer: "Robert Johnson",
      address: "789 Pine Rd",
      previous: "03456",
      current: null,
      usage: null,
      date: "2023-06-16",
      status: "pending",
    },
    {
      id: 4,
      customer: "Emily Davis",
      address: "321 Elm Blvd",
      previous: "05678",
      current: null,
      usage: null,
      date: "2023-06-16",
      status: "pending",
    },
    {
      id: 5,
      customer: "Michael Brown",
      address: "654 Maple Ln",
      previous: "02345",
      current: "02345",
      usage: 0,
      date: "2023-06-14",
      status: "issue",
    },
  ];

  const importantNotifications = [
    {
      id: 1,
      title: "New Reading Schedule",
      message: "Route changes effective next Monday",
      date: "2023-06-12",
      priority: "high",
    },
    {
      id: 2,
      title: "Meter Replacement",
      message: "10 meters to be replaced in Zone 4",
      date: "2023-06-10",
      priority: "medium",
    },
    {
      id: 3,
      title: "Safety Reminder",
      message: "Remember safety protocols during readings",
      date: "2023-06-08",
      priority: "low",
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
            {/* Summary Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              <div className="bg-white rounded-lg shadow p-6">
                <div className="flex items-center">
                  <Gauge className="h-6 w-6 text-blue-500 mr-2" />
                  <h3 className="text-gray-500 text-sm font-medium">
                    Readings This Week
                  </h3>
                </div>
                <p className="text-2xl font-bold">156</p>
                <p className="text-green-500 text-sm">+18% from last week</p>
              </div>
              <div className="bg-white rounded-lg shadow p-6">
                <div className="flex items-center">
                  <User className="h-6 w-6 text-green-500 mr-2" />
                  <h3 className="text-gray-500 text-sm font-medium">
                    Total Customers
                  </h3>
                </div>
                <p className="text-2xl font-bold">245</p>
                <div className="flex text-sm mt-1">
                  <span className="text-blue-500 mr-2">156 Read</span>
                  <span className="text-yellow-500">89 Pending</span>
                </div>
              </div>
              <div className="bg-white rounded-lg shadow p-6">
                <div className="flex items-center">
                  <AlertCircle className="h-6 w-6 text-red-500 mr-2" />
                  <h3 className="text-gray-500 text-sm font-medium">
                    Reported Issues
                  </h3>
                </div>
                <p className="text-2xl font-bold">12</p>
                <p className="text-sm mt-1">
                  <span className="text-green-500">8 Resolved</span>
                  <span className="text-red-500 ml-2">4 Pending</span>
                </p>
              </div>
              <div className="bg-white rounded-lg shadow p-6">
                <div className="flex items-center">
                  <Clock className="h-6 w-6 text-purple-500 mr-2" />
                  <h3 className="text-gray-500 text-sm font-medium">
                    Avg. Reading Time
                  </h3>
                </div>
                <p className="text-2xl font-bold">4.2 min</p>
                <p className="text-sm mt-1">
                  <span className="text-green-500">Faster than average</span>
                </p>
              </div>
            </div>

            {/* Charts Section */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
              <div className="bg-white rounded-lg shadow p-6">
                <h3 className="text-lg font-semibold mb-4">
                  Daily Readings This Week
                </h3>
                <Bar
                  data={weeklyReadingsData}
                  options={{
                    responsive: true,
                    scales: {
                      y: {
                        beginAtZero: true,
                        title: {
                          display: true,
                          text: "Number of Readings",
                        },
                      },
                    },
                  }}
                />
              </div>
              <div className="bg-white rounded-lg shadow p-6">
                <h3 className="text-lg font-semibold mb-4">
                  Reading Completion Status
                </h3>
                <Pie data={readingStatusData} options={{ responsive: true }} />
              </div>
            </div>

            {/* Tables Section */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
              <div className="bg-white rounded-lg shadow overflow-hidden">
                <div className="p-4 border-b">
                  <h3 className="text-lg font-semibold">Recent Readings</h3>
                </div>
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                          Customer
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                          Usage (kWh)
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                          Date
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                          Status
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {recentReadings.map((reading) => (
                        <tr key={reading.id}>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm font-medium text-gray-900">
                              {reading.customer}
                            </div>
                            <div className="text-sm text-gray-500">
                              {reading.address}
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm text-gray-900">
                              {reading.usage !== null ? (
                                reading.usage
                              ) : (
                                <span className="text-gray-400">-</span>
                              )}
                            </div>
                            <div className="text-xs text-gray-500">
                              {reading.previous} → {reading.current || "-"}
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {reading.date}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span
                              className={`px-2 py-1 rounded-full text-xs ${
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

              <div className="bg-white rounded-lg shadow overflow-hidden">
                <div className="p-4 border-b">
                  <h3 className="text-lg font-semibold">
                    Important Notifications
                  </h3>
                </div>
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                          Title
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                          Message
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                          Date
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                          Priority
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {importantNotifications.map((notification) => (
                        <tr key={notification.id}>
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                            {notification.title}
                          </td>
                          <td className="px-6 py-4 text-sm text-gray-500">
                            {notification.message}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {notification.date}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span
                              className={`px-2 py-1 rounded-full text-xs ${
                                notification.priority === "high"
                                  ? "bg-red-100 text-red-800"
                                  : notification.priority === "medium"
                                  ? "bg-yellow-100 text-yellow-800"
                                  : "bg-blue-100 text-blue-800"
                              }`}
                            >
                              {notification.priority}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </main>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-10">
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

export default MeterReader;
