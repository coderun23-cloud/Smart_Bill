import { Link, useNavigate } from "react-router-dom";
import img from "../assets/smartbill background.jpg";
import im_g from "../assets/faq.jpg";
import im from "../assets/download.png";
import { useEffect, useState, useRef } from "react";

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

const services = [
  {
    icon: "bi bi-file-earmark-check",
    title: "Bill Generation & Management",
    desc: "Accurate and timely bill generation for customers with easy-to-use management tools for admins and super admins.",
    color: "#2563EB",
    bg: "rgba(37,99,235,0.08)",
  },
  {
    icon: "bi bi-person-lines-fill",
    title: "Customer Status Monitoring",
    desc: "Real-time monitoring of customer consumption and status, ensuring prompt service management and notifications.",
    color: "#059669",
    bg: "rgba(5,150,105,0.08)",
  },
  {
    icon: "bi bi-clipboard-check",
    title: "Complaint Management",
    desc: "A streamlined process for customers to lodge complaints, with timely follow-ups and resolutions from the team.",
    color: "#D97706",
    bg: "rgba(217,119,6,0.08)",
  },
  {
    icon: "bi bi-gear-fill",
    title: "Meter Reading & Scanning",
    desc: "Manual and automatic scanning of meters to ensure accurate and up-to-date readings for billing and customer information.",
    color: "#7C3AED",
    bg: "rgba(124,58,237,0.08)",
  },
  {
    icon: "bi bi-chat-dots-fill",
    title: "Customer Communication",
    desc: "Efficient communication channels for updates, notifications, and customer service support, ensuring a positive experience.",
    color: "#DB2777",
    bg: "rgba(219,39,119,0.08)",
  },
  {
    icon: "bi bi-file-earmark-bar-graph",
    title: "Report Generation",
    desc: "Generation of detailed reports for admins and super admins, allowing for performance tracking and decision-making.",
    color: "#0891B2",
    bg: "rgba(8,145,178,0.08)",
  },
];

const stats = [
  { value: "232", label: "Clients Served", icon: "bi bi-people-fill" },
  { value: "521", label: "Successful Billings", icon: "bi bi-receipt" },
  { value: "1,453", label: "Hours of Support", icon: "bi bi-headset" },
  { value: "32", label: "Service Technicians", icon: "bi bi-tools" },
];

function useCountUp(target, duration = 1800, start = false) {
  const [count, setCount] = useState(0);
  useEffect(() => {
    if (!start) return;
    const num = parseInt(target.replace(/,/g, ""), 10);
    let startTime = null;
    const step = (timestamp) => {
      if (!startTime) startTime = timestamp;
      const progress = Math.min((timestamp - startTime) / duration, 1);
      setCount(Math.floor(progress * num));
      if (progress < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  }, [start, target, duration]);
  return count.toLocaleString();
}

function StatCard({ value, label, icon, animate }) {
  const display = useCountUp(value, 1800, animate);
  return (
    <div className="stat-card">
      <div className="stat-icon-wrap">
        <i className={icon}></i>
      </div>
      <span className="stat-number">{animate ? display : "0"}</span>
      <p className="stat-label">{label}</p>
    </div>
  );
}

function Home() {
  const [activeIndex, setActiveIndex] = useState(null);
  const [tariffs, setTariffs] = useState([]);
  const [statsVisible, setStatsVisible] = useState(false);
  const statsRef = useRef(null);
  const [formData, setFormData] = useState({ name: "", email: "", subject: "", message: "" });
  const [errors, setErrors] = useState({});
  const [success, setSuccess] = useState("");
  const nav = useNavigate();

  const toggleFAQ = (index) => setActiveIndex(index === activeIndex ? null : index);
  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

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
      if (!res.ok) throw new Error("Something went wrong");
      setSuccess("Message sent successfully!");
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
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) setStatsVisible(true); },
      { threshold: 0.3 }
    );
    if (statsRef.current) observer.observe(statsRef.current);
    return () => observer.disconnect();
  }, []);

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Syne:wght@400;500;600;700;800&family=DM+Sans:ital,opsz,wght@0,9..40,300;0,9..40,400;0,9..40,500;1,9..40,300&display=swap');

        * { box-sizing: border-box; }

        body { font-family: 'DM Sans', sans-serif; }

        /* ── HERO ── */
        .hero-section {
          position: relative;
          min-height: 100vh;
          display: flex;
          align-items: center;
          overflow: hidden;
          background: #030712;
        }
        .hero-bg {
          position: absolute; inset: 0;
          width: 100%; height: 100%;
          object-fit: cover;
          opacity: 0.25;
          filter: saturate(0.6);
        }
        .hero-gradient {
          position: absolute; inset: 0;
          background: linear-gradient(135deg, rgba(3,7,18,0.95) 0%, rgba(30,58,138,0.55) 60%, rgba(3,7,18,0.8) 100%);
        }
        .hero-grid {
          position: absolute; inset: 0;
          background-image: linear-gradient(rgba(37,99,235,0.06) 1px, transparent 1px),
            linear-gradient(90deg, rgba(37,99,235,0.06) 1px, transparent 1px);
          background-size: 60px 60px;
          animation: gridShift 20s linear infinite;
        }
        @keyframes gridShift {
          0% { background-position: 0 0; }
          100% { background-position: 60px 60px; }
        }
        .hero-glow {
          position: absolute;
          width: 600px; height: 600px;
          border-radius: 50%;
          background: radial-gradient(circle, rgba(37,99,235,0.25) 0%, transparent 70%);
          top: -100px; right: -100px;
          animation: pulse 6s ease-in-out infinite;
        }
        .hero-glow-2 {
          position: absolute;
          width: 400px; height: 400px;
          border-radius: 50%;
          background: radial-gradient(circle, rgba(5,150,105,0.15) 0%, transparent 70%);
          bottom: -80px; left: 10%;
          animation: pulse 8s ease-in-out infinite 2s;
        }
        @keyframes pulse {
          0%, 100% { transform: scale(1); opacity: 1; }
          50% { transform: scale(1.1); opacity: 0.7; }
        }
        .hero-content {
          position: relative; z-index: 10;
          max-width: 900px;
          margin: 0 auto;
          padding: 0 2rem;
          text-align: center;
        }
        .hero-badge {
          display: inline-flex; align-items: center; gap: 8px;
          background: rgba(37,99,235,0.15);
          border: 1px solid rgba(37,99,235,0.35);
          color: #93C5FD;
          padding: 6px 18px;
          border-radius: 100px;
          font-size: 0.82rem;
          letter-spacing: 0.08em;
          text-transform: uppercase;
          font-weight: 500;
          margin-bottom: 2rem;
          animation: fadeDown 0.8s ease both;
        }
        .hero-badge i { font-size: 0.9rem; animation: blink 2s infinite; }
        @keyframes blink { 0%,100%{opacity:1} 50%{opacity:0.4} }
        .hero-title {
          font-family: 'Syne', sans-serif;
          font-size: clamp(2.5rem, 6vw, 4.5rem);
          font-weight: 800;
          color: #fff;
          line-height: 1.1;
          margin-bottom: 1.5rem;
          animation: fadeUp 0.9s ease 0.2s both;
        }
        .hero-title .accent {
          background: linear-gradient(135deg, #3B82F6, #06B6D4);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
        }
        .hero-subtitle {
          font-size: 1.15rem;
          color: rgba(255,255,255,0.65);
          max-width: 600px;
          margin: 0 auto 2.5rem;
          line-height: 1.75;
          font-weight: 300;
          animation: fadeUp 0.9s ease 0.4s both;
        }
        .hero-actions {
          display: flex; gap: 1rem; justify-content: center; flex-wrap: wrap;
          animation: fadeUp 0.9s ease 0.6s both;
        }
        .btn-primary {
          display: inline-flex; align-items: center; gap: 8px;
          background: linear-gradient(135deg, #2563EB, #1D4ED8);
          color: #fff;
          padding: 14px 32px;
          border-radius: 12px;
          font-weight: 600;
          font-size: 1rem;
          text-decoration: none;
          box-shadow: 0 0 30px rgba(37,99,235,0.4), 0 4px 15px rgba(0,0,0,0.3);
          transition: all 0.3s ease;
          border: 1px solid rgba(255,255,255,0.1);
        }
        .btn-primary:hover {
          transform: translateY(-2px);
          box-shadow: 0 0 50px rgba(37,99,235,0.6), 0 8px 25px rgba(0,0,0,0.3);
        }
        .btn-outline {
          display: inline-flex; align-items: center; gap: 8px;
          background: transparent;
          color: rgba(255,255,255,0.85);
          padding: 14px 32px;
          border-radius: 12px;
          font-weight: 500;
          font-size: 1rem;
          text-decoration: none;
          border: 1px solid rgba(255,255,255,0.2);
          transition: all 0.3s ease;
        }
        .btn-outline:hover {
          background: rgba(255,255,255,0.07);
          border-color: rgba(255,255,255,0.4);
          transform: translateY(-2px);
        }
        .hero-scroll {
          position: absolute; bottom: 2rem; left: 50%; transform: translateX(-50%);
          display: flex; flex-direction: column; align-items: center; gap: 8px;
          color: rgba(255,255,255,0.4);
          font-size: 0.75rem; letter-spacing: 0.1em; text-transform: uppercase;
          animation: fadeIn 1s ease 1.2s both;
        }
        .scroll-line {
          width: 1px; height: 40px;
          background: linear-gradient(to bottom, rgba(255,255,255,0.4), transparent);
          animation: scrollDrop 2s ease-in-out infinite;
        }
        @keyframes scrollDrop {
          0% { transform: scaleY(0); transform-origin: top; }
          50% { transform: scaleY(1); transform-origin: top; }
          51% { transform: scaleY(1); transform-origin: bottom; }
          100% { transform: scaleY(0); transform-origin: bottom; }
        }

        /* ── FEATURE PILLS ── */
        .pills-section {
          background: #fff;
          border-bottom: 1px solid #F1F5F9;
          padding: 2rem 0;
        }
        .pills-inner {
          max-width: 1100px; margin: 0 auto; padding: 0 2rem;
          display: flex; flex-wrap: wrap; gap: 1rem; justify-content: center;
        }
        .pill {
          display: flex; align-items: center; gap: 10px;
          background: #F8FAFC;
          border: 1px solid #E2E8F0;
          border-radius: 100px;
          padding: 10px 20px;
          font-size: 0.9rem;
          font-weight: 500;
          color: #334155;
          transition: all 0.25s;
        }
        .pill:hover { border-color: #3B82F6; color: #2563EB; background: #EFF6FF; transform: translateY(-1px); }
        .pill i { color: #2563EB; }

        /* ── SECTION COMMON ── */
        .section-eyebrow {
          display: inline-flex; align-items: center; gap: 8px;
          color: #2563EB; font-weight: 600; font-size: 0.8rem;
          letter-spacing: 0.12em; text-transform: uppercase;
          margin-bottom: 0.75rem;
        }
        .section-eyebrow::before, .section-eyebrow::after {
          content: '';
          display: block; width: 20px; height: 2px; background: currentColor; border-radius: 2px;
        }
        .section-title {
          font-family: 'Syne', sans-serif;
          font-size: clamp(1.8rem, 3.5vw, 2.6rem);
          font-weight: 700;
          color: #0F172A;
          line-height: 1.2;
          margin-bottom: 1rem;
        }
        .section-desc {
          color: #64748B;
          font-size: 1.05rem;
          line-height: 1.75;
          max-width: 580px;
        }

        /* ── SERVICES ── */
        .services-section {
          padding: 6rem 0;
          background: linear-gradient(180deg, #F8FAFC 0%, #fff 100%);
        }
        .services-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
          gap: 1.5rem;
          max-width: 1100px; margin: 3rem auto 0; padding: 0 2rem;
        }
        .service-card {
          background: #fff;
          border: 1px solid #E2E8F0;
          border-radius: 20px;
          padding: 2rem;
          transition: all 0.35s cubic-bezier(0.4,0,0.2,1);
          position: relative;
          overflow: hidden;
        }
        .service-card::before {
          content: '';
          position: absolute; top: 0; left: 0; right: 0; height: 3px;
          background: var(--card-color);
          transform: scaleX(0); transform-origin: left;
          transition: transform 0.4s ease;
          border-radius: 20px 20px 0 0;
        }
        .service-card:hover { transform: translateY(-6px); box-shadow: 0 24px 60px rgba(0,0,0,0.1); border-color: transparent; }
        .service-card:hover::before { transform: scaleX(1); }
        .service-icon {
          width: 52px; height: 52px;
          border-radius: 14px;
          display: flex; align-items: center; justify-content: center;
          font-size: 1.4rem;
          background: var(--card-bg);
          color: var(--card-color);
          margin-bottom: 1.25rem;
        }
        .service-card h3 {
          font-family: 'Syne', sans-serif;
          font-size: 1.05rem; font-weight: 700;
          color: #0F172A; margin-bottom: 0.5rem;
        }
        .service-card p { font-size: 0.9rem; color: #64748B; line-height: 1.7; }

        /* ── FEATURES ── */
        .features-section { padding: 6rem 0; background: #fff; }
        .features-inner {
          max-width: 1100px; margin: 0 auto; padding: 0 2rem;
          display: grid; grid-template-columns: 1fr 1fr; gap: 5rem; align-items: center;
        }
        @media(max-width:768px){ .features-inner { grid-template-columns: 1fr; gap: 3rem; } }
        .features-image-wrap {
          position: relative;
        }
        .features-image-wrap img {
          width: 100%; border-radius: 24px;
          box-shadow: 0 30px 80px rgba(0,0,0,0.15);
        }
        .features-badge {
          position: absolute; bottom: -20px; right: -20px;
          background: #2563EB; color: #fff;
          padding: 1.25rem 1.5rem;
          border-radius: 18px;
          box-shadow: 0 10px 30px rgba(37,99,235,0.4);
          text-align: center;
        }
        .features-badge span { display: block; font-size: 1.8rem; font-weight: 800; font-family: 'Syne', sans-serif; }
        .features-badge p { font-size: 0.75rem; opacity: 0.85; margin: 0; }
        .feature-item {
          display: flex; gap: 1.25rem; align-items: flex-start;
          padding: 1.25rem;
          border-radius: 16px;
          transition: background 0.25s;
          cursor: default;
        }
        .feature-item:hover { background: #F8FAFC; }
        .feature-icon {
          width: 48px; height: 48px; flex-shrink: 0;
          border-radius: 12px;
          display: flex; align-items: center; justify-content: center;
          font-size: 1.3rem;
        }
        .feature-item h4 {
          font-family: 'Syne', sans-serif;
          font-size: 1rem; font-weight: 700; color: #0F172A; margin-bottom: 0.35rem;
        }
        .feature-item p { font-size: 0.9rem; color: #64748B; line-height: 1.65; }

        /* ── STATS ── */
        .stats-section {
          padding: 6rem 0;
          background: #0F172A;
          position: relative; overflow: hidden;
        }
        .stats-section::before {
          content: '';
          position: absolute; inset: 0;
          background-image: radial-gradient(rgba(37,99,235,0.12) 1px, transparent 1px);
          background-size: 30px 30px;
        }
        .stats-inner {
          max-width: 1100px; margin: 0 auto; padding: 0 2rem;
          position: relative; z-index: 1;
        }
        .stats-header { text-align: center; margin-bottom: 4rem; }
        .stats-header h2 {
          font-family: 'Syne', sans-serif;
          font-size: clamp(1.8rem, 3.5vw, 2.5rem);
          font-weight: 700; color: #fff; margin-bottom: 0.75rem;
        }
        .stats-header p { color: rgba(255,255,255,0.55); max-width: 500px; margin: 0 auto; }
        .stats-grid {
          display: grid; grid-template-columns: repeat(4, 1fr); gap: 1.5rem;
        }
        @media(max-width:768px){ .stats-grid { grid-template-columns: repeat(2,1fr); } }
        .stat-card {
          background: rgba(255,255,255,0.04);
          border: 1px solid rgba(255,255,255,0.08);
          border-radius: 20px;
          padding: 2rem;
          text-align: center;
          transition: all 0.3s;
        }
        .stat-card:hover { background: rgba(37,99,235,0.12); border-color: rgba(37,99,235,0.3); transform: translateY(-4px); }
        .stat-icon-wrap {
          width: 50px; height: 50px;
          background: rgba(37,99,235,0.2);
          border-radius: 14px;
          display: flex; align-items: center; justify-content: center;
          margin: 0 auto 1rem;
          font-size: 1.3rem; color: #60A5FA;
        }
        .stat-number {
          display: block;
          font-family: 'Syne', sans-serif;
          font-size: 2.5rem; font-weight: 800; color: #fff;
          margin-bottom: 0.35rem;
        }
        .stat-label { color: rgba(255,255,255,0.5); font-size: 0.85rem; }

        /* ── PRICING ── */
        .pricing-section { padding: 6rem 0; background: #F8FAFC; }
        .pricing-grid {
          display: grid; grid-template-columns: repeat(auto-fit, minmax(280px,1fr));
          gap: 1.5rem; max-width: 1100px; margin: 3rem auto 0; padding: 0 2rem;
        }
        .pricing-card {
          background: #fff; border: 1px solid #E2E8F0; border-radius: 24px;
          padding: 2.5rem; position: relative; transition: all 0.35s;
        }
        .pricing-card.featured {
          background: linear-gradient(145deg, #1D4ED8, #2563EB);
          border-color: transparent;
          box-shadow: 0 20px 60px rgba(37,99,235,0.35);
        }
        .pricing-card:hover:not(.featured) { transform: translateY(-6px); box-shadow: 0 20px 60px rgba(0,0,0,0.1); }
        .pricing-card.featured:hover { transform: translateY(-6px); }
        .pricing-badge {
          position: absolute; top: -12px; left: 50%; transform: translateX(-50%);
          background: #F59E0B; color: #fff; font-size: 0.75rem; font-weight: 700;
          padding: 4px 16px; border-radius: 100px; letter-spacing: 0.06em; text-transform: uppercase;
        }
        .pricing-name {
          font-family: 'Syne', sans-serif; font-size: 1.1rem; font-weight: 700;
          color: #0F172A; margin-bottom: 0.5rem;
        }
        .pricing-card.featured .pricing-name { color: rgba(255,255,255,0.9); }
        .pricing-price {
          display: flex; align-items: flex-end; gap: 4px; margin-bottom: 1.5rem;
        }
        .price-currency { font-size: 1.1rem; font-weight: 500; color: #2563EB; align-self: flex-start; padding-top: 8px; }
        .price-amount {
          font-family: 'Syne', sans-serif; font-size: 3rem; font-weight: 800; color: #0F172A; line-height: 1;
        }
        .price-unit { font-size: 0.85rem; color: #94A3B8; padding-bottom: 8px; }
        .pricing-card.featured .price-currency, .pricing-card.featured .price-amount, .pricing-card.featured .price-unit { color: #fff; }
        .pricing-divider { border: none; border-top: 1px solid #E2E8F0; margin: 1.25rem 0; }
        .pricing-card.featured .pricing-divider { border-color: rgba(255,255,255,0.2); }
        .pricing-list { list-style: none; padding: 0; margin: 0 0 2rem; space-y: 0.75rem; }
        .pricing-list li {
          display: flex; align-items: center; gap: 10px;
          font-size: 0.9rem; color: #475569; padding: 0.4rem 0;
        }
        .pricing-card.featured .pricing-list li { color: rgba(255,255,255,0.8); }
        .pricing-list li i { color: #22C55E; font-size: 1rem; }
        .pricing-card.featured .pricing-list li i { color: #86EFAC; }
        .btn-pricing {
          width: 100%; padding: 12px; border-radius: 12px; font-weight: 600; font-size: 0.95rem;
          cursor: pointer; border: none; transition: all 0.25s;
          background: #EFF6FF; color: #2563EB;
        }
        .btn-pricing:hover { background: #DBEAFE; }
        .pricing-card.featured .btn-pricing {
          background: rgba(255,255,255,0.2); color: #fff;
          border: 1px solid rgba(255,255,255,0.3);
        }
        .pricing-card.featured .btn-pricing:hover { background: rgba(255,255,255,0.3); }

        /* ── FAQ ── */
        .faq-section { padding: 6rem 0; background: #fff; }
        .faq-inner {
          max-width: 1100px; margin: 0 auto; padding: 0 2rem;
          display: grid; grid-template-columns: 1fr 1fr; gap: 5rem; align-items: start;
        }
        @media(max-width:900px){ .faq-inner { grid-template-columns: 1fr; } }
        .faq-list { display: flex; flex-direction: column; gap: 1rem; }
        .faq-item {
          border: 1px solid #E2E8F0;
          border-radius: 16px;
          overflow: hidden;
          transition: border-color 0.25s, box-shadow 0.25s;
        }
        .faq-item.open { border-color: #BFDBFE; box-shadow: 0 4px 20px rgba(37,99,235,0.08); }
        .faq-question {
          display: flex; align-items: center; justify-content: space-between;
          padding: 1.25rem 1.5rem;
          cursor: pointer; gap: 1rem;
          background: transparent;
          transition: background 0.2s;
        }
        .faq-question:hover { background: #F8FAFC; }
        .faq-item.open .faq-question { background: #EFF6FF; }
        .faq-q-text {
          display: flex; align-items: center; gap: 12px;
          font-weight: 600; font-size: 0.95rem; color: #0F172A;
        }
        .faq-q-text i { color: #2563EB; font-size: 1.1rem; }
        .faq-chevron { color: #94A3B8; transition: transform 0.3s; }
        .faq-item.open .faq-chevron { transform: rotate(180deg); color: #2563EB; }
        .faq-answer {
          padding: 0 1.5rem;
          max-height: 0; overflow: hidden;
          transition: max-height 0.35s ease, padding 0.35s;
          color: #475569; font-size: 0.9rem; line-height: 1.75;
        }
        .faq-item.open .faq-answer { max-height: 200px; padding-bottom: 1.25rem; }
        .faq-image-wrap { position: relative; }
        .faq-image-wrap img {
          width: 100%; border-radius: 24px;
          box-shadow: 0 20px 60px rgba(0,0,0,0.12);
        }
        .faq-image-badge {
          position: absolute; top: 1.5rem; left: 1.5rem;
          background: #fff; border-radius: 14px;
          padding: 1rem 1.25rem;
          box-shadow: 0 8px 30px rgba(0,0,0,0.12);
          display: flex; align-items: center; gap: 10px;
        }
        .faq-image-badge i { color: #2563EB; font-size: 1.4rem; }
        .faq-image-badge span { font-weight: 700; font-size: 0.9rem; color: #0F172A; }

        /* ── CONTACT ── */
        .contact-section { padding: 6rem 0; background: #F8FAFC; }
        .contact-inner {
          max-width: 1100px; margin: 0 auto; padding: 0 2rem;
          display: grid; grid-template-columns: 1fr 1.7fr; gap: 4rem; align-items: start;
        }
        @media(max-width:900px){ .contact-inner { grid-template-columns: 1fr; } }
        .contact-info-card {
          background: #0F172A; border-radius: 24px; padding: 2.5rem; color: #fff;
          position: sticky; top: 2rem;
        }
        .contact-info-card h3 {
          font-family: 'Syne', sans-serif; font-size: 1.4rem; font-weight: 700; margin-bottom: 0.5rem;
        }
        .contact-info-card > p { color: rgba(255,255,255,0.55); font-size: 0.9rem; margin-bottom: 2rem; }
        .contact-item {
          display: flex; align-items: flex-start; gap: 1rem; margin-bottom: 1.5rem;
        }
        .contact-item-icon {
          width: 42px; height: 42px; border-radius: 12px;
          background: rgba(37,99,235,0.2); color: #60A5FA;
          display: flex; align-items: center; justify-content: center; font-size: 1.1rem; flex-shrink: 0;
        }
        .contact-item h4 { font-size: 0.8rem; color: rgba(255,255,255,0.5); text-transform: uppercase; letter-spacing: 0.08em; margin-bottom: 0.2rem; font-weight: 500; }
        .contact-item p { color: #fff; font-size: 0.95rem; font-weight: 500; }
        .contact-socials {
          display: flex; gap: 0.75rem; margin-top: 2rem; padding-top: 1.5rem;
          border-top: 1px solid rgba(255,255,255,0.1);
        }
        .social-btn {
          width: 38px; height: 38px; border-radius: 10px;
          background: rgba(255,255,255,0.08);
          color: rgba(255,255,255,0.6);
          display: flex; align-items: center; justify-content: center;
          text-decoration: none; font-size: 1rem;
          transition: all 0.25s;
        }
        .social-btn:hover { background: #2563EB; color: #fff; transform: translateY(-2px); }
        .contact-form-wrap { background: #fff; border-radius: 24px; padding: 2.5rem; box-shadow: 0 4px 30px rgba(0,0,0,0.06); }
        .form-group { margin-bottom: 1.25rem; }
        .form-label { display: block; font-size: 0.82rem; font-weight: 600; color: #374151; margin-bottom: 0.4rem; letter-spacing: 0.04em; }
        .form-input {
          width: 100%; padding: 12px 16px;
          border: 1.5px solid #E2E8F0; border-radius: 12px;
          font-size: 0.95rem; color: #0F172A;
          background: #F8FAFC;
          transition: all 0.25s;
          outline: none; font-family: inherit;
        }
        .form-input:focus { border-color: #3B82F6; background: #fff; box-shadow: 0 0 0 3px rgba(59,130,246,0.1); }
        .form-row { display: grid; grid-template-columns: 1fr 1fr; gap: 1rem; }
        @media(max-width:600px){ .form-row { grid-template-columns: 1fr; } }
        .form-error { color: #EF4444; font-size: 0.8rem; margin-top: 0.3rem; }
        .success-alert {
          background: #F0FDF4; border: 1px solid #86EFAC; color: #166534;
          padding: 0.9rem 1.25rem; border-radius: 12px; font-weight: 500;
          display: flex; align-items: center; gap: 10px; margin-bottom: 1.25rem;
        }
        .btn-submit {
          width: 100%; padding: 14px; border-radius: 12px;
          background: linear-gradient(135deg, #2563EB, #1D4ED8);
          color: #fff; font-weight: 600; font-size: 1rem;
          border: none; cursor: pointer;
          box-shadow: 0 4px 15px rgba(37,99,235,0.35);
          transition: all 0.25s; font-family: inherit;
          display: flex; align-items: center; justify-content: center; gap: 8px;
        }
        .btn-submit:hover { transform: translateY(-2px); box-shadow: 0 8px 25px rgba(37,99,235,0.45); }

        /* ── FOOTER ── */
        .footer { background: #030712; color: #fff; padding: 4rem 0 2rem; }
        .footer-inner { max-width: 1100px; margin: 0 auto; padding: 0 2rem; }
        .footer-top {
          display: flex; flex-wrap: wrap; gap: 3rem; justify-content: space-between;
          padding-bottom: 3rem; border-bottom: 1px solid rgba(255,255,255,0.08);
        }
        .footer-brand { max-width: 320px; }
        .footer-brand h3 {
          font-family: 'Syne', sans-serif; font-size: 1.3rem; font-weight: 700;
          margin-bottom: 0.75rem;
          background: linear-gradient(135deg, #fff, #93C5FD);
          -webkit-background-clip: text; -webkit-text-fill-color: transparent; background-clip: text;
        }
        .footer-brand p { color: rgba(255,255,255,0.45); font-size: 0.9rem; line-height: 1.75; }
        .footer-bottom {
          padding-top: 2rem; display: flex; justify-content: space-between; align-items: center;
          flex-wrap: wrap; gap: 1rem;
        }
        .footer-bottom p { color: rgba(255,255,255,0.35); font-size: 0.82rem; }
        .footer-bottom .designer { color: rgba(255,255,255,0.5); font-size: 0.82rem; }
        .footer-bottom .designer span { color: #60A5FA; font-weight: 500; }

        /* ── ANIMATIONS ── */
        @keyframes fadeUp {
          from { opacity: 0; transform: translateY(24px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes fadeDown {
          from { opacity: 0; transform: translateY(-16px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }

        .text-center { text-align: center; }
        .mx-auto { margin-left: auto; margin-right: auto; }
      `}</style>

      {/* HERO */}
      <section className="hero-section">
        <img src={img} alt="Hero" className="hero-bg" />
        <div className="hero-gradient" />
        <div className="hero-grid" />
        <div className="hero-glow" />
        <div className="hero-glow-2" />

        <div className="hero-content">
          <div className="hero-badge">
            <i className="bi bi-lightning-charge-fill"></i>
            Ethiopia's Digital Billing Platform
          </div>
          <h1 className="hero-title">
            Power Your Home.<br />
            <span className="accent">Smart Billing</span> Made Simple.
          </h1>
          <p className="hero-subtitle">
            SmartBill brings modern electricity billing to Ethiopia — accurate, transparent, and effortless for customers, admins, and technicians alike.
          </p>
          <div className="hero-actions">
            <Link to="/register" className="btn-primary">
              Get Started Free <i className="bi bi-arrow-right"></i>
            </Link>
            <Link to="/login" className="btn-outline">
              <i className="bi bi-play-circle"></i> Sign In
            </Link>
          </div>
        </div>

        <div className="hero-scroll">
          Scroll
          <div className="scroll-line" />
        </div>
      </section>

      {/* PILLS */}
      <div className="pills-section">
        <div className="pills-inner">
          {[
            { icon: "bi bi-check2-circle", text: "Accurate Bill Generation" },
            { icon: "bi bi-shield-check", text: "Secure & Transparent" },
            { icon: "bi bi-bell", text: "Real-Time Notifications" },
            { icon: "bi bi-headset", text: "24/7 Customer Support" },
            { icon: "bi bi-graph-up-arrow", text: "Usage Analytics" },
          ].map((p, i) => (
            <div key={i} className="pill">
              <i className={p.icon}></i> {p.text}
            </div>
          ))}
        </div>
      </div>

      {/* SERVICES */}
      <section className="services-section" id="services">
        <div style={{ textAlign: "center", padding: "0 2rem" }}>
          <div className="section-eyebrow" style={{ justifyContent: "center" }}>What We Offer</div>
          <h2 className="section-title">Comprehensive Billing Services</h2>
          <p className="section-desc" style={{ margin: "0 auto" }}>
            A full suite of tools to manage electricity usage, billing accuracy, and customer experience at every level.
          </p>
        </div>
        <div className="services-grid">
          {services.map((item, i) => (
            <div
              key={i}
              className="service-card"
              style={{ "--card-color": item.color, "--card-bg": item.bg }}
            >
              <div className="service-icon">
                <i className={item.icon}></i>
              </div>
              <h3>{item.title}</h3>
              <p>{item.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* FEATURES */}
      <section className="features-section" id="features">
        <div className="features-inner">
          <div className="features-image-wrap">
            <img src={im} alt="SmartBill Features" />
            <div className="features-badge">
              <span>99%</span>
              <p>Billing Accuracy</p>
            </div>
          </div>
          <div>
            <div className="section-eyebrow">Platform Features</div>
            <h2 className="section-title">Everything You Need<br />in One Place</h2>
            <p className="section-desc" style={{ marginBottom: "2.5rem" }}>
              From bill generation to real-time notifications, SmartBill gives customers and admins complete control.
            </p>
            <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
              {[
                { icon: "bi bi-archive", color: "#2563EB", bg: "#EFF6FF", title: "Bill Generation & Management", desc: "Seamlessly generate and manage electricity bills. Monitor usage and track payment history in one place." },
                { icon: "bi bi-activity", color: "#059669", bg: "#F0FDF4", title: "Service Monitoring", desc: "Track electricity consumption and monitor service status, including outages and maintenance schedules." },
                { icon: "bi bi-chat-left-text", color: "#D97706", bg: "#FFFBEB", title: "Complaint Management", desc: "Send and track complaints related to your service. Get real-time status updates on every issue." },
                { icon: "bi bi-broadcast", color: "#7C3AED", bg: "#F5F3FF", title: "Real-Time Updates", desc: "Receive instant notifications on bill status, new tariffs, and service updates via mobile or email." },
              ].map((f, i) => (
                <div key={i} className="feature-item">
                  <div className="feature-icon" style={{ background: f.bg, color: f.color }}>
                    <i className={f.icon}></i>
                  </div>
                  <div>
                    <h4>{f.title}</h4>
                    <p>{f.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* STATS */}
      <section className="stats-section" id="stats" ref={statsRef}>
        <div className="stats-inner">
          <div className="stats-header">
            <div className="section-eyebrow" style={{ color: "#60A5FA", justifyContent: "center" }}>Our Impact</div>
            <h2>What We've Achieved So Far</h2>
            <p>Streamlining electricity billing across Ethiopia — improving accuracy, efficiency, and customer satisfaction.</p>
          </div>
          <div className="stats-grid">
            {stats.map((s, i) => (
              <StatCard key={i} {...s} animate={statsVisible} />
            ))}
          </div>
        </div>
      </section>

      {/* PRICING */}
      <section className="pricing-section" id="pricing">
        <div style={{ textAlign: "center", padding: "0 2rem" }}>
          <div className="section-eyebrow" style={{ justifyContent: "center" }}>Tariff Plans</div>
          <h2 className="section-title">Simple, Transparent Pricing</h2>
          <p className="section-desc" style={{ margin: "0 auto" }}>
            Choose the right tariff plan for your electricity usage and enjoy seamless services.
          </p>
        </div>
        <div className="pricing-grid">
          {tariffs.length === 0 ? (
            // Skeleton / placeholder
            [1,2,3].map(i => (
              <div key={i} className="pricing-card" style={{ opacity: 0.5, animation: "pulse 1.5s infinite" }}>
                <div style={{ height: 20, background: "#E2E8F0", borderRadius: 8, marginBottom: 12 }} />
                <div style={{ height: 40, background: "#E2E8F0", borderRadius: 8, marginBottom: 20, width: "60%" }} />
                <div style={{ height: 12, background: "#E2E8F0", borderRadius: 8, marginBottom: 8 }} />
                <div style={{ height: 12, background: "#E2E8F0", borderRadius: 8, marginBottom: 8, width: "80%" }} />
                <div style={{ height: 40, background: "#E2E8F0", borderRadius: 12, marginTop: 20 }} />
              </div>
            ))
          ) : tariffs.map((tariff, i) => (
            <div key={i} className={`pricing-card${i === 1 ? " featured" : ""}`}>
              {i === 1 && <div className="pricing-badge">Most Popular</div>}
              <div className="pricing-name">{tariff.tariff_name}</div>
              <div className="pricing-price">
                <span className="price-currency">ETB</span>
                <span className="price-amount">{tariff.price}</span>
                <span className="price-unit">/ kWh</span>
              </div>
              <hr className="pricing-divider" />
              <ul className="pricing-list">
                <li><i className="bi bi-check-circle-fill"></i> Units {tariff.unit_min} – {tariff.unit_max} kWh</li>
                <li><i className="bi bi-check-circle-fill"></i> Effective from {tariff.effective_date}</li>
                <li><i className="bi bi-check-circle-fill"></i> Standard billing rate</li>
                <li><i className="bi bi-check-circle-fill"></i> Monthly invoicing</li>
              </ul>
              <Link to="/login">
                <button className="btn-pricing">Choose This Plan</button>
              </Link>
            </div>
          ))}
        </div>
      </section>

      {/* FAQ */}
      <section className="faq-section" id="faq">
        <div className="faq-inner">
          <div>
            <div className="section-eyebrow">Help Center</div>
            <h2 className="section-title">Frequently Asked Questions</h2>
            <p className="section-desc" style={{ marginBottom: "2rem" }}>
              Get answers to your questions about billing, payments, and service-related queries.
            </p>
            <div className="faq-list">
              {faqs.map((faq, i) => (
                <div key={i} className={`faq-item${activeIndex === i ? " open" : ""}`}>
                  <div className="faq-question" onClick={() => toggleFAQ(i)}>
                    <div className="faq-q-text">
                      <i className="bi bi-question-circle-fill"></i>
                      {faq.question}
                    </div>
                    <i className={`bi bi-chevron-down faq-chevron`}></i>
                  </div>
                  <div className="faq-answer">{faq.answer}</div>
                </div>
              ))}
            </div>
          </div>
          <div className="faq-image-wrap">
            <img src={im_g} alt="FAQ Support" />
            <div className="faq-image-badge">
              <i className="bi bi-headset"></i>
              <span>24/7 Support Available</span>
            </div>
          </div>
        </div>
      </section>

      {/* CONTACT */}
      <section className="contact-section" id="contact">
        <div style={{ textAlign: "center", padding: "0 2rem", marginBottom: "3rem" }}>
          <div className="section-eyebrow" style={{ justifyContent: "center" }}>Get In Touch</div>
          <h2 className="section-title">We're Here to Help</h2>
          <p className="section-desc" style={{ margin: "0 auto" }}>
            Have a question about your bill or service? Reach out — our team is ready to assist you.
          </p>
        </div>
        <div className="contact-inner">
          <div className="contact-info-card">
            <h3>Contact Information</h3>
            <p>Fill out the form and we'll get back to you within 24 hours.</p>
            <div className="contact-item">
              <div className="contact-item-icon"><i className="bi bi-geo-alt-fill"></i></div>
              <div>
                <h4>Address</h4>
                <p>Addis Ababa, Ethiopia</p>
              </div>
            </div>
            <div className="contact-item">
              <div className="contact-item-icon"><i className="bi bi-telephone-fill"></i></div>
              <div>
                <h4>Phone</h4>
                <p>+251 11 123 4567</p>
              </div>
            </div>
            <div className="contact-item">
              <div className="contact-item-icon"><i className="bi bi-envelope-fill"></i></div>
              <div>
                <h4>Email</h4>
                <p>support@ethioelectricity.com</p>
              </div>
            </div>
            <div className="contact-socials">
              {["twitter-x","facebook","instagram","linkedin"].map((s,i) => (
                <a key={i} href="#" className="social-btn"><i className={`bi bi-${s}`}></i></a>
              ))}
            </div>
          </div>

          <div className="contact-form-wrap">
            {success && (
              <div className="success-alert">
                <i className="bi bi-check-circle-fill"></i> {success}
              </div>
            )}
            <div className="form-row">
              <div className="form-group">
                <label className="form-label">Your Name</label>
                <input type="text" name="name" placeholder="Abebe Kebede" className="form-input" value={formData.name} onChange={handleChange} />
                {errors.name && <p className="form-error">{errors.name[0]}</p>}
              </div>
              <div className="form-group">
                <label className="form-label">Email Address</label>
                <input type="email" name="email" placeholder="abebe@example.com" className="form-input" value={formData.email} onChange={handleChange} />
                {errors.email && <p className="form-error">{errors.email[0]}</p>}
              </div>
            </div>
            <div className="form-group">
              <label className="form-label">Subject</label>
              <input type="text" name="subject" placeholder="What's this about?" className="form-input" value={formData.subject} onChange={handleChange} />
              {errors.subject && <p className="form-error">{errors.subject[0]}</p>}
            </div>
            <div className="form-group">
              <label className="form-label">Message</label>
              <textarea name="message" rows="5" placeholder="Write your message here..." className="form-input" style={{ resize: "vertical", minHeight: 130 }} value={formData.message} onChange={handleChange}></textarea>
              {errors.message && <p className="form-error">{errors.message[0]}</p>}
            </div>
            <button onClick={handleSubmit} className="btn-submit">
              Send Message <i className="bi bi-send-fill"></i>
            </button>
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="footer" id="footer">
        <div className="footer-inner">
          <div className="footer-top">
            <div className="footer-brand">
              <h3>⚡ SmartBill Ethiopia</h3>
              <p>A reliable and efficient system for managing electricity billing in Ethiopia. Accurate billing, transparent services, and an improved customer experience.</p>
            </div>
            <div style={{ display: "flex", gap: "4rem", flexWrap: "wrap" }}>
              <div>
                <h4 style={{ color: "rgba(255,255,255,0.7)", fontSize: "0.8rem", textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: "1rem", fontWeight: 600 }}>Platform</h4>
                {["Bill Management","Tariff Plans","Complaints","Reports"].map(l => (
                  <div key={l} style={{ marginBottom: "0.6rem" }}>
                    <a href="#" style={{ color: "rgba(255,255,255,0.45)", fontSize: "0.9rem", textDecoration: "none", transition: "color 0.2s" }}
                      onMouseEnter={e => e.target.style.color = "#93C5FD"}
                      onMouseLeave={e => e.target.style.color = "rgba(255,255,255,0.45)"}>{l}</a>
                  </div>
                ))}
              </div>
              <div>
                <h4 style={{ color: "rgba(255,255,255,0.7)", fontSize: "0.8rem", textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: "1rem", fontWeight: 600 }}>Support</h4>
                {["FAQ","Contact Us","Help Center","Privacy Policy"].map(l => (
                  <div key={l} style={{ marginBottom: "0.6rem" }}>
                    <a href="#" style={{ color: "rgba(255,255,255,0.45)", fontSize: "0.9rem", textDecoration: "none", transition: "color 0.2s" }}
                      onMouseEnter={e => e.target.style.color = "#93C5FD"}
                      onMouseLeave={e => e.target.style.color = "rgba(255,255,255,0.45)"}>{l}</a>
                  </div>
                ))}
              </div>
            </div>
          </div>
          <div className="footer-bottom">
            <p>© 2025 Ethiopia Electricity Billing System. All Rights Reserved.</p>
            <p className="designer">Designed by <span>St. Mary's University Seniors</span></p>
          </div>
        </div>
      </footer>
    </>
  );
}

export default Home;