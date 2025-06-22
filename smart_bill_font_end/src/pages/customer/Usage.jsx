import { useState, useEffect, useContext } from "react";
import Footer from "./Footer";
import Header from "./Header";
import { useParams } from "react-router-dom";
import { AppContext } from "../context/AppContext";

function Usage() {
  const { id } = useParams();
  const { user } = useContext(AppContext);
  const [readings, setReadings] = useState([]);
  const [customer, setCustomer] = useState(null);
  const [tariff, setTariff] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [dateFilter, setDateFilter] = useState({
    startDate: "",
    endDate: "",
  });
  const [filteredReadings, setFilteredReadings] = useState([]);

  useEffect(() => {
    const fetchReadingData = async () => {
      try {
        const token = localStorage.getItem("token");
        const response = await fetch(`api/reading_details/${user.id}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (!response.ok) {
          throw new Error("Failed to fetch reading data");
        }

        const data = await response.json();
        // Sort readings by date (newest first)
        const sortedReadings = data.readings.sort(
          (a, b) => new Date(b.created_at) - new Date(a.created_at)
        );
        setReadings(sortedReadings);
        setFilteredReadings(sortedReadings);
        setCustomer(data.customer);
        setTariff(data.tariff);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchReadingData();
  }, [id, user.id]);

  const handleDateFilterChange = (e) => {
    const { name, value } = e.target;
    setDateFilter((prev) => ({ ...prev, [name]: value }));

    if (name === "startDate") {
      applyDateFilter(value, dateFilter.endDate);
    } else {
      applyDateFilter(dateFilter.startDate, value);
    }
  };

  const applyDateFilter = (startDate, endDate) => {
    let filtered = [...readings];

    if (startDate) {
      const start = new Date(startDate);
      filtered = filtered.filter((reading) => {
        const readingDate = new Date(reading.created_at);
        return readingDate >= start;
      });
    }

    if (endDate) {
      const end = new Date(endDate);
      filtered = filtered.filter((reading) => {
        const readingDate = new Date(reading.created_at);
        return readingDate <= end;
      });
    }

    setFilteredReadings(filtered);
  };

  const clearFilters = () => {
    setDateFilter({ startDate: "", endDate: "" });
    setFilteredReadings(readings);
  };

  // Group readings by month and year
  const groupReadingsByMonth = () => {
    const groups = {};

    filteredReadings.forEach((reading) => {
      const date = new Date(reading.created_at);
      const monthYear = date.toLocaleString("default", {
        month: "long",
        year: "numeric",
      });

      if (!groups[monthYear]) {
        groups[monthYear] = [];
      }

      groups[monthYear].push(reading);
    });

    return groups;
  };

  const groupedReadings = groupReadingsByMonth();

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-1 flex items-center justify-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
        </main>
        <Footer />
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-1 flex items-center justify-center">
          <div className="text-red-500 text-center p-4">
            <svg
              className="w-12 h-12 mx-auto mb-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
            <p className="text-xl font-medium">{error}</p>
            <p className="mt-2">Failed to load reading history</p>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Header />
      <main className="flex-1 container mx-auto px-4 py-8 mt-20">
        <div className="bg-white rounded-xl shadow-md p-6">
          <div className="mb-6">
            <h1 className="text-2xl font-bold text-gray-800">
              Reading History for {customer?.name}
            </h1>
            <p className="text-gray-600 mt-1">
              Customer Type: {customer?.customer_type} | Meter Number:{" "}
              {customer?.meter_number}
            </p>
            {tariff && (
              <p className="text-gray-600">
                Tariff: {tariff.tariff_name} (Ksh {tariff.rate_per_unit}/unit)
              </p>
            )}
          </div>

          {/* Date Filter Section */}
          <div className="mb-6 bg-gray-50 p-4 rounded-lg">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label
                  htmlFor="startDate"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  From Date
                </label>
                <input
                  type="date"
                  id="startDate"
                  name="startDate"
                  value={dateFilter.startDate}
                  onChange={handleDateFilterChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
              <div>
                <label
                  htmlFor="endDate"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  To Date
                </label>
                <input
                  type="date"
                  id="endDate"
                  name="endDate"
                  value={dateFilter.endDate}
                  onChange={handleDateFilterChange}
                  min={dateFilter.startDate}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
              <div className="flex items-end">
                {(dateFilter.startDate || dateFilter.endDate) && (
                  <button
                    onClick={clearFilters}
                    className="px-4 py-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300 transition-colors"
                  >
                    Clear Filters
                  </button>
                )}
              </div>
            </div>
          </div>

          {filteredReadings.length === 0 ? (
            <div className="text-center py-12">
              <svg
                className="mx-auto h-12 w-12 text-gray-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
              <h3 className="mt-2 text-lg font-medium text-gray-900">
                {dateFilter.startDate || dateFilter.endDate
                  ? "No readings found in the selected date range"
                  : "No readings available"}
              </h3>
            </div>
          ) : (
            <div className="space-y-8">
              {Object.entries(groupedReadings).map(
                ([monthYear, monthReadings]) => (
                  <div
                    key={monthYear}
                    className="border-b border-gray-200 pb-6 last:border-b-0"
                  >
                    <h2 className="text-lg font-semibold text-gray-800 mb-4">
                      {monthYear}
                    </h2>
                    <div className="overflow-x-auto">
                      <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                          <tr>
                            <th
                              scope="col"
                              className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                            >
                              #
                            </th>
                            <th
                              scope="col"
                              className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                            >
                              Date
                            </th>

                            <th
                              scope="col"
                              className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                            >
                              This Month Reading (KWH)
                            </th>
                            <th
                              scope="col"
                              className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                            >
                              Recorded By
                            </th>
                          </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                          {monthReadings.map((reading, index) => (
                            <tr key={reading.id} className="hover:bg-gray-50">
                              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                {index + 1}
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                {new Date(
                                  reading.created_at
                                ).toLocaleDateString()}
                              </td>

                              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                {reading.amount}
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                {reading.user?.name || "Unknown"}
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                )
              )}
            </div>
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
}

export default Usage;
