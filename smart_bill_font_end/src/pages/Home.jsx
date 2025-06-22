import { Link, useNavigate } from "react-router-dom";
import img from "../assets/smartbill background.jpg";
import im_g from "../assets/faq.jpg";
import im from "../assets/download.png";
import { useEffect, useState } from "react";
const faqs = [
  {
    question: "How is my electricity bill calculated?",
    answer:
      "Your electricity bill is calculated based on your usage measured by the meter. The unit price may vary based on the current tariff set by the utility provider.",
  },
  {
    question: "What should I do if I believe my bill is incorrect?",
    answer:
      "If you believe your bill is incorrect, you can file a complaint through the billing system or contact customer support for further assistance.",
  },
  {
    question: "How can I pay my electricity bill?",
    answer:
      "You can pay your electricity bill online, via mobile payment systems, or at designated payment points.",
  },
];
function Home() {
  const [activeIndex, setActiveIndex] = useState(null);
  const [tariffs, setTariffs] = useState([]);
  const toggleFAQ = (index) => {
    setActiveIndex(index === activeIndex ? null : index);
  };
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });
  const [setSubmitted] = useState(false);
  const [errors, setErrors] = useState({});
  const [success, setSuccess] = useState("");
  const nav = useNavigate();
  const handleChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });
  async function handleSubmit(e) {
    try {
      e.preventDefault();
      const res = await fetch("/api/contact", {
        method: "POST",
        body: JSON.stringify(formData),
      });
      if (res.status === 422) {
        const errorData = await res.json();
        setErrors(errorData.errors);
        return;
      }

      if (!res.ok) {
        throw new Error("Something went wrong");
      }
      setSuccess("Message sent successfully!");
      setFormData({ name: "", email: "", message: "" });
      setSubmitted(true);
      setFormData({ name: "", email: "", subject: "", message: "" });
      nav("/");
    } catch (error) {
      console.error("Submit error:", error.message);
    }
  }
  async function fetchTariffs() {
    try {
      const res = await fetch("/api/tariff");
      if (!res.ok) throw new Error("Failed to fetch tariffs");
      const data = await res.json();
      setTariffs(data);
    } catch (error) {
      console.error(error);
    }
  }

  useEffect(() => {
    fetchTariffs();
  }, []);
  return (
    <div>
      <br />
      <br />
      <section
        id="hero"
        className="relative w-full h-screen bg-black text-white"
      >
        {/* Background Image */}
        <img
          src={img}
          alt="Hero Background"
          className="absolute inset-0 w-full h-full object-cover opacity-70"
          data-aos="fade-in"
        />

        {/* Overlay Content */}
        <div className="relative z-10 container mx-auto h-full flex flex-col items-center justify-center text-center px-4">
          <h2
            data-aos="fade-up"
            data-aos-delay="100"
            className="text-3xl md:text-4xl font-bold mb-4"
          >
            Welcome to SmartBill - Your Reliable Electricity Billing System
          </h2>
          <p data-aos="fade-up" data-aos-delay="200" className="text-lg mb-6">
            Here you can manage all functions of an electrical bill system
          </p>

          {/* CTA Button */}
          <Link
            to="/register"
            data-aos="fade-up"
            data-aos-delay="300"
            className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg shadow-md transition duration-300"
          >
            Get Started
          </Link>
        </div>
      </section>
      <div className="max-w-6xl mx-auto px-4 py-8 space-y-6 ">
        <div
          className="bg-gray-50 shadow-sm border-l-4 border-blue-500 rounded-md p-4"
          data-aos="fade-up"
          data-aos-delay="120"
        >
          <div className="flex items-start gap-3 text-gray-800">
            <i className="bi bi-check2-circle text-blue-600 text-xl mt-1"></i>
            <span>
              Efficient management of electricity usage and billing process.
            </span>
          </div>
        </div>

        <div
          className="bg-gray-50 shadow-sm border-l-4 border-blue-500 rounded-md p-4"
          data-aos="fade-up"
          data-aos-delay="140"
        >
          <div className="flex items-start gap-3 text-gray-800">
            <i className="bi bi-check2-circle text-blue-600 text-xl mt-1"></i>
            <span>
              Accurate billing generation and management for customers.
            </span>
          </div>
        </div>

        <div
          className="bg-gray-50 shadow-sm border-l-4 border-blue-500 rounded-md p-4"
          data-aos="fade-up"
          data-aos-delay="160"
        >
          <div className="flex items-start gap-3 text-gray-800">
            <i className="bi bi-check2-circle text-blue-600 text-xl mt-1"></i>
            <span>Complaint management and customer support services.</span>
          </div>
        </div>

        <div
          className="bg-gray-50 shadow-sm border-l-4 border-blue-500 rounded-md p-4"
          data-aos="fade-up"
          data-aos-delay="180"
        >
          <div className="flex items-start gap-3 text-gray-800">
            <i className="bi bi-check2-circle text-blue-600 text-xl mt-1"></i>
            <span>Monitoring of customer status and service history.</span>
          </div>
        </div>
      </div>
      <section id="services" className="py-20 bg-gray-100">
        {/* Section Title */}
        <div
          className="container mx-auto px-4 text-center mb-12"
          data-aos="fade-up"
        >
          <h2 className="text-3xl font-bold text-gray-800 mb-4">Services</h2>
          <p className="text-black max-w-2xl mx-auto">
            The electricity billing system in Ethiopia offers a comprehensive
            suite of services aimed at improving billing accuracy, customer
            communication, and operational efficiency.
          </p>
        </div>

        {/* Service Cards */}
        <div className="container mx-auto px-10 ">
          <div className="grid gap-8 grid-cols-1 sm:grid-cols-2">
            {[
              {
                icon: "bi bi-file-earmark-check",
                title: "Bill Generation & Management",
                delay: 100,
                desc: "Accurate and timely bill generation for customers with easy-to-use management tools for admins and super admins.",
              },
              {
                icon: "bi bi-person-lines-fill",
                title: "Customer Status Monitoring",
                delay: 200,
                desc: "Real-time monitoring of customer consumption and status, ensuring prompt service management and notifications.",
              },
              {
                icon: "bi bi-clipboard-check",
                title: "Complaint Management",
                delay: 300,
                desc: "A streamlined process for customers to lodge complaints, with timely follow-ups and resolutions from the team.",
              },
              {
                icon: "bi bi-gear-fill",
                title: "Meter Reading & Scanning",
                delay: 400,
                desc: "Manual and automatic scanning of meters to ensure accurate and up-to-date readings for billing and customer information.",
              },
              {
                icon: "bi bi-chat-dots-fill",
                title: "Customer Communication",
                delay: 500,
                desc: "Efficient communication channels for updates, notifications, and customer service support, ensuring a positive experience.",
              },
              {
                icon: "bi bi-file-earmark-bar-graph",
                title: "Report Generation",
                delay: 600,
                desc: "Generation of detailed reports for admins and super admins, allowing for performance tracking and decision-making.",
              },
            ].map((item, index) => (
              <div
                key={index}
                className="bg-white rounded-xl h-75 w-1xl shadow-lg p-8 relative hover:shadow-2xl bg-gray-900 transition duration-200 cursor-pointer"
                data-aos="fade-up"
                data-aos-delay={item.delay}
              >
                <div className="flex items-center justify-center w-14 h-14 bg-blue-100 text-blue-600 rounded-full mb-4 text-2xl">
                  <i className={item.icon}></i>
                </div>
                <h3 className="text-lg font-bold text-gray-900 mb-2 hover:text-blue-400 transition">
                  <a href="#">{item.title}</a>
                </h3>
                <p className="text-gray-900 text-sm">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
      <section id="features" className="py-16">
        <div className="container mx-auto px-4">
          <div className="flex flex-col lg:flex-row items-center gap-8">
            <div
              className="w-full lg:w-1/2"
              data-aos="fade-up"
              data-aos-delay="100"
            >
              <img
                src={im}
                alt="Electricity Billing System Features"
                className="w-1/2 rounded "
              />
            </div>

            <div className="w-full lg:w-1/2 space-y-8">
              <div
                className="flex items-start gap-4"
                data-aos="fade-up"
                data-aos-delay="200"
              >
                <i className="bi bi-archive text-3xl text-blue-600"></i>
                <div>
                  <h4 className="text-xl font-semibold">
                    Bill Generation and Management
                  </h4>
                  <p>
                    Seamlessly generate and manage your electricity bills.
                    Monitor your usage and easily track payment history in one
                    place.
                  </p>
                </div>
              </div>

              <div
                className="flex items-start gap-4"
                data-aos="fade-up"
                data-aos-delay="300"
              >
                <i className="bi bi-basket text-3xl text-green-600"></i>
                <div>
                  <h4 className="text-xl font-semibold">Service Monitoring</h4>
                  <p>
                    Track your electricity consumption and monitor service
                    status, including service interruptions and maintenance
                    schedules.
                  </p>
                </div>
              </div>

              <div
                className="flex items-start gap-4"
                data-aos="fade-up"
                data-aos-delay="400"
              >
                <i className="bi bi-broadcast text-3xl text-yellow-500"></i>
                <div>
                  <h4 className="text-xl font-semibold">
                    Complaint Management
                  </h4>
                  <p>
                    Send and track complaints related to your service. Stay
                    updated with notifications regarding the status of your
                    complaints.
                  </p>
                </div>
              </div>

              <div
                className="flex items-start gap-4"
                data-aos="fade-up"
                data-aos-delay="500"
              >
                <i className="bi bi-camera-reels text-3xl text-red-500"></i>
                <div>
                  <h4 className="text-xl font-semibold">Real-Time Updates</h4>
                  <p>
                    Receive real-time notifications about your bill status, new
                    tariffs, and service updates directly to your mobile or
                    email.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section id="stats" className="bg-gray-900 text-white py-20">
        <div className="container mx-auto px-4 text-center" data-aos="fade-up">
          <h3 className="text-2xl font-bold mb-2">
            What we have achieved so far
          </h3>
          <p className="mb-12">
            Our system has helped streamline electricity billing, improve
            customer experience, and enhance operational efficiency.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="text-center">
              <span className="text-4xl font-bold block">232</span>
              <p className="mt-2">Clients Served</p>
            </div>
            <div className="text-center">
              <span className="text-4xl font-bold block">521</span>
              <p className="mt-2">Successful Billings</p>
            </div>
            <div className="text-center">
              <span className="text-4xl font-bold block">1453</span>
              <p className="mt-2">Hours of Support</p>
            </div>
            <div className="text-center">
              <span className="text-4xl font-bold block">32</span>
              <p className="mt-2">Service Technicians</p>
            </div>
          </div>
        </div>
      </section>

      <section id="pricing" className="bg-gray-100 py-20">
        <div className="container mx-auto px-4 text-center" data-aos="fade-up">
          <h2 className="text-3xl font-bold mb-4">Pricing</h2>
          <p className="mb-12">
            Choose the right plan for your electricity usage and enjoy seamless
            services.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {tariffs.map((tariff, index) => (
              <div
                key={index}
                className="bg-white p-6 rounded shadow"
                data-aos="fade-up"
                data-aos-delay={(index + 1) * 100}
              >
                <h3 className="text-xl font-semibold mb-2">
                  {tariff.tariff_name}
                </h3>
                <h4 className="text-2xl font-bold mb-4">
                  <sup className="text-base font-light">$</sup>
                  {tariff.price}
                  <span className="text-sm font-light"> / per kmh</span>
                </h4>
                <ul className="text-left space-y-2 mb-4">
                  <li>
                    Applies for units between {tariff.unit_min} -{" "}
                    {tariff.unit_max}
                  </li>
                  <li>Effective from: {tariff.effective_date}</li>
                  <li>Standard billing rate</li>
                </ul>
                <Link to="/login">
                  <button className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700 cursor-pointer">
                    Choose Plan
                  </button>
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>
      <section id="faq" className="py-12 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="grid lg:grid-cols-2 gap-10 items-center">
            {/* Text + FAQ */}
            <div>
              <div className="mb-6">
                <h3 className="text-2xl font-bold">
                  <span className="text-gray-700">Frequently Asked </span>
                  <span className="text-blue-600">Questions</span>
                </h3>
                <p className="text-gray-600 mt-2">
                  Get answers to your questions about the electricity billing
                  system in Ethiopia. We provide detailed information on
                  billing, payments, and service-related queries.
                </p>
              </div>

              <div className="space-y-4">
                {faqs.map((faq, index) => (
                  <div
                    key={index}
                    className={`border border-gray-200 rounded p-4 bg-white shadow-sm cursor-pointer ${
                      activeIndex === index ? "bg-blue-50" : ""
                    }`}
                    onClick={() => toggleFAQ(index)}
                  >
                    <div className="flex items-center justify-between">
                      <h4 className="text-md font-semibold text-gray-800 flex items-center gap-2">
                        <i className="bi bi-question-circle text-blue-600"></i>
                        {faq.question}
                      </h4>
                      <i
                        className={`bi ${
                          activeIndex === index
                            ? "bi-chevron-up"
                            : "bi-chevron-down"
                        } text-gray-600`}
                      ></i>
                    </div>
                    {activeIndex === index && (
                      <p className="mt-2 text-sm text-gray-600">{faq.answer}</p>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Image */}
            <div className="text-center">
              <img
                src={im_g}
                alt="FAQ"
                className="rounded-lg shadow-lg w-full max-w-md mx-auto"
              />
            </div>
          </div>
        </div>
      </section>
      <section id="contact" className="py-12 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold">Contact</h2>
            <p className="text-gray-600 mt-2">
              Get in touch with us for inquiries, issues with your electricity
              billing, or any other assistance related to our services.
            </p>
          </div>

          <div className="grid lg:grid-cols-3 gap-8">
            <div className="space-y-6">
              <div className="flex items-start gap-4">
                <i className="bi bi-geo-alt text-2xl text-blue-600"></i>
                <div>
                  <h4 className="font-semibold">Address</h4>
                  <p className="text-sm text-gray-600">Addis Ababa, Ethiopia</p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <i className="bi bi-telephone text-2xl text-blue-600"></i>
                <div>
                  <h4 className="font-semibold">Call Us</h4>
                  <p className="text-sm text-gray-600">+251 11 123 4567</p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <i className="bi bi-envelope text-2xl text-blue-600"></i>
                <div>
                  <h4 className="font-semibold">Email Us</h4>
                  <p className="text-sm text-gray-600">
                    support@ethioelectricity.com
                  </p>
                </div>
              </div>
            </div>

            {/* Form */}
            <div className="lg:col-span-2">
              {success && (
                <div className="mb-4 text-green-600 font-semibold text-center">
                  {success}
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid md:grid-cols-2 gap-4">
                  <input
                    type="text"
                    name="name"
                    placeholder="Your Name"
                    className="form-input w-full border px-4 py-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    value={formData.name}
                    onChange={handleChange}
                  />
                  {errors.name && (
                    <p className="text-red-700 text-sm mt-1">
                      {errors.name[0]}
                    </p>
                  )}
                  <input
                    type="email"
                    name="email"
                    placeholder="Your Email"
                    className="form-input w-full border px-4 py-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    value={formData.email}
                    onChange={handleChange}
                  />
                  {errors.email && (
                    <p className="text-red-700 text-sm mt-1">
                      {errors.email[0]}
                    </p>
                  )}
                </div>

                <input
                  type="text"
                  name="subject"
                  placeholder="Subject"
                  className="form-input w-full border px-4 py-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  value={formData.subject}
                  onChange={handleChange}
                />
                {errors.subject && (
                  <p className="text-red-700 text-sm mt-1">
                    {errors.subject[0]}
                  </p>
                )}

                <textarea
                  name="message"
                  rows="5"
                  placeholder="Message"
                  className="form-textarea w-full border px-4 py-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  value={formData.message}
                  onChange={handleChange}
                ></textarea>
                {errors.message && (
                  <p className="text-red-700 text-sm mt-1">
                    {errors.message[0]}
                  </p>
                )}
                <button
                  type="submit"
                  className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700"
                >
                  Send Message
                </button>
              </form>
            </div>
          </div>
        </div>
      </section>
      <footer id="footer" className="bg-gray-900 text-white py-10">
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

export default Home;
