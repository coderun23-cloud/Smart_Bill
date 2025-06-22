import React, { useContext, useEffect, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { AppContext } from "../context/AppContext";
import {
  HomeIcon,
  Users2,
  DollarSignIcon,
  BellDotIcon,
  FileTextIcon,
  ActivityIcon,
  SearchIcon,
  FilterIcon,
} from "lucide-react";

function Report() {
  const location = useLocation();
  const nav = useNavigate();
  const { user, token, setToken, setUser } = useContext(AppContext);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [reports, setReports] = useState([]);
  const [filteredReports, setFilteredReports] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [roleFilter, setRoleFilter] = useState("all");
  const [isLoading, setIsLoading] = useState(true);

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

  useEffect(() => {
    async function fetchReports() {
      try {
        setIsLoading(true);
        const res = await fetch("/api/report", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        const data = await res.json();
        if (res.ok) {
          setReports(data);
          setFilteredReports(data);
        }
      } catch (error) {
        console.error("Error fetching reports:", error);
      } finally {
        setIsLoading(false);
      }
    }

    fetchReports();
  }, [token]);

  useEffect(() => {
    const filtered = reports.filter((report) => {
      // Search filter
      const matchesSearch =
        searchTerm === "" ||
        report.content.toLowerCase().includes(searchTerm.toLowerCase()) ||
        report.sender?.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        report.report_type.toLowerCase().includes(searchTerm.toLowerCase());

      // Role filter
      const matchesRole =
        roleFilter === "all" ||
        report.sender?.role?.toLowerCase() === roleFilter.toLowerCase();

      return matchesSearch && matchesRole;
    });

    setFilteredReports(filtered);
  }, [searchTerm, roleFilter, reports]);

  const uniqueRoles = [
    "all",
    ...new Set(reports.map((report) => report.sender?.role).filter(Boolean)),
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
                  <button
                    onClick={handleLogout}
                    className="w-full text-left px-4 py-2 hover:bg-gray-100 text-gray-800 cursor-pointer"
                  >
                    Logout
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* Page Content */}
          <main className="flex-1 p-6 bg-gray-50">
            <h2 className="text-2xl font-bold mb-6">Report Summary</h2>

            {/* Filters */}
            <div className="mb-6 grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <SearchIcon className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type="text"
                  placeholder="Search by content, name or type..."
                  className="pl-10 w-full border p-2 rounded"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>

              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <FilterIcon className="h-5 w-5 text-gray-400" />
                </div>
                <select
                  className="pl-10 w-full border p-2 rounded bg-white"
                  value={roleFilter}
                  onChange={(e) => setRoleFilter(e.target.value)}
                >
                  {uniqueRoles.map((role) => (
                    <option key={role} value={role}>
                      {role === "all" ? "All Roles" : role}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Reports Table */}
            <div className="overflow-x-auto bg-white rounded-lg shadow">
              <table className="w-full border border-gray-200">
                <thead className="bg-gray-100">
                  <tr>
                    <th className="text-left py-3 px-4 border-b">#</th>
                    <th className="text-left py-3 px-4 border-b">
                      Report Type
                    </th>
                    <th className="text-left py-3 px-4 border-b">Content</th>
                    <th className="text-left py-3 px-4 border-b">
                      Sender Name
                    </th>
                    <th className="text-left py-3 px-4 border-b">
                      Sender Role
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {isLoading ? (
                    <tr>
                      <td colSpan="5" className="text-center py-4">
                        <div className="flex justify-center">
                          <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500"></div>
                        </div>
                      </td>
                    </tr>
                  ) : filteredReports.length > 0 ? (
                    filteredReports.map((report, index) => (
                      <tr key={index} className="hover:bg-gray-50">
                        <td className="py-3 px-4 border-b">{index + 1}</td>
                        <td className="py-3 px-4 border-b">
                          {report.report_type}
                        </td>
                        <td className="py-3 px-4 border-b">{report.content}</td>
                        <td className="py-3 px-4 border-b">
                          {report.sender?.name || "N/A"}
                        </td>
                        <td className="py-3 px-4 border-b">
                          {report.sender?.role || "N/A"}
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td
                        colSpan="5"
                        className="text-center py-4 text-gray-500"
                      >
                        No reports found matching your criteria.
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
      <footer className="bg-gray-900 text-white py-8 mt-80">
        <div className="container mx-auto px-4 text-center">
          <h3 className="text-2xl font-bold mb-4">
            Ethiopia Electricity Billing System
          </h3>
          <p className="max-w-2xl mx-auto mb-6 text-gray-300">
            A reliable and efficient system for managing electricity billing in
            Ethiopia.
          </p>

          <div className="flex justify-center space-x-4 mb-6">
            <a href="#" className="hover:text-blue-400 transition">
              <i className="fab fa-twitter text-xl"></i>
            </a>
            <a href="#" className="hover:text-blue-600 transition">
              <i className="fab fa-facebook text-xl"></i>
            </a>
            <a href="#" className="hover:text-pink-500 transition">
              <i className="fab fa-instagram text-xl"></i>
            </a>
            <a href="#" className="hover:text-blue-300 transition">
              <i className="fab fa-skype text-xl"></i>
            </a>
            <a href="#" className="hover:text-blue-500 transition">
              <i className="fab fa-linkedin text-xl"></i>
            </a>
          </div>

          <div className="text-sm text-gray-400">
            <div className="mb-2">
              <span>Copyright © {new Date().getFullYear()} </span>
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

export default Report;
