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
  Mail,
  DollarSign,
  Clock,
  CheckCircle,
  AlertCircle,
} from "lucide-react";
import { Bar, Pie, Line } from "react-chartjs-2";
import { Chart as ChartJS, registerables } from "chart.js";

ChartJS.register(...registerables);

function Admin() {
  const location = useLocation();
  const { user, token, setUser, setToken } = useContext(AppContext);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [customers, setCustomers] = useState([]);
  const [bills, setBills] = useState([]);
  const [notifications, setNotifications] = useState([]);
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);
  const nav = useNavigate();

  // Fetch all data on component mount
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [custRes, billsRes, notifRes, reportsRes] = await Promise.all([
          fetch("/api/customers", {
            headers: { Authorization: `Bearer ${token}` },
          }),
          fetch("/api/bills", {
            headers: { Authorization: `Bearer ${token}` },
          }),
          fetch("/api/notifications", {
            headers: { Authorization: `Bearer ${token}` },
          }),
          fetch("/api/reports", {
            headers: { Authorization: `Bearer ${token}` },
          }),
        ]);

        const [custData, billsData, notifData, reportsData] = await Promise.all(
          [custRes.json(), billsRes.json(), notifRes.json(), reportsRes.json()]
        );

        if (custRes.ok) setCustomers(custData);
        if (billsRes.ok) setBills(billsData);
        if (notifRes.ok) setNotifications(notifData);
        if (reportsRes.ok) setReports(reportsData);
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [token]);

  const menuItems = [
    { name: "Home", icon: <HomeIcon size={18} />, path: "/index" },
    { name: "Customer", icon: <User size={18} />, path: "/customer_admin" },
    { name: "Report", icon: <FileTextIcon size={18} />, path: "/report_admin" },
    { name: "Bill", icon: <DollarSign size={18} />, path: "/bill" },
    {
      name: "Notification",
      icon: <Mail size={18} />,
      path: "/notification_admin",
    },
  ];

  async function handleLogout(e) {
    e.preventDefault();
    const res = await fetch("/api/logout", {
      method: "POST",
      headers: { Authorization: `Bearer ${token}` },
    });

    if (res.ok) {
      setUser(null);
      setToken(null);
      localStorage.removeItem("token");
      nav("/");
    }
  }

  // Chart data configurations
  const customerStatusData = {
    labels: ["Active", "Inactive", "Overdue"],
    datasets: [
      {
        data: [
          customers.filter((c) => c.status === "active").length,
          customers.filter((c) => c.status === "inactive").length,
          customers.filter((c) => c.status === "overdue").length,
        ],
        backgroundColor: ["#10B981", "#F59E0B", "#EF4444"],
      },
    ],
  };

  const billingTrendsData = {
    labels: ["Jan", "Feb", "Mar", "Apr", "May", "Jun"],
    datasets: [
      {
        label: "Total Billing (ETB)",
        data: [120000, 135000, 142000, 155000, 148000, 160000],
        borderColor: "#3B82F6",
        backgroundColor: "rgba(59, 130, 246, 0.1)",
        tension: 0.3,
      },
    ],
  };

  const notificationTypesData = {
    labels: ["Billing", "Outage", "Maintenance", "Payment"],
    datasets: [
      {
        data: [
          notifications.filter((n) => n.type === "billing").length,
          notifications.filter((n) => n.type === "outage").length,
          notifications.filter((n) => n.type === "maintenance").length,
          notifications.filter((n) => n.type === "payment").length,
        ],
        backgroundColor: ["#3B82F6", "#EF4444", "#10B981", "#F59E0B"],
      },
    ],
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
            {loading ? (
              <div className="flex justify-center items-center h-64">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
              </div>
            ) : (
              <>
                {/* Dashboard Overview */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                  <DashboardCard
                    title="Total Customers"
                    value={customers.length}
                    icon={<User className="h-6 w-6 text-blue-500" />}
                  />
                  <DashboardCard
                    title="Total Bills"
                    value={bills.length}
                    icon={<DollarSign className="h-6 w-6 text-green-500" />}
                  />
                  <DashboardCard
                    title="Revenue (ETB)"
                    value={bills
                      .reduce((sum, bill) => sum + bill.amount, 0)
                      .toLocaleString()}
                    icon={<ActivityIcon className="h-6 w-6 text-purple-500" />}
                  />
                  <DashboardCard
                    title="Notifications"
                    value={notifications.length}
                    icon={<BellDotIcon className="h-6 w-6 text-yellow-500" />}
                  />
                </div>

                {/* Charts Section */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
                  <ChartCard title="Billing Trends">
                    <Line
                      data={billingTrendsData}
                      options={{ responsive: true }}
                    />
                  </ChartCard>
                  <ChartCard title="Customer Status">
                    <Pie
                      data={customerStatusData}
                      options={{ responsive: true }}
                    />
                  </ChartCard>
                </div>

                {/* Recent Data Tables */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
                  <DataTable
                    title="Recent Customers"
                    data={customers.slice(0, 5)}
                    columns={[
                      { header: "Name", accessor: "name" },
                      { header: "Meter No", accessor: "meter_number" },
                      {
                        header: "Status",
                        accessor: "status",
                        render: (value) => (
                          <span
                            className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                              value === "active"
                                ? "bg-green-100 text-green-800"
                                : value === "inactive"
                                ? "bg-red-100 text-red-800"
                                : "bg-yellow-100 text-yellow-800"
                            }`}
                          >
                            {value}
                          </span>
                        ),
                      },
                    ]}
                  />
                  <DataTable
                    title="Recent Bills"
                    data={bills.slice(0, 5)}
                    columns={[
                      { header: "Bill No", accessor: "bill_number" },
                      { header: "Customer", accessor: "customer_name" },
                      {
                        header: "Amount (ETB)",
                        accessor: "amount",
                        render: (value) => value.toLocaleString(),
                      },
                      {
                        header: "Status",
                        accessor: "payment_status",
                        render: (value) => (
                          <span
                            className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                              value === "paid"
                                ? "bg-green-100 text-green-800"
                                : value === "unpaid"
                                ? "bg-red-100 text-red-800"
                                : "bg-yellow-100 text-yellow-800"
                            }`}
                          >
                            {value}
                          </span>
                        ),
                      },
                    ]}
                  />
                </div>

                {/* Notifications and Reports */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <DataTable
                    title="Recent Notifications"
                    data={notifications.slice(0, 5)}
                    columns={[
                      {
                        header: "Type",
                        accessor: "type",
                        render: (value) => (
                          <span
                            className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                              value === "billing"
                                ? "bg-blue-100 text-blue-800"
                                : value === "outage"
                                ? "bg-red-100 text-red-800"
                                : value === "maintenance"
                                ? "bg-green-100 text-green-800"
                                : "bg-yellow-100 text-yellow-800"
                            }`}
                          >
                            {value}
                          </span>
                        ),
                      },
                      {
                        header: "Message",
                        accessor: "message",
                        render: (value) => value.substring(0, 50) + "...",
                      },
                      {
                        header: "Date",
                        accessor: "created_at",
                        render: (value) => new Date(value).toLocaleDateString(),
                      },
                    ]}
                    footer={
                      <div className="w-32 mx-auto mt-4">
                        <Pie
                          data={notificationTypesData}
                          options={{ responsive: true }}
                        />
                      </div>
                    }
                  />
                  <DataTable
                    title="Recent Reports"
                    data={reports.slice(0, 5)}
                    columns={[
                      { header: "Title", accessor: "title" },
                      { header: "Type", accessor: "type" },
                      {
                        header: "Status",
                        accessor: "status",
                        render: (value) => (
                          <span
                            className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                              value === "completed"
                                ? "bg-green-100 text-green-800"
                                : value === "pending"
                                ? "bg-yellow-100 text-yellow-800"
                                : "bg-red-100 text-red-800"
                            }`}
                          >
                            {value}
                          </span>
                        ),
                      },
                      {
                        header: "Date",
                        accessor: "created_at",
                        render: (value) => new Date(value).toLocaleDateString(),
                      },
                    ]}
                  />
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
            Ethiopia.
          </p>
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

// Reusable components
function DashboardCard({ title, value, icon }) {
  return (
    <div className="bg-white p-6 rounded-lg shadow flex items-start">
      <div className="mr-4 p-2 bg-gray-100 rounded-full">{icon}</div>
      <div>
        <h3 className="font-medium text-gray-500">{title}</h3>
        <p className="text-3xl font-bold">{value}</p>
      </div>
    </div>
  );
}

function ChartCard({ title, children }) {
  return (
    <div className="bg-white p-6 rounded-lg shadow">
      <h3 className="text-lg font-semibold mb-4">{title}</h3>
      <div className="h-64">{children}</div>
    </div>
  );
}

function DataTable({ title, data, columns, footer }) {
  return (
    <div className="bg-white rounded-lg shadow">
      <div className="p-4 border-b">
        <h3 className="text-lg font-semibold">{title}</h3>
      </div>
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              {columns.map((column, index) => (
                <th
                  key={index}
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  {column.header}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {data.map((item, rowIndex) => (
              <tr key={rowIndex}>
                {columns.map((column, colIndex) => (
                  <td
                    key={colIndex}
                    className="px-6 py-4 whitespace-nowrap text-sm text-gray-500"
                  >
                    {column.render
                      ? column.render(item[column.accessor])
                      : item[column.accessor]}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {footer && <div className="p-4 border-t">{footer}</div>}
    </div>
  );
}

export default Admin;
