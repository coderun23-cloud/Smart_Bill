import { useContext, useEffect, useState } from "react";
import { AppContext } from "../context/AppContext";
import { useNavigate } from "react-router-dom";

function Profile() {
  const { user, token, setUser, setToken } = useContext(AppContext);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone_number: "",
    address: "",
  });

  const [message, setMessage] = useState("");
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deletePassword, setDeletePassword] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProfile = async () => {
      const res = await fetch("/api/profile", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (res.ok) {
        const userData = await res.json();
        setUser(userData);
        setFormData({
          name: userData.name || "",
          email: userData.email || "",
          phone_number: userData.phone_number || "",
          address: userData.address || "",
        });
      } else {
        alert("Failed to fetch profile.");
      }
    };

    if (token) fetchProfile();
  }, [token]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    if (user.role === "customer") {
      const res = await fetch(`/api/customer/${user.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(formData),
      });
      if (res.ok) {
        const updatedUser = await res.json();
        setUser(updatedUser);
        setMessage("✅ Profile updated successfully!");
        setShowEditModal(false);
      } else {
        alert("Failed to update profile.");
      }
    } else {
      const res = await fetch(`/api/profile`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(formData),
      });
      if (res.ok) {
        const updatedUser = await res.json();
        setUser(updatedUser);
        setMessage("✅ Profile updated successfully!");
        setShowEditModal(false);
      } else {
        alert("Failed to update profile.");
      }
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
    const res = await fetch(`/api/profile/${user.id}`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ password: deletePassword }),
    });

    if (res.ok) {
      setUser(null);
      setToken(null);
      localStorage.removeItem("token");
      alert("Your account has been deleted.");
      navigate("/");
    } else if (res.status === 403) {
      alert("Incorrect password. Account not deleted.");
    } else {
      alert("Failed to delete account.");
    }

    setShowDeleteModal(false);
    setDeletePassword("");
  };

  return (
    <>
      <br />
      <br />

      <button
        onClick={() => navigate(-1)}
        className="bg-gray-300 hover:bg-gray-400 text-black px-4 py-2 rounded cursor-pointer m-10 "
      >
        Go Back
      </button>
      <div className="max-w-xl mx-auto p-7 bg-gray-200 rounded shadow ">
        <h2 className="text-2xl font-semibold mb-4">My Profile</h2>

        {message && (
          <div className="mb-4 p-3 bg-green-100 text-green-800 rounded">
            {message}
          </div>
        )}

        <div className="space-y-2">
          <p>
            <strong>Name:</strong> {formData.name}
          </p>
          <br />
          <p>
            <strong>Email:</strong> {formData.email}
          </p>
          <br />
          <p>
            <strong>Phone:</strong> {formData.phone_number}
          </p>
          <br />
          <p>
            <strong>address:</strong> {formData.address}
          </p>
        </div>

        <div className="mt-6 flex gap-4">
          <button
            onClick={() => setShowEditModal(true)}
            className="bg-green-700 text-white px-4 cursor-pointer py-2 rounded hover:opacity-60"
          >
            Edit Profile
          </button>

          <button
            onClick={() => setShowDeleteModal(true)}
            className="text-red-600 border border-red-600 px-4 cursor-pointer py-2 rounded hover:bg-red-50"
          >
            Delete My Account
          </button>
        </div>

        {/* Edit Profile Modal */}
        {showEditModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-[100]">
            <div className="bg-white rounded shadow p-8 w-full max-w-lg max-h-[90vh] overflow-y-auto">
              <h3 className="text-2xl font-bold mb-6">Edit Profile</h3>
              <form onSubmit={handleUpdate} className="space-y-5">
                <input
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="Name"
                  className="w-full border px-4 py-3 rounded"
                  required
                />
                <input
                  name="email"
                  type="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="Email"
                  className="w-full border px-4 py-3 rounded"
                  required
                />
                <input
                  name="phone_number"
                  value={formData.phone_number}
                  onChange={handleChange}
                  placeholder="Phone Number"
                  className="w-full border px-4 py-3 rounded"
                />
                <input
                  name="address"
                  value={formData.address}
                  onChange={handleChange}
                  placeholder="Address"
                  className="w-full border px-4 py-3 rounded"
                />

                <div className="flex justify-end gap-3 pt-4">
                  <button
                    type="button"
                    onClick={() => setShowEditModal(false)}
                    className="px-4 py-2 border rounded cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="bg-blue-600 text-white px-5 py-2 rounded hover:bg-blue-700 cursor-pointer"
                  >
                    Save
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Delete Confirmation Modal */}
        {showDeleteModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded shadow p-6 w-full max-w-md">
              <h3 className="text-xl font-bold mb-4 text-red-600">
                Confirm Deletion
              </h3>
              <p className="mb-4">
                Enter your password to delete your account:
              </p>
              <input
                type="password"
                value={deletePassword}
                onChange={(e) => setDeletePassword(e.target.value)}
                className="w-full border px-3 py-2 rounded mb-4"
                placeholder="Password"
              />

              <div className="flex justify-end gap-2">
                <button
                  onClick={() => setShowDeleteModal(false)}
                  className="px-4 py-2 border rounded cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  onClick={handleDelete}
                  className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700 cursor-pointer"
                >
                  Delete
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
}

export default Profile;
