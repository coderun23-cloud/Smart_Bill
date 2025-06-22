import { useContext, useState } from "react";
import { AppContext } from "../context/AppContext";
import { Link, useNavigate, useLocation } from "react-router-dom";

function Header() {
  const { user, token, setUser, setToken } = useContext(AppContext);
  const navigate = useNavigate();
  const location = useLocation();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // Helper function to determine active route
  const isActive = (path) => location.pathname === path;

  // Helper function to style links
  const navItemClasses = (path) =>
    `px-3 py-2 rounded transition ${
      isActive(path)
        ? "bg-gray-900 text-white font-bold"
        : "text-white hover:text-blue-300"
    }`;

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
      navigate("/");
    }
  }

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-gray-800 shadow-md">
      <div className="container mx-auto px-4 flex items-center justify-between h-18">
        <Link to="/index" className="flex items-center">
          <span className="text-white text-2xl font-bold italic">
            Smart Bill
          </span>
        </Link>

        {/* Desktop Menu */}
        <nav className="hidden xl:flex space-x-6">
          <Link to="/index" className={navItemClasses("/index")}>
            Home
          </Link>
          <Link
            to={`/bill_list/${user.id}`}
            className={navItemClasses(`/bill_list/${user.id}`)}
          >
            Bill
          </Link>
          <Link to="/complaint" className={navItemClasses("/complaint")}>
            Complaint
          </Link>
          <Link to="/usage" className={navItemClasses("/usage")}>
            Usage
          </Link>
          <Link to="/notify" className={navItemClasses("/notify")}>
            Notification
          </Link>
        </nav>

        {/* Hamburger menu icon */}
        <button
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          className="xl:hidden flex flex-col justify-between w-6 h-5 focus:outline-none cursor-pointer"
        >
          <span className="block h-0.75 w-full bg-gray-400"></span>
          <span className="block h-0.75 w-full bg-gray-400"></span>
          <span className="block h-0.75 w-full bg-gray-400"></span>
        </button>

        {/* Desktop user dropdown */}
        <div className="ml-4 hidden xl:block relative cursor-pointer">
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="bg-blue-700 text-white py-2 px-4 rounded hover:bg-blue-600 transition duration-300 focus:outline-none cursor-pointer"
          >
            {user.name} ▾
          </button>
          {isMobileMenuOpen && (
            <div className="absolute right-0 mt-2 w-40 bg-white rounded-md shadow-lg z-50 cursor-pointer">
              <Link
                to="/profile"
                className="block px-4 py-2 text-gray-800 hover:bg-gray-100"
              >
                Profile
              </Link>
              <form action="" onSubmit={handleLogout}>
                <button className="flex items-center gap-2 px-4 py-2 w-full hover:bg-gray-100 cursor-pointer">
                  Logout
                </button>
              </form>
            </div>
          )}
        </div>
      </div>

      {/* Mobile menu dropdown */}
      {isMobileMenuOpen && (
        <div className="xl:hidden bg-gray-800 text-white px-4 py-4 space-y-3">
          <Link to="/index" className={navItemClasses("/index")}>
            Home
          </Link>
          <Link
            to={`/bill_list/${user.id}`}
            className={navItemClasses(`/bill_list/${user.id}`)}
          >
            Bill
          </Link>
          <Link to="/complaint" className={navItemClasses("/complaint")}>
            Complaint
          </Link>
          <Link to="/usage" className={navItemClasses("/usage")}>
            Usage
          </Link>
          <Link to="/notify" className={navItemClasses("/notify")}>
            Notification
          </Link>
          <details className="block cursor-pointer">
            <summary className="bg-blue-500 text-center py-2 px-4 rounded hover:bg-blue-600 cursor-pointer">
              {user.name}
            </summary>
            <div className="bg-gray-700 mt-1 rounded cursor-pointer">
              <Link
                to="/profile"
                className="block px-4 py-2 text-white hover:bg-gray-600"
              >
                Profile
              </Link>
              <button
                onClick={handleLogout}
                className="block px-4 py-2 text-white hover:bg-gray-600 w-full text-left"
              >
                Logout
              </button>
            </div>
          </details>
        </div>
      )}
    </header>
  );
}

export default Header;
