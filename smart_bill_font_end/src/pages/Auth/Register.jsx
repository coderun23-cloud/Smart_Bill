import { useContext, useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { AppContext } from "../context/AppContext";

function Register() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    password_confirmation: "",
    address: "",
    phone_number: "",
    role: "customer",
    customer_type: "",
  });
  const { setToken } = useContext(AppContext);
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [tariff, setTariff] = useState([]);
  const nav = useNavigate();
  async function handleRegister(e) {
    e.preventDefault();
    setLoading(true);
    setErrors({});

    if (formData.phone_number && !/^251\d{9}$/.test(formData.phone_number)) {
      setErrors({
        phone_number: [
          "Phone number must start with 251 followed by 9 digits (e.g., 251912345678)",
        ],
      });
      setLoading(false);
      return;
    }

    try {
      const res = await fetch("/api/customer", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      const data = await res.json();

      if (!res.ok) {
        setErrors(data.errors || {});
      } else {
        localStorage.setItem("token", data.token);
        setToken(data.token);
        nav("/index");
      }
    } catch (err) {
      console.error("Registration error:", err);
    } finally {
      setLoading(false);
    }
  }

  // Add phone number formatting
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

    setFormData({ ...formData, phone_number: value });
  };

  async function fetchTariff() {
    const res = await fetch("api/tariff");
    const data = await res.json();
    if (res.ok) {
      setTariff(data);
    } else {
      console.log(data.errors);
    }
  }

  useEffect(() => {
    fetchTariff();
  }, []);

  return (
    <div className="min-h-screen flex flex-col bg-gray-100">
      <header className="bg-gray-800 shadow-md py-4 fixed top-0 left-0 right-0 z-50">
        <div className="container mx-auto px-4 flex items-center justify-between">
          <Link to="/" className="flex items-center">
            <span className="text-white text-2xl font-bold italic">
              Smart Bill
            </span>
          </Link>
        </div>
      </header>

      <main className="flex-grow flex items-center justify-center mt-28 mb-10 px-4">
        <div className="w-full max-w-md p-8 bg-white rounded-lg shadow-lg">
          <h1 className="text-3xl font-bold mb-6 text-center text-black">
            Registration Form
          </h1>
          <form className="space-y-5" onSubmit={handleRegister}>
            <div>
              <label className="block text-sm font-semibold mb-1 text-black">
                Full Name<span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                placeholder="Enter your name..."
                className="w-full px-4 py-2 rounded-md text-black border border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={formData.name}
                onChange={(e) =>
                  setFormData({ ...formData, name: e.target.value })
                }
              />
              {errors.name && (
                <p className="text-red-500 text-sm mt-1">{errors.name[0]}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-semibold mb-1 text-black">
                Email<span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                placeholder="Enter your email..."
                className="w-full px-4 py-2 rounded-md text-black border border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={formData.email}
                onChange={(e) =>
                  setFormData({ ...formData, email: e.target.value })
                }
              />
              {errors.email && (
                <p className="text-red-500 text-sm mt-1">{errors.email[0]}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-semibold mb-1 text-black">
                Password<span className="text-red-500">*</span>
              </label>
              <input
                type="password"
                placeholder="Enter your password..."
                className="w-full px-4 py-2 rounded-md text-black border border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={formData.password}
                onChange={(e) =>
                  setFormData({ ...formData, password: e.target.value })
                }
              />
              {errors.password && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.password[0]}
                </p>
              )}
            </div>

            <div>
              <label className="block text-sm font-semibold mb-1 text-black">
                Confirm Password<span className="text-red-500">*</span>
              </label>
              <input
                type="password"
                placeholder="Confirm your password..."
                className="w-full px-4 py-2 rounded-md text-black border border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={formData.password_confirmation}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    password_confirmation: e.target.value,
                  })
                }
              />
            </div>

            {/* Address (Optional) */}
            <div>
              <label className="block text-sm font-semibold mb-1 text-black">
                Address <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                placeholder="Enter your address..."
                className="w-full px-4 py-2 rounded-md text-black border border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={formData.address}
                onChange={(e) =>
                  setFormData({ ...formData, address: e.target.value })
                }
              />
              {errors.address && (
                <p className="text-red-500 text-sm mt-1">{errors.address[0]}</p>
              )}
            </div>

            {/* Phone Number */}
            <div>
              <label className="block text-sm font-semibold mb-1 text-black">
                Phone Number
                <span className="text-gray-500 text-sm">(Optional)</span>
              </label>
              <input
                type="tel"
                placeholder="251XXXXXXXXX"
                className="w-full px-4 py-2 rounded-md text-black border border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={formData.phone_number}
                onChange={handlePhoneChange}
                pattern="^251\d{9}$"
                title="Phone number must start with 251 followed by 9 digits (e.g., 251912345678)"
              />
              {errors.phone_number && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.phone_number[0]}
                </p>
              )}
              <p className="text-xs text-gray-500 mt-1">
                Format: 251 followed by 9 digits (e.g., 251912345678)
              </p>
            </div>

            {/* Customer Type */}
            <div>
              <label className="block text-sm font-semibold mb-1 text-black">
                Tariff Type <span className="text-red-500">*</span>
              </label>
              <select
                name="customer_type"
                value={formData.customer_type}
                onChange={(e) =>
                  setFormData({ ...formData, customer_type: e.target.value })
                }
                className="w-full px-4 py-2 rounded-md text-black border border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">Select tariff type</option>
                {tariff.map((tariff) => (
                  <option
                    key={tariff.id}
                    value={tariff.tariff_name}
                    className="text-black"
                  >
                    {tariff.tariff_name}
                  </option>
                ))}
              </select>
              {errors.customer_type && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.customer_type[0]}
                </p>
              )}
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full mt-4 bg-blue-600 hover:bg-blue-700 transition-colors py-2 rounded-md font-semibold text-white cursor-pointer disabled:bg-gray-600 disabled:cursor-not-allowed"
            >
              {loading ? "Registering..." : "Register"}
            </button>

            {/* Already have an account? */}
            <p className="text-center mt-4 text-sm text-gray-600">
              Already have an account?{" "}
              <Link to="/login" className="text-blue-600 hover:underline">
                Login
              </Link>
            </p>
          </form>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-10 mt-auto">
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

export default Register;
