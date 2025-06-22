import React, { useContext, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { AppContext } from "../context/AppContext";
import {
  HomeIcon,
  Users2,
  DollarSignIcon,
  BellDotIcon,
  FileTextIcon,
  ActivityIcon,
} from "lucide-react";
import { Bar, Pie } from "react-chartjs-2";
import { Chart as ChartJS, registerables } from "chart.js";

ChartJS.register(...registerables);

function SuperAdmin() {
  const location = useLocation();
  const { user, token, setUser, setToken } = useContext(AppContext);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const nav = useNavigate();
  const menuItems = [
    { name: "Home", icon: <HomeIcon size={18} />, path: "/index" },
    { name: "Users", icon: <Users2 size={18} />, path: "/users" },
    { name: "Tariff", icon: <DollarSignIcon size={18} />, path: "/tariff" },
    {
      name: "Notifications",
      icon: <BellDotIcon size={18} />,
      path: "/notifications",
    },
    { name: "Report", icon: <FileTextIcon size={18} />, path: "/report" },
    { name: "Tracking", icon: <ActivityIcon size={18} />, path: "/tracking" },
  ];

  // Sample data for charts and tables
  const paymentData = {
    labels: ["Jan", "Feb", "Mar", "Apr", "May", "Jun"],
    datasets: [
      {
        label: "Payments (₦)",
        data: [120000, 190000, 150000, 180000, 210000, 230000],
        backgroundColor: "rgba(54, 162, 235, 0.5)",
        borderColor: "rgba(54, 162, 235, 1)",
        borderWidth: 1,
      },
    ],
  };

  const userDistributionData = {
    labels: ["Admins", "Meter Readers", "Customers"],
    datasets: [
      {
        data: [5, 12, 850],
        backgroundColor: [
          "rgba(255, 99, 132, 0.5)",
          "rgba(54, 162, 235, 0.5)",
          "rgba(255, 206, 86, 0.5)",
        ],
        borderColor: [
          "rgba(255, 99, 132, 1)",
          "rgba(54, 162, 235, 1)",
          "rgba(255, 206, 86, 1)",
        ],
        borderWidth: 1,
      },
    ],
  };

  const reportData = [
    { id: 1, type: "Billing Issue", status: "Resolved", date: "2023-05-15" },
    { id: 2, type: "Meter Fault", status: "Pending", date: "2023-06-02" },
    {
      id: 3,
      type: "Payment Dispute",
      status: "In Progress",
      date: "2023-06-10",
    },
    { id: 4, type: "New Connection", status: "Resolved", date: "2023-05-28" },
    { id: 5, type: "Leakage", status: "Pending", date: "2023-06-18" },
  ];

  const paymentTableData = [
    {
      id: 1,
      customer: "John Doe",
      amount: "₦12,500",
      date: "2023-06-01",
      method: "Bank Transfer",
    },
    {
      id: 2,
      customer: "Jane Smith",
      amount: "₦8,750",
      date: "2023-06-05",
      method: "Card",
    },
    {
      id: 3,
      customer: "Robert Johnson",
      amount: "₦15,200",
      date: "2023-06-08",
      method: "Bank Transfer",
    },
    {
      id: 4,
      customer: "Emily Davis",
      amount: "₦9,300",
      date: "2023-06-12",
      method: "Mobile Money",
    },
    {
      id: 5,
      customer: "Michael Brown",
      amount: "₦11,000",
      date: "2023-06-15",
      method: "Card",
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
              className="bg-gray-800 text-white p-2 rounded hover:bg-gray-700 transition"
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
                    className="block px-4 py-2 hover:bg-gray-100 text-gray-800 cursor-pointer"
                  >
                    Profile
                  </Link>
                  <form onSubmit={handleLogout}>
                    <button className="w-full text-left px-4 py-2 hover:bg-gray-100 text-gray-800 cursor-pointer">
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
                <h3 className="text-gray-500 text-sm font-medium">
                  Total Payments
                </h3>
                <p className="text-2xl font-bold">₦1,245,000</p>
                <p className="text-green-500 text-sm">+12% from last month</p>
              </div>
              <div className="bg-white rounded-lg shadow p-6">
                <h3 className="text-gray-500 text-sm font-medium">
                  Total Users
                </h3>
                <p className="text-2xl font-bold">867</p>
                <div className="flex text-sm mt-1">
                  <span className="text-red-500 mr-2">5 Admins</span>
                  <span className="text-blue-500 mr-2">12 Meter Readers</span>
                  <span className="text-yellow-500">850 Customers</span>
                </div>
              </div>
              <div className="bg-white rounded-lg shadow p-6">
                <h3 className="text-gray-500 text-sm font-medium">
                  Total Reports
                </h3>
                <p className="text-2xl font-bold">124</p>
                <p className="text-sm mt-1">
                  <span className="text-green-500">98 Resolved</span>
                  <span className="text-red-500 ml-2">26 Pending</span>
                </p>
              </div>
              <div className="bg-white rounded-lg shadow p-6">
                <h3 className="text-gray-500 text-sm font-medium">
                  Active Customers
                </h3>
                <p className="text-2xl font-bold">789</p>
                <p className="text-sm mt-1">
                  <span className="text-green-500">92% Active</span>
                  <span className="text-gray-500 ml-2">8% Inactive</span>
                </p>
              </div>
            </div>

            {/* Charts Section */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
              <div className="bg-white rounded-lg shadow p-6">
                <h3 className="text-lg font-semibold mb-4">Monthly Payments</h3>
                <Bar data={paymentData} options={{ responsive: true }} />
              </div>
              <div className="bg-white rounded-lg shadow p-6">
                <h3 className="text-lg font-semibold mb-4">
                  User Distribution
                </h3>
                <Pie
                  data={userDistributionData}
                  options={{ responsive: true }}
                />
              </div>
            </div>

            {/* Tables Section */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
              <div className="bg-white rounded-lg shadow overflow-hidden">
                <div className="p-4 border-b">
                  <h3 className="text-lg font-semibold">Recent Payments</h3>
                </div>
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                          Customer
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                          Amount
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                          Date
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                          Method
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {paymentTableData.map((payment) => (
                        <tr key={payment.id}>
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                            {payment.customer}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {payment.amount}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {payment.date}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {payment.method}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              <div className="bg-white rounded-lg shadow overflow-hidden">
                <div className="p-4 border-b">
                  <h3 className="text-lg font-semibold">Recent Reports</h3>
                </div>
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                          Type
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                          Status
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                          Date
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {reportData.map((report) => (
                        <tr key={report.id}>
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                            {report.type}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            <span
                              className={`px-2 py-1 rounded-full text-xs ${
                                report.status === "Resolved"
                                  ? "bg-green-100 text-green-800"
                                  : report.status === "Pending"
                                  ? "bg-red-100 text-red-800"
                                  : "bg-yellow-100 text-yellow-800"
                              }`}
                            >
                              {report.status}
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {report.date}
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
          <h3 className="text-2xl font-bold mb-4">
            Ethiopia Electricity Billing System
          </h3>
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
              <strong className="px-1">
                Ethiopia Electricity Billing System
              </strong>
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

export default SuperAdmin;
