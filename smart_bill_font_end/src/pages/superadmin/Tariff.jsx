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
} from "lucide-react";

function Tariff() {
  const location = useLocation();
  const { user, setUser, setToken, token } = useContext(AppContext);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [tariffs, setTariffs] = useState([]);
  const [search, setSearch] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [deleteTariffId, setDeleteTariffId] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [isEditMode, setIsEditMode] = useState(false);
  const [currentTariff, setCurrentTariff] = useState(null);
  const [filterDate, setFilterDate] = useState("");
  const [filterUnitMin, setFilterUnitMin] = useState("");
  const [filterUnitMax, setFilterUnitMax] = useState("");
  const [isLoading, setIsLoading] = useState(false);
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

  // Initialize new tariff with today's date and unit_min = 1, unit_max = 2
  const [newTariff, setNewTariff] = useState({
    tariff_name: "",
    unit_min: "1",
    unit_max: "2",
    price: "",
    effective_date: new Date().toISOString().split("T")[0],
  });

  useEffect(() => {
    async function fetchTariffs() {
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          setError("Please login to view tariffs");
          return;
        }

        const res = await fetch(`/api/tariff`, {
          headers: {
            Accept: "application/json",
            Authorization: `Bearer ${token}`,
          },
        });

        const data = await res.json();

        if (res.ok) {
          setTariffs(data);
        } else {
          setError(data.message || "Couldn't fetch tariffs");
        }
      } catch (error) {
        console.error("Error fetching tariffs:", error);
        setError("Network error while fetching tariffs");
      }
    }

    fetchTariffs();
  }, []);

  // When unit_min changes, update unit_max to be unit_min + 1
  const handleUnitMinChange = (value) => {
    const min = parseInt(value) || 0;
    setNewTariff((prev) => ({
      ...prev,
      unit_min: value,
      unit_max: (min + 1).toString(),
    }));
  };

  const filteredTariffs = tariffs.filter((t) => {
    const matchesSearch = t.tariff_name
      .toLowerCase()
      .includes(search.toLowerCase());
    const matchesDate =
      filterDate === "" ||
      new Date(t.effective_date).toISOString().split("T")[0] === filterDate;
    const matchesUnitMin =
      filterUnitMin === "" || t.unit_min >= parseFloat(filterUnitMin);
    const matchesUnitMax =
      filterUnitMax === "" || t.unit_max <= parseFloat(filterUnitMax);

    return matchesSearch && matchesDate && matchesUnitMin && matchesUnitMax;
  });

  const handleAddTariff = async (e) => {
    e.preventDefault();
    setError("");
    setMessage("");
    setIsLoading(true);

    try {
      const token = localStorage.getItem("token");
      if (!token) {
        setError("Please login to perform this action");
        return;
      }

      // Validate unit_max is greater than unit_min
      if (parseInt(newTariff.unit_max) <= parseInt(newTariff.unit_min)) {
        setError("Maximum units must be greater than minimum units");
        return;
      }

      const endpoint = isEditMode
        ? `/api/tariff/${currentTariff.id}`
        : `/api/tariff`;
      const method = isEditMode ? "PUT" : "POST";

      const res = await fetch(endpoint, {
        method,
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          ...newTariff,
          unit_min: parseInt(newTariff.unit_min),
          unit_max: parseInt(newTariff.unit_max),
        }),
      });

      const data = await res.json();

      if (res.ok) {
        if (isEditMode) {
          setTariffs(
            tariffs.map((t) => (t.id === currentTariff.id ? data.tariff : t))
          );
          setMessage(data.message || "Tariff updated successfully!");
        } else {
          setTariffs([...tariffs, data.tariff]);
          setMessage(data.message || "Tariff created successfully!");
        }
        resetForm();
        setIsModalOpen(false);
      } else {
        if (data.errors) {
          setError(data.errors);
        } else {
          setError(data.message || "Failed to process tariff");
        }
      }
    } catch (err) {
      console.error("Error:", err);
      setError("An error occurred while processing the tariff.");
    } finally {
      setIsLoading(false);
    }
  };

  const resetForm = () => {
    setNewTariff({
      tariff_name: "",
      unit_min: "1",
      unit_max: "2",
      price: "",
      effective_date: new Date().toISOString().split("T")[0],
    });
    setIsEditMode(false);
    setCurrentTariff(null);
    setError("");
  };

  useEffect(() => {
    if (message) {
      const timer = setTimeout(() => {
        setMessage("");
      }, 3000);

      return () => clearTimeout(timer);
    }
  }, [message]);

  const handleDelete = async () => {
    setIsLoading(true);
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        setError("Please login to perform this action");
        return;
      }

      const res = await fetch(`/api/tariff/${deleteTariffId}`, {
        method: "DELETE",
        headers: {
          Accept: "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await res.json();

      if (res.ok) {
        setTariffs(tariffs.filter((t) => t.id !== deleteTariffId));
        setMessage(data.message || "Tariff deleted successfully");
      } else {
        setError(data.message || "Failed to delete tariff");
      }
    } catch (err) {
      console.error("Error deleting tariff:", err);
      setError("An error occurred during deletion.");
    } finally {
      setDeleteModalOpen(false);
      setDeleteTariffId(null);
      setIsLoading(false);
    }
  };

  const handleEdit = (tariff) => {
    setCurrentTariff(tariff);
    setNewTariff({
      tariff_name: tariff.tariff_name,
      unit_min: tariff.unit_min.toString(),
      unit_max: (parseInt(tariff.unit_min) + 1).toString(),
      price: tariff.price.toString(),
      effective_date: tariff.effective_date.split("T")[0],
    });
    setIsEditMode(true);
    setIsModalOpen(true);
  };

  const clearFilters = () => {
    setSearch("");
    setFilterDate("");
    setFilterUnitMin("");
    setFilterUnitMax("");
  };
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
            <h2 className="text-3xl font-bold mb-4 text-center">
              Tariff Management
            </h2>
            <div className="flex justify-between items-center mb-6">
              <button
                onClick={() => {
                  resetForm();
                  setIsModalOpen(true);
                }}
                className="bg-blue-800 hover:bg-blue-600 text-white px-4 py-2 rounded cursor-pointer"
                disabled={isLoading}
              >
                {isLoading ? "Processing..." : "Add Tariff"}
              </button>

              <div className="flex items-center gap-2">
                <button
                  onClick={clearFilters}
                  className="bg-gray-300 hover:bg-gray-400 text-gray-800 px-3 py-2 rounded cursor-pointer text-sm"
                  disabled={isLoading}
                >
                  Clear Filters
                </button>
              </div>
            </div>

            {/* Filter Section */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Search by Name
                </label>
                <input
                  type="text"
                  placeholder="Tariff name"
                  className="w-full border p-2 rounded"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  disabled={isLoading}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Filter by Date
                </label>
                <input
                  type="date"
                  className="w-full border p-2 rounded"
                  value={filterDate}
                  onChange={(e) => setFilterDate(e.target.value)}
                  disabled={isLoading}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Min Units
                </label>
                <input
                  type="number"
                  placeholder="Minimum units"
                  className="w-full border p-2 rounded"
                  value={filterUnitMin}
                  onChange={(e) => setFilterUnitMin(e.target.value)}
                  disabled={isLoading}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Max Units
                </label>
                <input
                  type="number"
                  placeholder="Maximum units"
                  className="w-full border p-2 rounded"
                  value={filterUnitMax}
                  onChange={(e) => setFilterUnitMax(e.target.value)}
                  disabled={isLoading}
                />
              </div>
            </div>

            {message && (
              <div className="mb-4 p-3 bg-green-100 text-green-800 rounded">
                {message}
              </div>
            )}

            {error && (
              <div className="mb-4 p-3 bg-red-100 text-red-800 rounded">
                {typeof error === "object" ? (
                  Object.entries(error).map(([field, messages]) => (
                    <p key={field}>{messages[0]}</p>
                  ))
                ) : (
                  <p>{error}</p>
                )}
              </div>
            )}

            <div className="overflow-x-auto bg-white rounded-lg shadow">
              <table className="w-full border border-gray-200">
                <thead className="bg-gray-100">
                  <tr>
                    <th className="text-left py-3 px-4 border-b">#</th>
                    <th className="text-left py-3 px-4 border-b">Name</th>
                    <th className="text-left py-3 px-4 border-b">Min Units</th>
                    <th className="text-left py-3 px-4 border-b">Max Units</th>
                    <th className="text-left py-3 px-4 border-b">Price (₦)</th>
                    <th className="text-left py-3 px-4 border-b">
                      Effective Date
                    </th>
                    <th className="text-left py-3 px-4 border-b">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredTariffs.length > 0 ? (
                    filteredTariffs.map((t, index) => (
                      <tr key={t.id} className="hover:bg-gray-50">
                        <td className="py-3 px-4 border-b">{index + 1}</td>
                        <td className="py-3 px-4 border-b">{t.tariff_name}</td>
                        <td className="py-3 px-4 border-b">{t.unit_min}</td>
                        <td className="py-3 px-4 border-b">{t.unit_max}</td>
                        <td className="py-3 px-4 border-b">{t.price}</td>
                        <td className="py-3 px-4 border-b">
                          {new Date(t.effective_date).toLocaleDateString()}
                        </td>
                        <td className="py-3 px-4 border-b space-x-2">
                          <button
                            type="button"
                            className="text-blue-600 hover:underline"
                            onClick={() => handleEdit(t)}
                            disabled={isLoading}
                          >
                            Edit
                          </button>
                          <button
                            type="button"
                            className="text-red-600 hover:underline"
                            onClick={() => {
                              setDeleteTariffId(t.id);
                              setDeleteModalOpen(true);
                            }}
                            disabled={isLoading}
                          >
                            Delete
                          </button>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td
                        colSpan="7"
                        className="text-center py-4 text-gray-500"
                      >
                        {isLoading ? "Loading..." : "No tariffs found."}
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
            Ethiopia. We aim to provide accurate billing, transparent services,
            and an improved customer experience.
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

      {/* Delete Tariff Modal */}
      {deleteModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg w-full max-w-md">
            <h3 className="text-lg font-semibold mb-4">Delete Tariff</h3>
            <p className="mb-4">
              Are you sure you want to delete this tariff? This action cannot be
              undone.
            </p>
            <div className="flex justify-end gap-4">
              <button
                onClick={() => setDeleteModalOpen(false)}
                className="bg-gray-300 px-4 py-2 rounded cursor-pointer"
                disabled={isLoading}
              >
                Cancel
              </button>
              <button
                onClick={handleDelete}
                className="bg-red-600 text-white px-4 py-2 rounded cursor-pointer"
                disabled={isLoading}
              >
                {isLoading ? "Deleting..." : "Confirm Delete"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Add/Edit Tariff Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg w-full max-w-md relative">
            <button
              className="absolute top-2 right-2 text-gray-500 hover:text-red-600 cursor-pointer"
              onClick={() => {
                setIsModalOpen(false);
                resetForm();
              }}
              disabled={isLoading}
            >
              <i className="fas fa-times"></i>
            </button>
            <h3 className="text-xl font-bold mb-4">
              {isEditMode ? "Edit Tariff" : "Add New Tariff"}
            </h3>
            <form onSubmit={handleAddTariff} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Tariff Name*
                </label>
                <input
                  type="text"
                  placeholder="Tariff Name"
                  value={newTariff.tariff_name}
                  onChange={(e) =>
                    setNewTariff({ ...newTariff, tariff_name: e.target.value })
                  }
                  className="w-full border p-2 rounded"
                  required
                  disabled={isLoading}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Minimum Units*
                  </label>
                  <input
                    type="number"
                    min="1"
                    placeholder="1"
                    value={newTariff.unit_min}
                    onChange={(e) => handleUnitMinChange(e.target.value)}
                    className="w-full border p-2 rounded"
                    required
                    disabled={isLoading}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Maximum Units*
                  </label>
                  <input
                    type="number"
                    min={parseInt(newTariff.unit_min) + 1}
                    placeholder="2"
                    value={newTariff.unit_max}
                    onChange={(e) =>
                      setNewTariff({ ...newTariff, unit_max: e.target.value })
                    }
                    className="w-full border p-2 rounded"
                    required
                    disabled={isLoading}
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Price (₦)*
                </label>
                <input
                  type="number"
                  step="0.01"
                  min="0"
                  placeholder="0.00"
                  value={newTariff.price}
                  onChange={(e) =>
                    setNewTariff({ ...newTariff, price: e.target.value })
                  }
                  className="w-full border p-2 rounded"
                  required
                  disabled={isLoading}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Effective Date*
                </label>
                <input
                  type="date"
                  min={new Date().toISOString().split("T")[0]}
                  value={newTariff.effective_date}
                  onChange={(e) =>
                    setNewTariff({
                      ...newTariff,
                      effective_date: e.target.value,
                    })
                  }
                  className="w-full border p-2 rounded"
                  required
                  disabled={isLoading}
                />
              </div>

              <div className="flex justify-end gap-4 pt-4">
                <button
                  type="button"
                  onClick={() => {
                    setIsModalOpen(false);
                    resetForm();
                  }}
                  className="bg-gray-300 px-4 py-2 rounded cursor-pointer"
                  disabled={isLoading}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="bg-blue-600 text-white px-4 py-2 rounded cursor-pointer"
                  disabled={isLoading}
                >
                  {isLoading ? "Processing..." : isEditMode ? "Update" : "Save"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default Tariff;
