import { Link, Outlet } from "react-router-dom";
import { useState } from "react";
import "./layout.css"; // Optional: use this if you need custom styles

function Layout() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  return (
    <>
      <header className="fixed top-0 left-0 right-0 z-50 bg-gray-800 shadow-md">
        <div className="container mx-auto px-4 flex items-center justify-between h-18">
          <Link to="/" className="flex items-center">
            <span className="text-white text-2xl font-bold italic">
              Smart Bill
            </span>
          </Link>

          <nav className="hidden xl:flex space-x-6">
            <Link to="#hero" className="text-white hover:text-blue-300">
              Home
            </Link>
            <Link to="#about" className="text-white hover:text-blue-300">
              About
            </Link>
            <Link to="#services" className="text-white hover:text-blue-300">
              Services
            </Link>
            <Link to="#pricing" className="text-white hover:text-blue-300">
              Pricing
            </Link>
            <Link to="#contact" className="text-white hover:text-blue-300">
              Contact
            </Link>
          </nav>

          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="xl:hidden flex flex-col justify-between w-6 h-5 focus:outline-none cursor-pointer"
          >
            <span className="block h-0.75 w-full bg-gray-400"></span>
            <span className="block h-0.75 w-full bg-gray-400"></span>
            <span className="block h-0.75 w-full bg-gray-400"></span>
          </button>

          <div className="ml-4 hidden xl:block">
            <Link
              to="/login"
              className="bg-blue-700 text-white py-2 px-4 rounded hover:bg-blue-600 transition duration-300"
            >
              Sign In
            </Link>
          </div>
        </div>

        {isMobileMenuOpen && (
          <div className="xl:hidden bg-gray-800 text-white px-4 py-4 space-y-3">
            <Link to="#hero" className="block hover:text-blue-300">
              Home
            </Link>
            <Link to="#about" className="block hover:text-blue-300">
              About
            </Link>
            <Link to="#services" className="block hover:text-blue-300">
              Services
            </Link>
            <Link to="#pricing" className="block hover:text-blue-300">
              Pricing
            </Link>
            <Link to="#contact" className="block hover:text-blue-300">
              Contact
            </Link>
            <Link
              to="/login"
              className="block bg-blue-500 text-center text-white py-2 px-4 rounded hover:bg-blue-600 transition duration-300"
            >
              Sign In
            </Link>
          </div>
        )}
      </header>
      <main>
        <Outlet />
      </main>
    </>
  );
}

export default Layout;
