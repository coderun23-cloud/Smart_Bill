function Footer() {
  return (
    <footer id="footer" className="bg-gray-900 text-white py-10 mt-80">
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
  );
}

export default Footer;
