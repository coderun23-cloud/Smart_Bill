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

function Users() {
  const location = useLocation();
  const { user, token, setUser, setToken } = useContext(AppContext);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [users, setUsers] = useState([]);
  const [search, setSearch] = useState("");
  const [roleFilter, setRoleFilter] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [deleteUserId, setDeleteUserId] = useState(null);
  const [deleteReason, setDeleteReason] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
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

  const [newUser, setNewUser] = useState({
    name: "",
    email: "",
    role: "",
    password: "",
    password_confirmation: "",
    address: "",
    phone_number: "",
    image: null,
  });

  useEffect(() => {
    async function fetchUsers() {
      try {
        const res = await fetch("/api/users");
        const data = await res.json();
        if (res.ok) {
          setUsers(data);
        } else {
          alert("Couldn't fetch users");
        }
      } catch (error) {
        console.error("Error fetching users:", error);
      }
    }

    fetchUsers();
  }, []);

  const filteredUsers = users.filter((u) => {
    const matchesSearch =
      u.name.toLowerCase().includes(search.toLowerCase()) ||
      u.email.toLowerCase().includes(search.toLowerCase());

    const matchesRole = roleFilter === "" || u.role === roleFilter;

    return matchesSearch && matchesRole;
  });

  const handlePhoneChange = (e) => {
    let value = e.target.value;

    // Remove all non-digit characters
    value = value.replace(/\D/g, "");

    // Ensure it starts with 251
    if (!value.startsWith("251") && value.length > 0) {
      value = "251" + value;
    }

    // Limit to 12 digits (251 + 9 digits)
    if (value.length > 12) {
      value = value.substring(0, 12);
    }

    setNewUser({ ...newUser, phone_number: value });
  };

  const validatePhoneNumber = () => {
    if (!newUser.phone_number) {
      setError("Phone number is required");
      return false;
    }

    if (!/^251\d{9}$/.test(newUser.phone_number)) {
      setError("Phone number must start with 251 followed by 9 digits");
      return false;
    }

    return true;
  };

  const handleAddUser = async (e) => {
    e.preventDefault();
    setError({});

    // Validate phone number
    if (!validatePhoneNumber()) {
      return;
    }

    try {
      const res = await fetch("/api/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(newUser),
      });
      const data = await res.json();

      if (res.ok) {
        setUsers([...users, data.user]);
        setNewUser({
          name: "",
          email: "",
          role: "",
          password: "",
          password_confirmation: "",
          address: "",
          phone_number: "",
          image: null,
        });
        setMessage("User created successfully!");
        setIsModalOpen(false);
      } else if (data.errors) {
        setError(data.errors);
      } else {
        setMessage(data.message || "Failed to add user");
      }
    } catch (err) {
      console.error("Error:", err);
      setMessage("An error occurred while adding the user.");
    }
  };

  useEffect(() => {
    if (message) {
      const timer = setTimeout(() => {
        setMessage("");
      }, 2000);

      return () => clearTimeout(timer);
    }
  }, [message]);

  const handleDelete = async () => {
    try {
      const res = await fetch(`/api/profile/${deleteUserId}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ reason: deleteReason }),
      });

      const data = await res.json();

      if (res.ok) {
        setUsers(users.filter((u) => u.id !== deleteUserId));
        setMessage("User deleted successfully");
      } else {
        setError(data.message || "Failed to delete user");
      }
    } catch (err) {
      console.error("Error deleting user:", err);
      setError("An error occurred during deletion.");
    } finally {
      setDeleteModalOpen(false);
      setDeleteUserId(null);
      setDeleteReason("");
    }
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
              User Management
            </h2>
            <div className="flex justify-between items-center mb-6">
              <button
                onClick={() => setIsModalOpen(true)}
                className="bg-blue-800 hover:bg-blue-600 text-white px-4 py-2 rounded cursor-pointer"
              >
                Add User
              </button>

              <div className="flex gap-4">
                <input
                  type="text"
                  placeholder="Search by name or email"
                  className="border border-gray-300 p-2 rounded w-64"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                />

                <select
                  className="border border-gray-300 p-2 rounded w-32"
                  value={roleFilter}
                  onChange={(e) => setRoleFilter(e.target.value)}
                >
                  <option value="">All Roles</option>
                  <option value="admin">Admin</option>
                  <option value="meterreader">Meter Reader</option>
                </select>
              </div>
            </div>

            {message && (
              <div className="mb-4 p-3 bg-green-100 text-green-800 rounded">
                {message}
              </div>
            )}

            <div className="overflow-x-auto bg-white rounded-lg shadow">
              <table className="w-full border border-gray-200">
                <thead className="bg-gray-100">
                  <tr>
                    <th className="text-left py-3 px-4 border-b">#</th>
                    <th className="text-left py-3 px-4 border-b">Name</th>
                    <th className="text-left py-3 px-4 border-b">Email</th>
                    <th className="text-left py-3 px-4 border-b">Role</th>
                    <th className="text-left py-3 px-4 border-b">Address</th>
                    <th className="text-left py-3 px-4 border-b">
                      Phone Number
                    </th>
                    <th className="text-left py-3 px-4 border-b">Action</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredUsers.length > 0 ? (
                    filteredUsers.map((u, index) => (
                      <tr key={u.id} className="hover:bg-gray-50">
                        <td className="py-3 px-4 border-b">{index + 1}</td>
                        <td className="py-3 px-4 border-b">{u.name}</td>
                        <td className="py-3 px-4 border-b">{u.email}</td>
                        <td className="py-3 px-4 border-b capitalize">
                          {u.role}
                        </td>
                        <td className="py-3 px-4 border-b">{u.address}</td>
                        <td className="py-3 px-4 border-b">{u.phone_number}</td>
                        <td className="py-3 px-4 border-b">
                          <button
                            type="button"
                            className="text-red-600 hover:underline"
                            onClick={() => {
                              setDeleteUserId(u.id);
                              setDeleteModalOpen(true);
                            }}
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
                        No users found.
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

      {/* Delete User Modal */}
      {deleteModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg w-full max-w-md">
            <h3 className="text-lg font-semibold mb-4">Delete User</h3>
            <p className="mb-2">
              Please enter a reason for deleting this user:
            </p>
            <textarea
              value={deleteReason}
              onChange={(e) => setDeleteReason(e.target.value)}
              className="w-full border p-2 rounded mb-4"
              placeholder="Enter reason..."
              rows={4}
            />
            <div className="flex justify-end gap-4">
              <button
                onClick={() => setDeleteModalOpen(false)}
                className="bg-gray-300 px-4 py-2 rounded cursor-pointer"
              >
                Cancel
              </button>
              <button
                onClick={handleDelete}
                className="bg-red-600 text-white px-4 py-2 rounded cursor-pointer"
                disabled={!deleteReason.trim()}
              >
                Confirm Delete
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Add User Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg w-full max-w-md relative">
            <button
              className="absolute top-2 right-2 text-gray-500 hover:text-red-600 cursor-pointer"
              onClick={() => setIsModalOpen(false)}
            >
              <i className="fas fa-times"></i>
            </button>
            <h3 className="text-xl font-bold mb-4">Add New User</h3>
            <form onSubmit={handleAddUser} className="space-y-3">
              <input
                type="text"
                placeholder="Name"
                value={newUser.name}
                onChange={(e) =>
                  setNewUser({ ...newUser, name: e.target.value })
                }
                className="w-full border p-2 rounded"
                required
              />
              {error.name && (
                <p className="text-red-500 text-sm mt-1">{error.name[0]}</p>
              )}
              <input
                type="email"
                placeholder="Email"
                value={newUser.email}
                onChange={(e) =>
                  setNewUser({ ...newUser, email: e.target.value })
                }
                className="w-full border p-2 rounded"
                required
              />
              {error.email && (
                <p className="text-red-500 text-sm mt-1">{error.email[0]}</p>
              )}
              <input
                type="password"
                placeholder="Password"
                value={newUser.password}
                onChange={(e) =>
                  setNewUser({ ...newUser, password: e.target.value })
                }
                className="w-full border p-2 rounded"
                required
              />
              {error.password && (
                <p className="text-red-500 text-sm mt-1">{error.password[0]}</p>
              )}
              <input
                type="password"
                placeholder="Confirm Password"
                value={newUser.password_confirmation}
                onChange={(e) =>
                  setNewUser({
                    ...newUser,
                    password_confirmation: e.target.value,
                  })
                }
                className="w-full border p-2 rounded"
                required
              />
              <select
                value={newUser.role}
                onChange={(e) =>
                  setNewUser({ ...newUser, role: e.target.value })
                }
                className="w-full border p-2 rounded"
                required
              >
                <option value="">Select Role</option>
                <option value="admin">Admin</option>
                <option value="meterreader">Meter Reader</option>
              </select>
              {error.role && (
                <p className="text-red-500 text-sm mt-1">{error.role[0]}</p>
              )}
              <input
                type="text"
                placeholder="Address"
                value={newUser.address}
                onChange={(e) =>
                  setNewUser({ ...newUser, address: e.target.value })
                }
                className="w-full border p-2 rounded"
              />
              {error.address && (
                <p className="text-red-500 text-sm mt-1">{error.address[0]}</p>
              )}
              <input
                type="tel"
                placeholder="251XXXXXXXXX"
                value={newUser.phone_number}
                onChange={handlePhoneChange}
                className="w-full border p-2 rounded"
                required
              />
              {error.phone_number && (
                <p className="text-red-500 text-sm mt-1">
                  {error.phone_number[0]}
                </p>
              )}
              {error.phone_number && (
                <p className="text-red-500 text-sm mt-1">
                  {error.phone_number[0]}
                </p>
              )}
              <p className="text-xs text-gray-500 mt-1">
                Format: 251 followed by 9 digits (e.g., 251912345678)
              </p>

              <div className="flex justify-end gap-4">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="bg-gray-300 px-4 py-2 rounded cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="bg-blue-600 text-white px-4 py-2 rounded cursor-pointer"
                >
                  Save
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default Users;
