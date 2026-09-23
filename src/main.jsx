import React, { useEffect, useState, useRef } from "react";
import { createRoot } from "react-dom/client";
import {
  ArrowRight,
  BarChart3,
  Check,
  CircleHelp,
  GitCompareArrows,
  Lock,
  LockKeyhole,
  LogIn,
  Menu,
  MessageCircle,
  ShieldCheck,
  UsersRound,
  Send,
  User,
  Edit3,
  X,
  Search,
  Clock,
  CheckCircle2,
  ShieldAlert,
  UserPlus,
  DollarSign,
  GraduationCap,
  Calendar,
  PhoneCall,
  Mail,
  MapPin,
  HelpCircle,
  Award,
  Download,
  FileSpreadsheet,
  TrendingUp,
  UserCheck,
  Filter,
  ExternalLink,
  Save,
  Phone,
  LayoutGrid
} from "lucide-react";
import { supabase, supabaseConfigured } from "./lib/supabase";
import "./styles.css";

// Purge any lingering test data or cached mock profiles
try {
  localStorage.removeItem("iict_profile");
  ["iict_last_inquiry", "iict_inquiries_history"].forEach((key) => {
    const val = localStorage.getItem(key);
    if (val && /(priya|rohan|rahul|sharma|patil|test|demo)/i.test(val)) {
      localStorage.removeItem(key);
    }
  });
} catch {
  // ignore
}

// ── Authoritative 2026–27 IICT Programs (from https://iict.mgmu.ac.in) ────────
const fallbackPrograms = [
  {
    id: "btech-aiml",
    name: "B.Tech in Artificial Intelligence & Machine Learning",
    degree: "B.Tech",
    level: "Undergraduate",
    duration: "4 years",
    annual_tuition_fee: 150000,
    intake_seats: 180,
    description: "Deep neural networks, computer vision, autonomous robotics, natural language processing, LLMs, reinforcement learning and applied ML architectures.",
    eligibility: "10+2 with Physics & Math + Chemistry/CS/IT (min 45% for Open, 40% for Maharashtra Reserved). MGMU-CET 2026 / MHT-CET / JEE Main.",
    career_opportunities: "AI Research Scientist, ML Engineer, NLP Specialist, Computer Vision Engineer"
  },
  {
    id: "btech-cse-ai",
    name: "B.Tech in Computer Science & Engineering (Artificial Intelligence)",
    degree: "B.Tech",
    level: "Undergraduate",
    duration: "4 years",
    annual_tuition_fee: 204500,
    intake_seats: 60,
    description: "Foundational CS engineering (algorithms, systems, operating systems, databases) seamlessly integrated with advanced AI specializations.",
    eligibility: "10+2 with Physics & Math + Chemistry/CS/IT (min 45% for Open, 40% for Maharashtra Reserved). MGMU-CET 2026 / MHT-CET / JEE Main.",
    career_opportunities: "Software Development Engineer (SDE), AI Solutions Architect, Full Stack AI Developer"
  },
  {
    id: "btech-it",
    name: "B.Tech in Information Technology",
    degree: "B.Tech",
    level: "Undergraduate",
    duration: "4 years",
    annual_tuition_fee: 175000,
    intake_seats: 120,
    description: "Cloud computing architectures, enterprise systems development, modern networking, devops pipelines and cybersecurity fundamentals.",
    eligibility: "10+2 with Physics & Math + Chemistry/CS/IT (min 45% for Open, 40% for Maharashtra Reserved). MGMU-CET 2026 / MHT-CET / JEE Main.",
    career_opportunities: "Cloud Architect, DevOps Engineer, Enterprise Software Consultant, Network Specialist"
  },
  {
    id: "btech-ds",
    name: "B.Tech in Data Science",
    degree: "B.Tech",
    level: "Undergraduate",
    duration: "4 years",
    annual_tuition_fee: 150000,
    intake_seats: 60,
    description: "Big data engineering (Apache Spark/Hadoop), statistical modelling, predictive analytics, visualization and business intelligence.",
    eligibility: "10+2 with Physics & Math + Chemistry/CS/IT (min 45% for Open, 40% for Maharashtra Reserved). MGMU-CET 2026 / MHT-CET / JEE Main.",
    career_opportunities: "Data Scientist, Big Data Engineer, Business Intelligence Consultant, Quantitative Analyst"
  },
  {
    id: "btech-dsy",
    name: "B.Tech Direct Second Year (Lateral Entry)",
    degree: "B.Tech",
    level: "Undergraduate",
    duration: "3 years",
    annual_tuition_fee: 150000,
    intake_seats: 420,
    description: "Direct entry into 2nd year B.Tech for polytechnic engineering diploma holders across AI & ML (180), CSE-AI (60), IT (120), and Data Science (60).",
    eligibility: "3-year Engineering Diploma with minimum 45% (40% for Maharashtra Reserved categories) or B.Sc. with Mathematics at 10+2 level.",
    career_opportunities: "Accelerated Engineering Careers in AI, CS, IT, and Analytics"
  },
  {
    id: "mtech-aiml",
    name: "M.Tech in Artificial Intelligence and Machine Learning",
    degree: "M.Tech",
    level: "Postgraduate",
    duration: "2 years",
    annual_tuition_fee: 150000,
    intake_seats: 18,
    description: "Postgraduate research program in generative AI, deep reinforcement learning, cognitive computing and embedded edge intelligence.",
    eligibility: "B.E./B.Tech in CSE/IT/ECE with at least 50% (45% for Reserved). GATE / MGMU-CET PG.",
    career_opportunities: "Principal AI Scientist, Autonomous Systems Specialist, Generative AI Researcher"
  },
  {
    id: "mtech-ds",
    name: "M.Tech in Data Science",
    degree: "M.Tech",
    level: "Postgraduate",
    duration: "2 years",
    annual_tuition_fee: 150000,
    intake_seats: 18,
    description: "Postgraduate research program covering distributed high-performance computing, advanced data mining and decision science.",
    eligibility: "B.E./B.Tech in relevant branch with at least 50% (45% for Reserved). GATE / MGMU-CET PG.",
    career_opportunities: "Chief Data Officer, Principal Data Scientist, AI R&D Lead"
  },
  {
    id: "diploma-cyber",
    name: "Diploma in Cyber Security and Digital Forensics",
    degree: "Diploma",
    level: "Diploma",
    duration: "1 year",
    annual_tuition_fee: 100000,
    intake_seats: 20,
    description: "Practical incident response, ethical hacking, digital forensics, malware analysis and information security compliance.",
    eligibility: "10+2 / HSC from any stream (Science, Commerce, Arts) with minimum 45% (40% for Reserved).",
    career_opportunities: "Cyber Security Analyst, Digital Forensics Examiner, SOC Analyst"
  },
  {
    id: "cert-agentic-ai",
    name: "Certificate Course in Agentic AI",
    degree: "Certificate",
    level: "Certificate",
    duration: "6 months",
    annual_tuition_fee: 50000,
    intake_seats: 50,
    description: "Cutting-edge specialization in Autonomous Multi-Agent Workflows, LangGraph, CrewAI, AutoGen, Vector Databases, and Enterprise Agent Deployment.",
    eligibility: "Graduates, Diploma Holders, or Working Professionals with Python background.",
    career_opportunities: "Agentic AI Developer, LLM Applications Engineer, Automation Specialist"
  }
];

// ── Authoritative 2026–27 Admission Facts & Contacts ─────────────────────────
const fallbackFacts = {
  academic_year: "2026–27",
  institute_name: "Institute of Information and Communication Technology (IICT)",
  university_name: "MGM University",
  director_name: "Dr. Sharvari C. Tamane",
  director_title: "Professor & Director, IICT",
  director_email: "directoriict@mgmu.ac.in",
  admissions_status: "Admissions Open (2026–27 Academic Batch)",
  application_deadline: "September 23, 2026",
  application_fee_domestic: "₹2,000 (Application & MGMU-CET)",
  application_fee_international: "₹5,000",
  caution_money_deposit: "₹5,000 (Refundable)",
  eligibility_fee: "₹5,000",
  scholarships: "150+ Merit-based Scholarships (Up to 100% tuition waivers for top MHT-CET/JEE/HSC rankers), Sports concessions & MahaDBT government schemes",
  university_programs: "310+ Programs across MGM University",
  helpline_phone_1: "+91 940 449 4299",
  helpline_phone_2: "0240-6481000 Ext. 2201",
  helpline_phone_3: "+91 906 761 2000",
  admissions_email: "admissions@mgmu.ac.in",
  iict_office_email: "directoriict@mgmu.ac.in",
  campus_address: "Institute of Information and Communication Technology (IICT), MGM University, MGM Campus, N-6, CIDCO, Chhatrapati Sambhajinagar (Aurangabad) - 431003, Maharashtra, India",
  office_hours: "Monday – Saturday: 9:30 AM – 5:00 PM",
  source_url: "https://iict.mgmu.ac.in"
};

function formatCurrency(val) {
  return "₹" + Number(val).toLocaleString("en-IN");
}

function AnimatedMgmLogo({ onClick }) {
  return (
    <button className="mgm-brand-header-btn" onClick={onClick} title="IICT - MGM University">
      <div className="mgm-logo-emblem-box">
        <img
          src="/LogoMGM.svg"
          alt="MGM University Crest"
          className="mgm-crest-vector"
          onError={(e) => {
            e.currentTarget.src = "https://cdn.mgmtech.org/static/mgmu.ac.in/assets/images/LogoMGM.svg";
          }}
        />
      </div>
      <div className="mgm-brand-divider" />
      <div className="mgm-brand-titles">
        <div className="mgm-brand-row">
          <span className="mgm-brand-univ">MGM UNIVERSITY</span>
          <span className="mgm-brand-badge">NAAC 'A' GRADE</span>
        </div>
        <span className="mgm-brand-inst">Institute of Information &amp; Communication Technology (IICT)</span>
        <span className="mgm-admissions-year">Admissions 2026–27 · Aurangabad</span>
      </div>
    </button>
  );
}

function Header({ onHome, onInquiry, onPrograms, onMyInquiry, onStaff, session, activeNav }) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleNavClick = (callback) => {
    setMobileMenuOpen(false);
    if (callback) callback();
  };

  return (
    <>
      <header className="site-header">
        <AnimatedMgmLogo onClick={() => handleNavClick(onHome)} />
        <nav className="site-nav">
          <button className={activeNav === "home" ? "active" : ""} onClick={onHome}>
            Home
          </button>
          <button className={activeNav === "programs" ? "active" : ""} onClick={onPrograms}>
            Programs &amp; Fees
          </button>
          <button className={activeNav === "inquiry" ? "active" : ""} onClick={onInquiry}>
            Start Inquiry
          </button>
          <button className={activeNav === "myInquiry" ? "active" : ""} onClick={onMyInquiry}>
            Track Inquiry
          </button>
        </nav>
        <div className="header-right">
          <a href="tel:+919404494299" className="header-phone-badge" title="Call IICT Admission Helpline">
            <Phone size={13} />
            <span>+91 940 449 4299</span>
          </a>
          <button className="header-cta-btn" onClick={onInquiry}>
            Apply Now <ArrowRight size={13} />
          </button>
          {session ? (
            <button className="header-signin-btn logged-in" onClick={onStaff} title="Staff Dashboard">
              <ShieldCheck size={13} /> Staff
            </button>
          ) : (
            <button className="header-signin-btn" onClick={onStaff} title="Staff & Teacher Sign In">
              Sign In
            </button>
          )}
          <button
            type="button"
            className="mobile-hamburger-btn"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label={mobileMenuOpen ? "Close menu" : "Open menu"}
          >
            {mobileMenuOpen ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>
      </header>

      {/* Responsive Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="mobile-drawer-overlay" onClick={() => setMobileMenuOpen(false)}>
          <div className="mobile-drawer-content" onClick={(e) => e.stopPropagation()}>
            <div className="mobile-drawer-header">
              <div className="drawer-brand-col">
                <strong>MGM UNIVERSITY</strong>
                <small>IICT Admissions 2026–27</small>
              </div>
              <button
                type="button"
                className="drawer-close-btn"
                onClick={() => setMobileMenuOpen(false)}
                aria-label="Close menu"
              >
                <X size={20} />
              </button>
            </div>

            <nav className="mobile-drawer-nav">
              <button
                type="button"
                className={`drawer-nav-item ${activeNav === "home" ? "active" : ""}`}
                onClick={() => handleNavClick(onHome)}
              >
                <span>Home</span>
                <ArrowRight size={15} />
              </button>
              <button
                type="button"
                className={`drawer-nav-item ${activeNav === "programs" ? "active" : ""}`}
                onClick={() => handleNavClick(onPrograms)}
              >
                <span>Programs &amp; Official Fees</span>
                <ArrowRight size={15} />
              </button>
              <button
                type="button"
                className={`drawer-nav-item ${activeNav === "inquiry" ? "active" : ""}`}
                onClick={() => handleNavClick(onInquiry)}
              >
                <span>Start Live Admission Inquiry</span>
                <ArrowRight size={15} />
              </button>
              <button
                type="button"
                className={`drawer-nav-item ${activeNav === "myInquiry" ? "active" : ""}`}
                onClick={() => handleNavClick(onMyInquiry)}
              >
                <span>Track My Inquiry</span>
                <ArrowRight size={15} />
              </button>
            </nav>

            <div className="mobile-drawer-actions">
              <button
                type="button"
                className="drawer-apply-cta"
                onClick={() => handleNavClick(onInquiry)}
              >
                Start Inquiry / Apply Now <ArrowRight size={14} />
              </button>

              <a href="tel:+919404494299" className="drawer-helpline-link">
                <PhoneCall size={16} />
                <div>
                  <strong>+91 940 449 4299</strong>
                  <small>IICT Admission Helpline (Mon–Sat)</small>
                </div>
              </a>

              <div className="drawer-footer-row">
                {session ? (
                  <button type="button" className="drawer-staff-btn" onClick={() => handleNavClick(onStaff)}>
                    <ShieldCheck size={14} /> Open Staff Portal
                  </button>
                ) : (
                  <button type="button" className="drawer-staff-btn" onClick={() => handleNavClick(onStaff)}>
                    <LogIn size={14} /> Staff / Admin Sign In
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

function Footer({ onStaff }) {
  return (
    <footer className="site-footer">
      <span>AdmitOS · MGM University IICT Admissions</span>
      <span>
        Authoritative 2026–27 information sourced from <a href="http://iict.mgmu.ac.in" target="_blank" rel="noreferrer" style={{ color: "inherit", textDecoration: "underline" }}>iict.mgmu.ac.in</a>. Final application processing handled by MGM University.
      </span>
      <button className="staff-link" onClick={onStaff}>
        Staff / Admin access
      </button>
    </footer>
  );
}

function SetupNotice() {
  return !supabaseConfigured ? (
    <div className="setup-notice">
      <strong>Supabase setup needed</strong>
      <span>
        Add <code>VITE_SUPABASE_URL</code> and <code>VITE_SUPABASE_ANON_KEY</code> to <code>.env.local</code> to enable live submissions and staff access.
      </span>
    </div>
  ) : null;
}

// ── My Inquiry Tracker Modal (Privacy Protected) ──────────────────────────
function MyInquiryModal({ isOpen, onClose, onStartNew }) {
  const [searchCode, setSearchCode] = useState("");
  const [searchResult, setSearchResult] = useState(null);
  const [searched, setSearched] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (isOpen) {
      const stored = localStorage.getItem("iict_last_inquiry");
      if (stored) {
        try {
          const parsed = JSON.parse(stored);
          setSearchResult(parsed);
          setSearchCode(parsed.reference_code || "");
          setSearched(true);
        } catch {
          // ignore
        }
      }
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleSearch = async (e) => {
    e?.preventDefault();
    const code = searchCode.trim().toUpperCase();
    if (!code) return;

    setLoading(true);
    setSearched(true);

    // Try Supabase secure RPC first if configured
    if (supabase) {
      try {
        const { data, error } = await supabase.rpc("get_my_inquiry_status", {
          p_reference_code: code
        });
        if (!error && data) {
          setSearchResult(data);
          setLoading(false);
          return;
        }
      } catch {
        // fallback to local history
      }
    }

    // Fallback: Check local storage
    const storedHistory = localStorage.getItem("iict_inquiries_history");
    let found = null;
    if (storedHistory) {
      try {
        const list = JSON.parse(storedHistory);
        found = list.find((item) => item.reference_code?.toUpperCase() === code);
      } catch {
        // ignore
      }
    }

    if (!found) {
      const last = localStorage.getItem("iict_last_inquiry");
      if (last) {
        try {
          const item = JSON.parse(last);
          if (item.reference_code?.toUpperCase() === code) found = item;
        } catch {
          // ignore
        }
      }
    }

    setSearchResult(found);
    setLoading(false);
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-dialog" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h3>Track Your Admission Inquiry</h3>
          <button type="button" className="modal-close-btn" onClick={onClose}>
            <X size={18} />
          </button>
        </div>

        <form className="tracker-search-row" onSubmit={handleSearch}>
          <input
            type="text"
            placeholder="Enter Reference ID (e.g. IICT-2026-XXXXXX)"
            value={searchCode}
            onChange={(e) => setSearchCode(e.target.value)}
          />
          <button type="submit" className="tracker-search-btn" disabled={loading}>
            {loading ? "..." : "Track"}
          </button>
        </form>

        {searched && (
          <div>
            {searchResult ? (
              <div className="tracker-card">
                <div className="tracker-card-header">
                  <strong>{searchResult.reference_code}</strong>
                  <span className={`tracker-badge ${searchResult.status || "new"}`}>
                    {searchResult.status === "new" ? "New · Under Review" : searchResult.status}
                  </span>
                </div>

                <div className="tracker-row">
                  <span>Candidate Name</span>
                  <strong>{searchResult.student_name}</strong>
                </div>
                <div className="tracker-row">
                  <span>Interested Program</span>
                  <strong>{searchResult.program_interest}</strong>
                </div>
                <div className="tracker-row">
                  <span>Privacy Status</span>
                  <span style={{ color: "#C05A21", fontWeight: 600, fontSize: "11.5px" }}>
                    Student Profile Secured & Hidden from Public
                  </span>
                </div>
                <div className="tracker-row">
                  <span>Counselling Desk Note</span>
                  <span style={{ color: "#374151", fontSize: "12px" }}>
                    An IICT admission counsellor is reviewing your profile for academic evaluation and seat allocation.
                  </span>
                </div>
              </div>
            ) : (
              <div className="tracker-empty">
                <Clock size={28} style={{ margin: "0 auto 8px", color: "#9ca3af" }} />
                <p>No active record found for <strong>"{searchCode}"</strong>.</p>
                <button
                  type="button"
                  className="primary-button"
                  style={{ marginTop: "12px", justifyContent: "center" }}
                  onClick={() => {
                    onClose();
                    onStartNew();
                  }}
                >
                  Start New Admission Inquiry
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

function Home({ onStart, onCompare, onStaff, onMyInquiry, session }) {
  return (
    <div className="home-shell">
      <Header
        onHome={() => {}}
        onInquiry={onStart}
        onPrograms={onCompare}
        onMyInquiry={onMyInquiry}
        onStaff={onStaff}
        session={session}
        activeNav="home"
      />
      <SetupNotice />
      <main className="hero">
        <div className="hero-copy">
          <p className="eyebrow">MGM UNIVERSITY · IICT ADMISSIONS 2026–27</p>
          <h1>
            Find the right
            <br />
            <em>path into IICT.</em>
          </h1>
          <p className="hero-sub">
            Authoritative admission guidance for B.Tech AI & ML, CSE (AI), IT, and Data Science. Get accurate fee structures, eligibility requirements, scholarship details, and connect with the official admission counselling desk.
          </p>
          <div className="hero-actions">
            <button className="primary-button" onClick={onStart}>
              Start Admission Inquiry <ArrowRight size={18} />
            </button>
            <button className="secondary-button" onClick={onCompare}>
              View Official 2026–27 Fees
            </button>
          </div>
          <div className="trust-line">
            <ShieldCheck size={17} />
            <span>
              Official IICT data <b>•</b> 150+ Merit Scholarships <b>•</b> Direct admission-team callback
            </span>
          </div>
        </div>
        <div className="hero-art">
          <div className="art-grid" />
          <div className="art-card art-card-main">
            <span className="art-kicker">IICT / 2026–27</span>
            <span className="art-title">
              Ideas
              <br />
              <strong>into impact.</strong>
            </span>
            <span className="art-note">Institute of Information & Communication Technology · MGM University</span>
          </div>
          <div className="art-card art-card-small">
            <GraduationCap size={16} />
            <span>
              B.Tech Fees from<br />
              <strong>₹1,50,000 / yr</strong>
            </span>
          </div>
          <div className="art-seal">MGM</div>
        </div>
      </main>
      <div className="compare-banner">
        <div>
          <strong>Comparing B.Tech streams for 2026–27?</strong>
          <span>Examine official fees, eligibility criteria, and seats across AI & ML, CSE (AI), IT, and Data Science.</span>
        </div>
        <button className="secondary-button" onClick={onCompare}>
          <GitCompareArrows size={16} /> Compare All Programs
        </button>
      </div>
      <div className="home-footer">
        <span>Admission counselling desk · MGM Campus, N-6, CIDCO</span>
        <span>MGM University · Chhatrapati Sambhajinagar, Maharashtra 431003</span>
        <span>Helpline: +91 940 449 4299 / 0240-6481000 Ext. 2201 / +91 906 761 2000</span>
      </div>
      <Footer onStaff={onStaff} />
    </div>
  );
}

function Compare({ programs, facts, onBack, onInquiry, onMyInquiry, onStaff, session }) {
  const [activeCategory, setActiveCategory] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [viewMode, setViewMode] = useState("boxes"); // "boxes" | "compare"
  const [compareList, setCompareList] = useState(["btech-aiml", "btech-cse-ai", "btech-it", "btech-ds"]);

  const toggleCompare = (id) => {
    setCompareList((prev) => {
      if (prev.includes(id)) {
        return prev.filter((item) => item !== id);
      }
      if (prev.length >= 4) {
        return [...prev.slice(1), id];
      }
      return [...prev, id];
    });
  };

  const filteredPrograms = programs.filter((p) => {
    const matchesCategory =
      activeCategory === "all" ||
      (activeCategory === "ug" && p.level === "Undergraduate" && p.id !== "btech-dsy") ||
      (activeCategory === "dsy" && p.id === "btech-dsy") ||
      (activeCategory === "pg" && p.level === "Postgraduate") ||
      (activeCategory === "diploma" && (p.level === "Diploma" || p.level === "Certificate"));

    const matchesSearch =
      !searchQuery.trim() ||
      p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.career_opportunities.toLowerCase().includes(searchQuery.toLowerCase());

    return matchesCategory && matchesSearch;
  });

  const comparedPrograms = programs.filter((p) => compareList.includes(p.id));

  return (
    <>
      <Header
        onHome={onBack}
        onInquiry={() => onInquiry()}
        onPrograms={() => {}}
        onMyInquiry={onMyInquiry}
        onStaff={onStaff}
        session={session}
        activeNav="programs"
      />
      <main className="programs-boxes-page">
        <div className="programs-header-section">
          <div>
            <p className="eyebrow">OFFICIAL IICT 2026–27 ACADEMIC SCHEDULE</p>
            <h1>Programs &amp; Fee Structure</h1>
            <p className="subtitle">
              Verified annual tuition fees, approved seat matrix, eligibility criteria, and career roles for all programs at the Institute of Information and Communication Technology (IICT), MGM University.
            </p>
          </div>
          <div style={{ display: "flex", gap: "10px", flexWrap: "wrap" }}>
            <div className="view-switcher-group">
              <button
                className={`view-switcher-btn ${viewMode === "boxes" ? "active" : ""}`}
                onClick={() => setViewMode("boxes")}
              >
                <LayoutGrid size={14} /> Program Boxes
              </button>
              <button
                className={`view-switcher-btn ${viewMode === "compare" ? "active" : ""}`}
                onClick={() => setViewMode("compare")}
              >
                <GitCompareArrows size={14} /> Compare Side-by-Side
                {compareList.length > 0 && (
                  <span className="compare-count-badge">{compareList.length}</span>
                )}
              </button>
            </div>
            <button className="primary-button" onClick={() => onInquiry()}>
              Start Inquiry <ArrowRight size={15} />
            </button>
          </div>
        </div>

        {viewMode === "boxes" ? (
          <>
            <div className="program-controls-row">
              <div className="program-category-tabs">
                <button
                  className={`category-tab-btn ${activeCategory === "all" ? "active" : ""}`}
                  onClick={() => setActiveCategory("all")}
                >
                  All Programs ({programs.length})
                </button>
                <button
                  className={`category-tab-btn ${activeCategory === "ug" ? "active" : ""}`}
                  onClick={() => setActiveCategory("ug")}
                >
                  B.Tech UG (4)
                </button>
                <button
                  className={`category-tab-btn ${activeCategory === "dsy" ? "active" : ""}`}
                  onClick={() => setActiveCategory("dsy")}
                >
                  Lateral Entry DSY
                </button>
                <button
                  className={`category-tab-btn ${activeCategory === "pg" ? "active" : ""}`}
                  onClick={() => setActiveCategory("pg")}
                >
                  M.Tech PG (2)
                </button>
                <button
                  className={`category-tab-btn ${activeCategory === "diploma" ? "active" : ""}`}
                  onClick={() => setActiveCategory("diploma")}
                >
                  Diploma &amp; Cert (2)
                </button>
              </div>

              <div className="program-search-box">
                <Search size={15} color="#94A3B8" />
                <input
                  type="text"
                  placeholder="Search branch, e.g. AI, Cloud, Cyber..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
                {searchQuery && (
                  <button
                    style={{ background: "none", border: "none", padding: 0, cursor: "pointer", color: "#94A3B8" }}
                    onClick={() => setSearchQuery("")}
                  >
                    <X size={14} />
                  </button>
                )}
              </div>
            </div>

            <div className="program-box-grid">
              {filteredPrograms.map((p) => {
                const isPopular = p.id === "btech-aiml" || p.id === "btech-cse-ai";
                const isCompared = compareList.includes(p.id);
                return (
                  <div key={p.id} className={`program-card-box ${isPopular ? "featured" : ""}`}>
                    {isPopular && <div className="program-card-badge">HIGH DEMAND 2026–27</div>}
                    <div className="program-card-head">
                      <div className="program-type-tags">
                        <span className="degree-pill">{p.degree}</span>
                        <span className="duration-pill">{p.duration}</span>
                      </div>
                      <span className="intake-pill">
                        <strong>{p.intake_seats}</strong> Seats
                      </span>
                    </div>

                    <h3 className="program-card-title">{p.name}</h3>

                    <div className="program-fee-box">
                      <div className="fee-primary-row">
                        <span className="fee-label">Annual Tuition Fee</span>
                        <span className="fee-amount">
                          {formatCurrency(p.annual_tuition_fee)} <small>/ year</small>
                        </span>
                      </div>
                      <div className="fee-scholarship-note">
                        <Award size={13} />
                        <span>150+ Merit Scholarships up to 100% tuition waiver</span>
                      </div>
                    </div>

                    <p className="program-card-desc">{p.description}</p>

                    <div className="program-detail-block">
                      <span className="detail-block-title">Eligibility Criteria</span>
                      <p className="detail-block-text">{p.eligibility}</p>
                    </div>

                    <div className="program-detail-block">
                      <span className="detail-block-title">Key Career Opportunities</span>
                      <p className="detail-block-roles">{p.career_opportunities}</p>
                    </div>

                    {/* TWO DISTINCT ACTION BUTTONS: DIRECT APPLY & INQUIRE */}
                    <div className="program-card-actions">
                      <a
                        href="https://admissions.mgmu.ac.in/"
                        target="_blank"
                        rel="noreferrer"
                        className="card-direct-apply-btn"
                        title="Direct Application on Official MGM University Portal"
                      >
                        Direct Apply <ExternalLink size={13} />
                      </a>
                      <button
                        className="card-inquire-btn"
                        onClick={() => onInquiry(p.name)}
                        title="Chat with AI Counsellor for this specific program"
                      >
                        <MessageCircle size={13} /> Inquire for This
                      </button>
                    </div>

                    <label className={`card-compare-toggle ${isCompared ? "checked" : ""}`}>
                      <input
                        type="checkbox"
                        checked={isCompared}
                        onChange={() => toggleCompare(p.id)}
                      />
                      <span>{isCompared ? "✓ In Comparison Matrix" : "+ Add to Compare"}</span>
                    </label>
                  </div>
                );
              })}
            </div>
          </>
        ) : (
          /* SIDE-BY-SIDE COMPARISON MATRIX VIEW */
          <div className="compare-matrix-container">
            <div className="compare-matrix-header">
              <div>
                <h3>Side-by-Side Program Comparison Matrix</h3>
                <p style={{ margin: "4px 0 0", color: "#64748B", fontSize: "13px" }}>
                  Select up to 4 programs below to examine exact fees, intake, curriculum, and career pathways.
                </p>
              </div>
              <button
                className="secondary-button"
                onClick={() => setViewMode("boxes")}
                style={{ padding: "8px 14px", fontSize: "12px" }}
              >
                ← Back to Program Cards
              </button>
            </div>

            <div className="compare-picker-chips">
              {programs.map((prog) => {
                const isSel = compareList.includes(prog.id);
                return (
                  <button
                    key={prog.id}
                    className={`compare-chip ${isSel ? "selected" : ""}`}
                    onClick={() => toggleCompare(prog.id)}
                  >
                    {isSel ? <Check size={13} /> : <span style={{ width: 13, height: 13, display: "inline-block" }}>+</span>}
                    {prog.name}
                  </button>
                );
              })}
            </div>

            {comparedPrograms.length === 0 ? (
              <div style={{ textAlign: "center", padding: "40px 20px", color: "#64748B" }}>
                <p>No programs selected. Click any program chip above to start comparing!</p>
              </div>
            ) : (
              <div style={{ overflowX: "auto" }}>
                <table className="compare-matrix-table">
                  <thead>
                    <tr>
                      <th className="col-row-title">Parameter</th>
                      {comparedPrograms.map((p) => (
                        <th key={p.id} className="col-program-head">
                          <span className="degree-pill" style={{ display: "inline-block", marginBottom: "6px" }}>
                            {p.degree} · {p.duration}
                          </span>
                          <strong>{p.name}</strong>
                          <span className="intake-pill">
                            <strong>{p.intake_seats}</strong> Seats
                          </span>
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <th className="col-row-title">Annual Tuition Fee</th>
                      {comparedPrograms.map((p) => (
                        <td key={p.id}>
                          <span className="compare-fee-tag">
                            {formatCurrency(p.annual_tuition_fee)} <small>/ year</small>
                          </span>
                          <div style={{ fontSize: "11px", color: "#C05A21", marginTop: "4px", fontWeight: 600 }}>
                            150+ Merit Scholarships Available
                          </div>
                        </td>
                      ))}
                    </tr>
                    <tr>
                      <th className="col-row-title">Approved Seats</th>
                      {comparedPrograms.map((p) => (
                        <td key={p.id}>
                          <strong style={{ color: "#001E32", fontSize: "15px" }}>{p.intake_seats} seats</strong>
                        </td>
                      ))}
                    </tr>
                    <tr>
                      <th className="col-row-title">Eligibility Criteria</th>
                      {comparedPrograms.map((p) => (
                        <td key={p.id} style={{ fontSize: "12px", lineHeight: "1.5", color: "#334155" }}>
                          {p.eligibility}
                        </td>
                      ))}
                    </tr>
                    <tr>
                      <th className="col-row-title">Curriculum Focus</th>
                      {comparedPrograms.map((p) => (
                        <td key={p.id} style={{ fontSize: "12.5px", lineHeight: "1.5", color: "#475569" }}>
                          {p.description}
                        </td>
                      ))}
                    </tr>
                    <tr>
                      <th className="col-row-title">Career Roles</th>
                      {comparedPrograms.map((p) => (
                        <td key={p.id} style={{ fontSize: "12px", color: "#001E32", fontWeight: 600 }}>
                          {p.career_opportunities}
                        </td>
                      ))}
                    </tr>
                    <tr>
                      <th className="col-row-title">Admissions Action</th>
                      {comparedPrograms.map((p) => (
                        <td key={p.id}>
                          <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
                            <a
                              href="https://admissions.mgmu.ac.in/"
                              target="_blank"
                              rel="noreferrer"
                              className="card-direct-apply-btn"
                            >
                              Direct Apply <ExternalLink size={12} />
                            </a>
                            <button
                              className="card-inquire-btn"
                              onClick={() => onInquiry(p.name)}
                            >
                              <MessageCircle size={12} /> Inquire for This
                            </button>
                          </div>
                        </td>
                      ))}
                    </tr>
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}

        {/* Floating Compare Action Bar in Boxes View */}
        {viewMode === "boxes" && compareList.length >= 2 && (
          <div className="floating-compare-bar">
            <span>{compareList.length} Programs Selected for Comparison</span>
            <button className="floating-compare-btn" onClick={() => setViewMode("compare")}>
              <GitCompareArrows size={14} /> Compare Side-by-Side
            </button>
            <button className="floating-clear-btn" onClick={() => setCompareList([])}>
              Clear
            </button>
          </div>
        )}

        <div className="fee-guidelines-box">
          <div className="guideline-shield-icon">
            <ShieldCheck size={28} />
          </div>
          <div>
            <h4>Verified MGM University IICT Fee &amp; Admission Guidelines (2026–27)</h4>
            <div className="guidelines-grid">
              <div className="guideline-item">
                <CheckCircle2 size={15} color="#C05A21" />
                <span>Application Fee: <b>{facts.application_fee_domestic || "₹2,000"}</b> (Domestic)</span>
              </div>
              <div className="guideline-item">
                <CheckCircle2 size={15} color="#C05A21" />
                <span>Caution Deposit: <b>{facts.caution_money_deposit || "₹5,000"}</b> (100% Refundable)</span>
              </div>
              <div className="guideline-item">
                <CheckCircle2 size={15} color="#C05A21" />
                <span>Eligibility Fee: <b>{facts.eligibility_fee || "₹5,000"}</b> (One-time)</span>
              </div>
              <div className="guideline-item">
                <CheckCircle2 size={15} color="#C05A21" />
                <span>Application Deadline: <b>{facts.application_deadline || "September 23, 2026"}</b></span>
              </div>
              <div className="guideline-item">
                <CheckCircle2 size={15} color="#C05A21" />
                <span>Admission Helpline: <b>{facts.helpline_phone_1 || "+91 940 449 4299"}</b></span>
              </div>
              <div className="guideline-item">
                <CheckCircle2 size={15} color="#C05A21" />
                <span>Office: <b>{facts.helpline_phone_2 || "0240-6481000 Ext. 2201"}</b></span>
              </div>
            </div>
          </div>
        </div>
      </main>
      <Footer onStaff={onStaff} />
    </>
  );
}

// ── AI Counsellor Chatbot Engine (Authoritative Knowledge Base) ───────────
const quickChips = [
  "AI & ML vs CSE (AI)",
  "Data Science vs AI",
  "Low CET Score Options",
  "Check Fees (2026–27)",
  "Scholarships (Up to 100%)",
  "Average & Highest Placements",
  "Hostel & Campus Facilities",
  "Is Degree Valid for UPSC & Abroad?",
  "Can Non-CS Students Learn Coding?",
  "Admission Dates & Documents"
];

function calculateProgress(p) {
  let score = 0;
  if (p.name && p.name.trim().length > 1) score += 20;
  if (p.interested_program && p.interested_program.trim().length > 0) score += 20;
  if (p.academic_background || p.marks_12th || p.marks_10th) score += 20;
  if (p.entrance_exam || p.entrance_score) score += 15;
  if (p.phone && p.phone.trim().length >= 10) score += 15;
  if (p.email && p.email.includes("@")) score += 10;
  return Math.min(100, Math.max(0, score));
}

function parseProfileUpdates(text, currentProfile) {
  const updates = {};
  const lower = text.toLowerCase().trim();

  // 1. Name extraction
  const nameIntroMatch = text.match(/(?:my name is|i am|i'm|myself|this is|call me)\s+([a-zA-Z]+(?:\s+[a-zA-Z]+)?)/i);
  if (nameIntroMatch) {
    const raw = nameIntroMatch[1].trim();
    if (!["interested", "looking", "a", "from", "student", "here", "ready", "applying"].includes(raw.toLowerCase())) {
      updates.name = raw.split(" ").map((w) => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase()).join(" ");
    }
  } else if (!currentProfile.name && text.trim().length >= 2 && text.trim().length <= 30) {
    const words = text.trim().split(/\s+/);
    const keywords = ["fee", "fees", "course", "courses", "ai", "cse", "it", "ds", "scholarship", "cutoff", "eligibility", "when", "how", "what", "where", "hi", "hello", "hey", "yes", "no", "ok", "sure", "help", "compare", "difference", "placement", "hostel"];
    if (words.length >= 1 && words.length <= 3 && words.every((w) => /^[A-Za-z]+$/.test(w)) && !words.some((w) => keywords.includes(w.toLowerCase()))) {
      updates.name = words.map((w) => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase()).join(" ");
    }
  }

  // 2. Phone extraction (10-digit Indian numbers)
  const phoneMatch = text.match(/(?:\+?91[\-\s]?)?([6-9]\d{9})\b/);
  if (phoneMatch) {
    updates.phone = phoneMatch[1];
  }

  // 3. Email extraction
  const emailMatch = text.match(/([a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,})/);
  if (emailMatch) {
    updates.email = emailMatch[1].toLowerCase();
  }

  // 4. Program interest extraction
  if (lower.includes("ai & ml") || lower.includes("ai and ml") || lower.includes("aiml") || (lower.includes("artificial intelligence") && !lower.includes("cse"))) {
    updates.interested_program = "B.Tech in Artificial Intelligence & Machine Learning";
  } else if (lower.includes("cse") || lower.includes("computer science")) {
    updates.interested_program = "B.Tech in Computer Science & Engineering (Artificial Intelligence)";
  } else if (lower.includes("data science") || lower.includes("datascience")) {
    updates.interested_program = "B.Tech in Data Science";
  } else if (lower.includes("information technology") || lower.includes(" it ") || lower === "it") {
    updates.interested_program = "B.Tech in Information Technology";
  } else if (lower.includes("dsy") || lower.includes("lateral") || lower.includes("direct second year") || lower.includes("polytechnic") || lower.includes("diploma")) {
    updates.interested_program = "B.Tech Lateral Entry (DSY)";
  } else if (lower.includes("mtech") || lower.includes("m.tech") || lower.includes("masters")) {
    updates.interested_program = "M.Tech in Data Science";
  } else if (lower.includes("cyber") || lower.includes("security")) {
    updates.interested_program = "PG Diploma in Cyber Security";
  }

  // 5. 12th Marks / Percentage extraction
  const percentMatch = text.match(/(\d{2}(?:\.\d{1,2})?)\s*%/);
  const pcmMatch = text.match(/(?:12th|hsc|pcm|marks|percentage|board|score)\s*[:=]?\s*(\d{2}(?:\.\d{1,2})?)/i);
  if (percentMatch) {
    updates.academic_background = `12th · ${percentMatch[1]}%`;
    updates.marks_12th = parseFloat(percentMatch[1]);
  } else if (pcmMatch && !text.toLowerCase().includes("cet") && !text.toLowerCase().includes("jee")) {
    updates.academic_background = `12th · ${pcmMatch[1]}%`;
    updates.marks_12th = parseFloat(pcmMatch[1]);
  }

  // 6. Entrance exam scores (CET / JEE)
  if (lower.includes("mht-cet") || lower.includes("cet")) {
    const cetScore = text.match(/(\d{2}(?:\.\d{1,2})?)\s*(?:percentile|score|marks|%tile)/i) || text.match(/(?:cet|percentile)\s*[:=]?\s*(\d{2}(?:\.\d{1,2})?)/i);
    if (cetScore) {
      updates.entrance_exam = `MHT-CET · ${cetScore[1]} percentile`;
      updates.entrance_score = parseFloat(cetScore[1]);
    } else {
      updates.entrance_exam = "MHT-CET 2026";
    }
  } else if (lower.includes("jee")) {
    const jeeScore = text.match(/(\d{2}(?:\.\d{1,2})?)\s*(?:percentile|score|marks|%tile)/i) || text.match(/(?:jee|percentile)\s*[:=]?\s*(\d{2}(?:\.\d{1,2})?)/i);
    if (jeeScore) {
      updates.entrance_exam = `JEE (Main) · ${jeeScore[1]} percentile`;
      updates.entrance_score = parseFloat(jeeScore[1]);
    } else {
      updates.entrance_exam = "JEE (Main) 2026";
    }
  }

  // 7. Location extraction
  const mhCities = ["pune", "mumbai", "sambhajinagar", "aurangabad", "nashik", "nagpur", "kolhapur", "solapur", "nanded", "jalna", "latur", "beed", "ahmednagar", "satara", "thane", "navi mumbai", "maharashtra"];
  if (mhCities.some((city) => lower.includes(city))) {
    updates.location = "Maharashtra";
  } else if (lower.includes("outside") || lower.includes("other state") || lower.includes("delhi") || lower.includes("gujarat") || lower.includes("bihar") || lower.includes("madhya pradesh")) {
    updates.location = "Other State (All India)";
  }

  // 8. Questions / Topics noted
  const notes = [];
  if (lower.includes("fee") || lower.includes("tuition") || lower.includes("cost")) notes.push("Fees");
  if (lower.includes("scholarship") || lower.includes("concession") || lower.includes("waiver")) notes.push("Scholarships");
  if (lower.includes("hostel") || lower.includes("accommodation") || lower.includes("stay")) notes.push("Hostel");
  if (lower.includes("placement") || lower.includes("package") || lower.includes("recruit") || lower.includes("salary")) notes.push("Placements");
  if (notes.length > 0) {
    const existing = currentProfile.questions_noted ? currentProfile.questions_noted.split(" · ") : [];
    const merged = Array.from(new Set([...existing, ...notes]));
    updates.questions_noted = merged.join(" · ");
  }

  return updates;
}

function generateCounsellorReply(text, p) {
  const q = text.toLowerCase().trim();

  // Check if student wants to confirm or submit inquiry directly
  if (
    (q === "yes" || q === "submit" || q === "confirm" || q === "apply" || q.includes("submit inquiry") || q.includes("submit my inquiry") || q.includes("please submit") || q.includes("confirm inquiry") || q.includes("confirm admission")) &&
    p.name && (p.phone || p.email)
  ) {
    return {
      text: `Excellent, ${p.name}! I am submitting your official priority admission inquiry to the IICT Admissions Committee right now...`,
      actionType: "submit_now",
      suggestions: []
    };
  }

  let answer = "";
  let suggestions = [];

  // ─────────────────────────────────────────────────────────────
  // 1. Comparison: AI & ML vs CSE (Artificial Intelligence)
  // ─────────────────────────────────────────────────────────────
  if (
    (q.includes("ai") && (q.includes("cse") || q.includes("computer science"))) ||
    q.includes("ai vs cse") ||
    q.includes("cse vs ai") ||
    q.includes("difference between ai and cse")
  ) {
    answer = `🎯 **Detailed Comparison: B.Tech AI & ML vs B.Tech CSE (AI)**

Both are premier 4-year engineering programs at IICT, but they cater to distinct technical aspirations:

• **B.Tech CSE (Artificial Intelligence)** (Annual Fee: ₹2,04,500/yr):
  - **Curriculum**: Comprehensive classical computer science foundation (Operating Systems, Compiler Design, Database Architecture, Computer Networks, Algorithms) combined with advanced AI & ML specialization.
  - **Career Path**: Universal eligibility for all Software Development Engineer (SDE) roles at global tech giants (Google, Microsoft, Amazon, Oracle), as well as AI engineering roles.
  - **Best For**: Students who want maximum versatility across all software domains with an added AI advantage.

• **B.Tech Artificial Intelligence & Machine Learning** (Annual Fee: ₹1,50,000/yr):
  - **Curriculum**: Direct immersion into intelligent systems from Semester 3 onwards: Deep Neural Networks, Natural Language Processing, Computer Vision, Robotics, Generative AI & Large Language Models (LLMs).
  - **Career Path**: Pure-play AI Engineer, ML Research Scientist, Computer Vision Specialist, and Autonomous Systems Developer.
  - **Cost Advantage**: ₹1.50 Lakhs/yr (saving over ₹2.18 Lakhs across 4 years compared to CSE, with identical eligibility for top IT recruiters).

💡 **Summary**: If you love deep generative models and high-growth AI startups, choose **AI & ML**. If you want a broad classical CS degree with AI specialization, choose **CSE (AI)**.`;
    suggestions = [
      "Check B.Tech AI Fees",
      "Placements for AI vs CSE",
      "Low CET Score Options",
      "Check Eligibility Criteria"
    ];
  }

  // ─────────────────────────────────────────────────────────────
  // 2. Comparison: AI & ML vs Data Science
  // ─────────────────────────────────────────────────────────────
  else if (
    (q.includes("data science") || q.includes("datascience") || q.includes("ds")) &&
    (q.includes("ai") || q.includes("difference") || q.includes("compare") || q.includes("vs"))
  ) {
    answer = `📊 **Comparison: B.Tech AI & ML vs B.Tech Data Science**

Both programs share the same affordable annual tuition fee of **₹1,50,000 / year**, but focus on different core technologies:

• **B.Tech Data Science**:
  - **Core Focus**: Big Data Engineering, Statistical Analytics, Predictive Modeling, Business Intelligence, and Data Visualization.
  - **Key Technologies**: Apache Spark, Hadoop, SQL/NoSQL, Tableau, PowerBI, Python/R, Predictive ML.
  - **Top Industries**: Investment Banking, FinTech, E-commerce, Healthcare Analytics, Management Consulting (Morgan Stanley, Goldman Sachs, Deloitte, Amazon).

• **B.Tech AI & ML**:
  - **Core Focus**: Autonomous intelligent agents that sense, perceive, and act independently.
  - **Key Technologies**: PyTorch, TensorFlow, OpenCV, Reinforcement Learning, Transformers, LLMs, Robotics.
  - **Top Industries**: Autonomous Vehicles, Robotics, Generative AI, Drone Intelligence, Medical Imaging.

💡 **Verdict**: If you enjoy business insights, financial data, and predictive forecasting, choose **Data Science**. If you want to build intelligent robots, voice assistants, and self-learning algorithms, choose **AI & ML**!`;
    suggestions = [
      "Data Science Placements",
      "Check Fees (2026–27)",
      "Compare AI vs CSE",
      "Reserve Seat in Data Science"
    ];
  }

  // ─────────────────────────────────────────────────────────────
  // 3. Comparison: Information Technology (IT) vs CSE / AI
  // ─────────────────────────────────────────────────────────────
  else if (
    q.includes("it vs") ||
    q.includes("information technology") ||
    q.includes("difference between it") ||
    (q.includes("it") && (q.includes("better") || q.includes("cse") || q.includes("scope") || q.includes("worth")))
  ) {
    answer = `☁️ **B.Tech Information Technology (IT) vs CSE & AI**

Many students mistakenly believe IT is secondary to CSE. In reality, in the software industry, **IT and CSE graduates are treated with 100% equal eligibility** for software engineering, cloud, and product development jobs!

• **What Makes B.Tech IT Unique at IICT (₹1,75,000/yr)**:
  - **Core Pillars**: Cloud Computing (AWS, Azure, GCP), DevOps & CI/CD Pipelines, Enterprise Cybersecurity, Distributed Systems, and Full-Stack Web Technologies.
  - **Industry Reality**: Over 70% of enterprise software today runs on cloud infrastructure. IT graduates directly step into Cloud Architect, DevOps Engineer, and Enterprise Security roles, which command premium starting salaries.
  - **Placement Parity**: Top tier-1 recruiters (TCS Digital, Persistent, Infosys, Tech Mahindra, Cognizant) interview IT students on the exact same salary bands as CSE.`;
    suggestions = [
      "Check B.Tech IT Fees",
      "Cloud & DevOps Packages",
      "Eligibility Criteria",
      "Apply for B.Tech IT"
    ];
  }

  // ─────────────────────────────────────────────────────────────
  // 4. Comparison: B.Tech vs BCA / B.Sc Computer Science
  // ─────────────────────────────────────────────────────────────
  else if (q.includes("bca") || q.includes("bsc") || q.includes("b.sc") || q.includes("btech vs")) {
    answer = `🎓 **Why a 4-Year B.Tech is Far Superior to BCA or B.Sc:**

If you are confused between pursuing a 3-year BCA/B.Sc or a 4-year B.Tech in engineering, here are the crucial differences:

1. **Starting Salary & Package Ceiling**:
   - **B.Tech Graduate**: Average ₹5.0–6.5 LPA, with top product packages reaching ₹10–18+ LPA.
   - **BCA / B.Sc Graduate**: Average ₹2.5–3.5 LPA, primarily in technical support or manual testing.

2. **Global & MS Abroad Eligibility**:
   - B.Tech is a 4-year professional engineering degree compliant with the **Washington Accord**. You can directly apply for Master’s (MS/MBA) in the USA, Canada, Germany, and UK without requiring an extra bridge year.
   - 3-year BCA/B.Sc degrees often face 16-year education requirement hurdles abroad.

3. **Career Growth & Tier-1 Hiring**:
   - Top tech companies (Amazon, Microsoft, Persistent, Capgemini) restrict their core Software Development Engineer (SDE) and AI Architect campus drives strictly to B.Tech engineers.`;
    suggestions = [
      "Check B.Tech Fees",
      "Scholarships (Up to 100%)",
      "Low CET Score Options",
      "Explore All Programs"
    ];
  }

  // ─────────────────────────────────────────────────────────────
  // 5. Which Branch is Best / Highest Package / Highest Scope
  // ─────────────────────────────────────────────────────────────
  else if (
    q.includes("best course") ||
    q.includes("which course is best") ||
    q.includes("highest package") ||
    q.includes("highest salary") ||
    q.includes("more scope") ||
    q.includes("future scope") ||
    q.includes("which branch") ||
    q.includes("which should i choose")
  ) {
    answer = `🚀 **Which Engineering Branch is Best for You?**

At IICT, every single branch is specialized in convergence technologies. Here is how they stack up by career trajectory:

1. **B.Tech CSE (Artificial Intelligence)**:
   - **Advantage**: The #1 universally accepted tech degree worldwide. Highest volume of on-campus placement opportunities across both classic software engineering and modern AI.

2. **B.Tech Artificial Intelligence & Machine Learning**:
   - **Advantage**: Fastest-growing salary curve globally. Extreme demand for generative AI, LLM fine-tuning, and robotics engineers. Best tuition ROI (₹1.50L/yr).

3. **B.Tech Data Science**:
   - **Advantage**: Massive corporate demand in financial services, fintech, healthcare, and consulting. Highly valued for strategic leadership roles.

4. **B.Tech Information Technology**:
   - **Advantage**: High placement stability in enterprise cloud systems, DevOps automation, and cybersecurity.

💡 **Recommendation**: If you want the most versatile all-rounder degree, choose **CSE (AI)**. If you are deeply motivated by generative AI and want the highest ROI, choose **AI & ML**!`;
    suggestions = [
      "AI & ML vs CSE (AI)",
      "Check Fees Schedule",
      "Placement Highlights",
      "Check Eligibility Criteria"
    ];
  }

  // ─────────────────────────────────────────────────────────────
  // 6. Low CET / Low JEE / Low Marks Fears & Reassurance
  // ─────────────────────────────────────────────────────────────
  else if (
    (q.includes("low") || q.includes("less") || q.includes("drop") || q.includes("failed") || q.includes("poor") || q.includes("didn't get") || q.includes("did not get") || q.includes("rank") || q.includes("can i get") || q.includes("is it possible") || q.includes("marks kam") || q.includes("score kam")) &&
    (q.includes("cet") || q.includes("jee") || q.includes("score") || q.includes("percentile") || q.includes("marks") || q.includes("admission") || q.includes("seat"))
  ) {
    answer = `🌟 **Don't Worry! You Can Definitely Secure Admission at MGM University IICT!**

A lower score in MHT-CET or JEE (even 40–70 percentile, or low 12th marks) does **NOT** stop you from pursuing high-demand B.Tech in AI, CSE, or Data Science. Here is why:

1. **MGMU-CET 2026 (Your Second Chance)**:
   - MGM University conducts its own standardized online entrance exam (**MGMU-CET 2026**).
   - It is designed with a student-friendly format and **NO negative marking**. You receive a fresh, fair opportunity to qualify regardless of state CET scores!

2. **Direct 12th Board PCM Eligibility**:
   - As per official AICTE & Government of Maharashtra guidelines, if you have passed 10+2 with **minimum 45% aggregate in PCM** (Physics, Mathematics, plus Chemistry/CS/IT/Bio) — or **40% for reserved category** (SC/ST/OBC/EWS/PwD) — you are legally eligible for Institutional Merit Seats.

3. **Early Provisional Seat Reservation**:
   - Admissions are offered on a rolling merit basis. By completing provisional registration now, you can lock in your preferred branch before institutional quotas fill up!`;
    suggestions = [
      "How to take MGMU-CET?",
      "12th PCM Merit Criteria",
      "Reserve Provisional Seat",
      "Talk to Admissions Counsellor"
    ];
  }

  // ─────────────────────────────────────────────────────────────
  // 7. Direct Admission / Without CET / Management Quota
  // ─────────────────────────────────────────────────────────────
  else if (
    q.includes("without cet") ||
    q.includes("without jee") ||
    q.includes("direct admission") ||
    q.includes("management quota") ||
    q.includes("institutional quota") ||
    q.includes("donation") ||
    q.includes("capitation")
  ) {
    answer = `🏛️ **Official Policy: Direct Admission & Institutional Merit Seats**

• **Zero Donation / Zero Capitation**:
  MGM University follows a strict, ethical transparent admissions code. There is **zero capitation fee or donation**. All admissions are based on transparent institutional merit and statutory eligibility.

• **Can You Apply Without MHT-CET or JEE?**:
  **YES!** If you did not appear for MHT-CET or JEE, you can appear for the **MGMU-CET 2026 online test** conducted directly by the university upon completing your registration.

• **Eligibility for Direct Institutional Quota**:
  1. Passed 10+2 (HSC) with Physics & Mathematics + Chemistry/CS/IT/Bio.
  2. Minimum 45% aggregate in PCM (40% for Maharashtra reserved categories: SC/ST/OBC/EWS).
  3. Valid score in MHT-CET 2026, JEE Main 2026, or MGMU-CET 2026.`;
    suggestions = [
      "Register for MGMU-CET",
      "Check Fee Schedule",
      "Required Documents",
      "Talk to Counsellor"
    ];
  }

  // ─────────────────────────────────────────────────────────────
  // 8. Degree Validity: UGC Recognition, UPSC, GATE, MS Abroad
  // ─────────────────────────────────────────────────────────────
  else if (
    q.includes("ugc") ||
    q.includes("valid") ||
    q.includes("recogni") ||
    q.includes("govt job") ||
    q.includes("government job") ||
    q.includes("upsc") ||
    q.includes("mpsc") ||
    q.includes("gate") ||
    q.includes("abroad") ||
    q.includes("wes") ||
    q.includes("ms in") ||
    q.includes("fake") ||
    q.includes("private university")
  ) {
    answer = `🏛️ **Authoritative Statutory Credentials & Degree Recognition:**

MGM University is a premier, fully recognized institution with highest academic credentials:

• **UGC Recognition**:
  MGM University is established under Maharashtra Act No. XXVI of 2019 and is recognized by the **University Grants Commission (UGC)** under Section 2(f) of the UGC Act, 1956.

• **100% Eligible for All Government Jobs & Exams**:
  Graduates are fully eligible for:
  - **Civil Services**: UPSC (IAS, IPS, IFS), MPSC (State Services), IES (Indian Engineering Services).
  - **Competitive Technical Exams**: GATE (for M.Tech at IITs/NITs and PSU recruitments).
  - **Public Sector Undertakings (PSUs)**: ISRO, DRDO, BARC, IOCL, ONGC, BHEL, NTPC.

• **Global Recognition for MS Abroad (WES Approved)**:
  Degrees awarded by MGM University are recognized worldwide by **WES (World Education Services)** for direct admission to Master’s (MS/MBA) and Ph.D. programs in the USA, Canada, UK, Germany, and Australia.

• **44-Year Heritage**:
  The Mahatma Gandhi Mission (MGM) trust has been a pioneer in higher education since **1982**, with over 1,00,000+ alumni leading industries globally.`;
    suggestions = [
      "Why Choose MGM University?",
      "Placement Highlights",
      "Fee Schedule 2026-27",
      "Book Campus Tour"
    ];
  }

  // ─────────────────────────────────────────────────────────────
  // 9. Why Choose MGM University IICT vs Pune / Mumbai Colleges
  // ─────────────────────────────────────────────────────────────
  else if (
    q.includes("why mgm") ||
    q.includes("why choose") ||
    q.includes("pune") ||
    q.includes("mumbai") ||
    q.includes("other college") ||
    q.includes("compare college") ||
    q.includes("mit") ||
    q.includes("vit") ||
    q.includes("coep") ||
    q.includes("why iict")
  ) {
    answer = `🏆 **Why Choose MGM University IICT Over Other Colleges?**

Here is why hundreds of students from Pune, Mumbai, Nashik, and across Maharashtra choose IICT:

1. **Specialized Convergence Tech Institute**:
   While most colleges treat AI or Data Science as a generic sub-branch of an aging mechanical/civil engineering college, IICT is built from the ground up exclusively for future technologies.

2. **NVIDIA GPU & AI Research Clusters**:
   Undergraduates get hands-on access to dedicated High-Performance Computing (HPC) labs, GPU clusters, and IoT/Robotics workstations.

3. **Tremendous Cost & Living Advantage**:
   - Pune/Mumbai private colleges charge **₹2.5L to ₹4.5L/year** tuition + ₹1.5L to ₹2.5L hostel/living costs (total ₹16–28 Lakhs for 4 years).
   - At MGMU IICT, tuition starts at just **₹1.50L/year** with serene, highly affordable on-campus living, saving over **₹10 to ₹14 Lakhs** with equal or superior tech placement opportunities!

4. **150+ Merit Scholarships**:
   Up to 100% tuition waivers for merit holders, plus complete facilitation for state MahaDBT scholarships.

5. **Magnificent 70-Acre Campus**:
   Olympic-size sports stadium, cricket grounds, swimming pool, badminton arena, music academy, and 1000-bed on-campus MGM Medical Hospital.`;
    suggestions = [
      "Check 100% Scholarships",
      "Hostel & Living Costs",
      "Placement Packages",
      "Book Campus Tour"
    ];
  }

  // ─────────────────────────────────────────────────────────────
  // 10. Placements, Recruiters, and Salary Packages
  // ─────────────────────────────────────────────────────────────
  else if (
    q.includes("placement") ||
    q.includes("package") ||
    q.includes("salary") ||
    q.includes("company") ||
    q.includes("recruit") ||
    q.includes("highest") ||
    q.includes("average") ||
    q.includes("job")
  ) {
    answer = `💼 **IICT Official Placement Highlights (2026–27):**

• **Salary Highlights**:
  - **Highest Packages**: **₹10.0 LPA to ₹18.0+ LPA** in niche AI, Cloud, and Software Product startups.
  - **Average Package**: **₹5.0 LPA to ₹6.5 LPA** across tier-1 software companies.

• **Key Recruiters**:
  Tata Consultancy Services (TCS Digital/Ninja), Infosys, Persistent Systems, Tech Mahindra, Cognizant, Capgemini, L&T Technology Services, Wipro, and emerging AI & Data Science startups.

• **How IICT Prepares You for Top Tech Offers**:
  1. **Year 2 Onwards**: Rigorous competitive programming on LeetCode & HackerRank, Data Structures & Algorithms (DSA), and Full-Stack development.
  2. **Certifications**: Integrated industry certifications with AWS Academy, Google Cloud, and NVIDIA Deep Learning Institute (DLI).
  3. **Mandatory Paid Internships**: 6th & 8th semester industry internships giving real corporate engineering experience.
  4. **Mock Technical & HR Panels**: Conducted by alumni and senior corporate hiring managers.`;
    suggestions = [
      "Check Course Fees",
      "AI vs CSE Placements",
      "Do I need coding experience?",
      "Apply for Admission"
    ];
  }

  // ─────────────────────────────────────────────────────────────
  // 11. Beginner Coding Fears / Non-CS Background
  // ─────────────────────────────────────────────────────────────
  else if (
    q.includes("coding") ||
    q.includes("beginner") ||
    q.includes("never coded") ||
    q.includes("biology") ||
    q.includes("difficult") ||
    q.includes("tough") ||
    q.includes("non cs") ||
    q.includes("hard") ||
    q.includes("programming") ||
    q.includes("learn code")
  ) {
    answer = `💡 **Never Coded Before? Don't Worry at All!**

Over **60% of students entering first-year engineering** have never written a single line of code, or studied Biology/General Science in 11th & 12th. You will do exceptionally well!

• **How IICT Mentors Beginners Step-by-Step**:
  1. **Taught from Absolute Ground Zero**: Semester 1 begins with "Computational Thinking & Python Programming" assuming zero prior experience. Everything is explained from the very basics.
  2. **1:2 Theory to Lab Ratio**: For every 1 hour of classroom concept, you spend 2 hours in modern computer labs with faculty mentors assisting you line by line.
  3. **Student Coding Clubs & Hackathons**: Our Google Developer Student Club (GDSC) and AI Squad organize friendly peer-to-peer coding bootcamps where seniors mentor first-year students.
  4. **Rapid Progress**: Within 6 months, even absolute beginners build their first web apps and machine learning models with confidence!`;
    suggestions = [
      "Compare AI vs CSE",
      "Check Fees (2026-27)",
      "Talk to Faculty Mentor",
      "Eligibility Criteria"
    ];
  }

  // ─────────────────────────────────────────────────────────────
  // 12. Fees, Installments & Education Loans
  // ─────────────────────────────────────────────────────────────
  else if (
    q.includes("fee") ||
    q.includes("cost") ||
    q.includes("tuition") ||
    q.includes("installment") ||
    q.includes("loan") ||
    q.includes("bank") ||
    q.includes("afford") ||
    q.includes("expense") ||
    q.includes("charges") ||
    q.includes("check fees")
  ) {
    answer = `💰 **Official 2026–27 Annual Tuition Fee Schedule:**

• **B.Tech Artificial Intelligence & Machine Learning**: ₹1,50,000 / year
• **B.Tech Data Science**: ₹1,50,000 / year
• **B.Tech Information Technology**: ₹1,75,000 / year
• **B.Tech CSE (Artificial Intelligence)**: ₹2,04,500 / year
• **B.Tech Lateral Entry (Direct Second Year - DSY)**: ₹1,50,000 / year
• **M.Tech (Data Science / AI & ML)**: ₹1,50,000 / year
• **PG Diploma in Cyber Security**: ₹1,00,000 / year

• **Payment in Convenient Installments**:
  Yes! Tuition fees can be paid in semester installments to ease family financial planning.

• **100% Education Loan Support**:
  MGM University has institutional tie-ups with **SBI, HDFC Bank, Bank of Maharashtra, and Punjab National Bank**. We provide official Bonafide and Fee Estimates for rapid loan sanction letters with zero collateral up to ₹7.5 Lakhs.

• **150+ Merit Scholarships**: 25% to 100% tuition waivers awarded annually!`;
    suggestions = [
      "Scholarship Eligibility",
      "Hostel & Mess Charges",
      "Education Loan Process",
      "Confirm Admission"
    ];
  }

  // ─────────────────────────────────────────────────────────────
  // 13. Scholarships (150+ Merit Scholarships & MahaDBT)
  // ─────────────────────────────────────────────────────────────
  else if (
    q.includes("scholarship") ||
    q.includes("waiver") ||
    q.includes("concession") ||
    q.includes("discount") ||
    q.includes("financial aid") ||
    q.includes("mahadbt") ||
    q.includes("ebc") ||
    q.includes("caste") ||
    q.includes("sc") ||
    q.includes("st") ||
    q.includes("obc")
  ) {
    answer = `🎖️ **MGM University Scholarships & Financial Assistance (2026–27):**

MGM University is dedicated to ensuring no deserving student is denied quality education due to financial constraints:

1. **MGM University Merit Scholarships (150+ Awarded Annually)**:
   • **100% Tuition Waiver**: For state board/CBSE toppers (>95%) and top MHT-CET/JEE percentiles.
   • **50% Tuition Waiver**: For students scoring 85% to 94.9% in 12th Board.
   • **25% Tuition Waiver**: For students scoring 75% to 84.9% in 12th Board.

2. **Government of Maharashtra (MahaDBT) Welfare Schemes**:
   • **SC / ST Students**: **100% Tuition Fee Waiver** facilitated directly through the social welfare portal.
   • **OBC / EBC / SEBC / VJNT / SBC Students**: **50% Tuition Fee Concession** through the state portal.

3. **Sports & Special Concessions**:
   Special scholarships awarded to district, state, and national sports achievers.`;
    suggestions = [
      "Calculate My Scholarship",
      "Check 12th Eligibility",
      "Tuition Fee Schedule",
      "Apply with Scholarship"
    ];
  }

  // ─────────────────────────────────────────────────────────────
  // 14. Hostels, Mess, Food, Safety & Campus Life
  // ─────────────────────────────────────────────────────────────
  else if (
    q.includes("hostel") ||
    q.includes("mess") ||
    q.includes("stay") ||
    q.includes("accommodation") ||
    q.includes("room") ||
    q.includes("food") ||
    q.includes("safety") ||
    q.includes("girls") ||
    q.includes("ragging") ||
    q.includes("campus") ||
    q.includes("facility")
  ) {
    answer = `🏡 **Campus Life, Hostels & Safety Amenities:**

• **On-Campus Secure Hostels**:
  - Separate high-security hostels for boys and girls located inside the secure university boundary.
  - Biometric turnstile entry, 24/7 CCTV surveillance, and dedicated female wardens for girls' hostels.
  - Strict Zero-Tolerance Anti-Ragging regulations with active flying squads.

• **Room & Living Amenities**:
  - Clean twin and triple sharing rooms with study tables, ergonomic chairs, wardrobes, and high-speed Wi-Fi.
  - 24/7 power backup, pure drinking water with multi-stage RO filtration, and on-campus laundry service.

• **Hygienic Dining Mess**:
  - Wholesome, nutritious pure vegetarian breakfast, lunch, high-tea, and dinner planned by a joint student-faculty mess committee.

• **Medical & Sports Support**:
  - Round-the-clock emergency healthcare at the adjacent **1000-bed MGM Medical College & Hospital** (free/subsidized OPD for students).
  - Olympic-standard cricket ground, synthetic running tracks, indoor badminton courts, swimming pool, and modern gym.`;
    suggestions = [
      "Check Tuition Fees",
      "Campus Location & Map",
      "Book Campus Visit",
      "Talk to Admissions"
    ];
  }

  // ─────────────────────────────────────────────────────────────
  // 15. Branch Change & Lateral Entry (Direct Second Year - DSY)
  // ─────────────────────────────────────────────────────────────
  else if (
    q.includes("branch change") ||
    q.includes("change branch") ||
    q.includes("switch branch") ||
    q.includes("dsy") ||
    q.includes("diploma") ||
    q.includes("lateral") ||
    q.includes("polytechnic")
  ) {
    answer = `🔄 **Branch Change & Lateral Entry (DSY) Opportunities:**

• **Branch Change Facility**:
  Yes! If you join one program (such as B.Tech IT or Data Science) and perform strongly in your First Year (Semesters 1 & 2), you can apply for internal sliding/branch change to CSE (AI) or AI & ML based on first-year CGPA merit and seat vacancies.

• **Direct Second Year (DSY) Lateral Entry for Polytechnic Diploma Holders**:
  - **Eligibility**: Passed 3-year Engineering Diploma with minimum **45% aggregate** (40% for reserved category SC/ST/OBC/EWS).
  - **Course Duration**: 3 Years directly (admitted into Semester 3).
  - **Annual Tuition Fee**: ₹1,50,000 / year.
  - **Branches Open**: B.Tech AI & ML, B.Tech CSE (AI), B.Tech IT, and B.Tech Data Science.`;
    suggestions = [
      "Apply for DSY",
      "Check DSY Fees",
      "Required Documents",
      "Talk to Counsellor"
    ];
  }

  // ─────────────────────────────────────────────────────────────
  // 16. Admission Process, Important Dates & Documents Required
  // ─────────────────────────────────────────────────────────────
  else if (
    q.includes("document") ||
    q.includes("how to apply") ||
    q.includes("procedure") ||
    q.includes("steps") ||
    q.includes("process") ||
    q.includes("last date") ||
    q.includes("deadline") ||
    q.includes("schedule") ||
    q.includes("date") ||
    q.includes("admission date")
  ) {
    answer = `📅 **Admission Process, Important Dates & Required Documents (2026–27):**

• **4-Step Simple Admission Procedure**:
  1. **Step 1: Submit Application**: Register your profile right here in this portal.
  2. **Step 2: Scorecard Verification**: Submit 10th/12th marks and CET/JEE/MGMU-CET scores.
  3. **Step 3: Provisional Seat Offer**: Merit seat allocation letter issued by the Admissions Directorate.
  4. **Step 4: Admission Confirmation**: Pay initial token fee to lock your seat reservation.

• **Key Dates**:
  - **Active Admissions Round**: Open now until **September 23, 2026**.
  - **MGMU-CET Slot**: Online test link generated immediately upon application.

• **Required Documents Checklist**:
  1. 10th (SSC) & 12th (HSC) Marksheets
  2. MHT-CET 2026 / JEE Main 2026 Scorecard (or MGMU-CET test confirmation)
  3. School/College Leaving Certificate (Transfer Certificate - TC)
  4. Domicile & Nationality Certificate (or Birth Certificate)
  5. Caste Certificate & Caste Validity (for reserved categories: SC/ST/OBC/VJNT)
  6. Aadhaar Card copy & 4 Passport size photographs`;
    suggestions = [
      "Reserve Provisional Seat",
      "Check Fees (2026-27)",
      "Talk to Admissions",
      "Check Eligibility"
    ];
  }

  // ─────────────────────────────────────────────────────────────
  // 17. Campus Visit & Location
  // ─────────────────────────────────────────────────────────────
  else if (
    q.includes("visit") ||
    q.includes("location") ||
    q.includes("where is") ||
    q.includes("address") ||
    q.includes("map") ||
    q.includes("tour") ||
    q.includes("city") ||
    q.includes("aurangabad") ||
    q.includes("sambhajinagar")
  ) {
    answer = `📍 **Campus Location & Guided Visit Information:**

• **Campus Address**:
  MGM University Institute of Interdisciplinary & Convergence Technology (IICT),
  MGM Campus, N-6, CIDCO, Chhatrapati Sambhajinagar (Aurangabad), Maharashtra 431003.

• **Convenient Connectivity**:
  - 10 minutes from Central Bus Station (CBS).
  - 15 minutes from Chhatrapati Sambhajinagar Railway Station.
  - 10 minutes from Chikalthana Airport (IXU).

• **Campus Tour & Office Timings**:
  Open Monday through Saturday, **9:30 AM to 5:00 PM**.
  You and your parents are warmly invited to tour our state-of-the-art AI laboratories, robotics studios, smart classrooms, and on-campus hostels!`;
    suggestions = [
      "Book Guided Campus Tour",
      "Check Program Fees",
      "Hostel Details",
      "Talk to Admissions"
    ];
  }

  // ─────────────────────────────────────────────────────────────
  // 18. Contact & Admissions Helpline
  // ─────────────────────────────────────────────────────────────
  else if (
    q.includes("contact") ||
    q.includes("helpline") ||
    q.includes("phone") ||
    q.includes("number") ||
    q.includes("email") ||
    q.includes("counselor") ||
    q.includes("director") ||
    q.includes("tamane") ||
    q.includes("talk to")
  ) {
    answer = `📞 **Official MGM University IICT Admissions Helpdesk & Leadership:**

• **Director, IICT**: Dr. Sharvari C. Tamane (directoriict@mgmu.ac.in)
• **Direct Admissions Helplines**:
  - Primary IICT Helpline: **+91 940 449 4299**
  - IICT Office: **0240-6481000 Ext. 2201**
  - MGM University Central Helpdesk: **+91 906 761 2000** | **+91 93564 36622 / 33**
• **Key Faculty Admission Coordinators**:
  - Ms. Vrushali S. Bidkar (Asst. Professor): +91 88302 62850
  - Mr. Jaykumar S. Dhage (Asst. Professor): +91 80079 04503
  - Ms. Shaikh Farisa Tarannum (Asst. Professor): +91 81497 44222
• **Hostel Wardens**:
  - Girls' Hostel: Prof. P. S. Dalvi (0240-2100202)
  - Boys' Hostel: Prof. S. G. Zaveri (+91 94227 06484)
• **Official Emails**: directoriict@mgmu.ac.in | admissions@mgmu.ac.in
• **Campus Address**: IICT, MGM University, MGM Campus, N-6, CIDCO, Chhatrapati Sambhajinagar - 431003
• **Office Hours**: Monday – Saturday (9:30 AM – 5:00 PM)

You can also submit your inquiry right here in the chat to have our Senior Faculty Counsellor directly call and assist you!`;
    suggestions = [
      "Submit Priority Callback",
      "Check Fees Schedule",
      "Compare Programs",
      "Check Scholarships"
    ];
  }

  // ─────────────────────────────────────────────────────────────
  // 19. General Fallback & Warm Greeting
  // ─────────────────────────────────────────────────────────────
  else {
    if (p.name) {
      answer = `Hello ${p.name}! As your official IICT Admission Counsellor, I am here to help you navigate your engineering decisions with complete confidence.

I can provide transparent facts on:
• **Curriculum & Career Comparisons**: AI & ML vs CSE (AI) vs Data Science vs IT.
• **Academic Eligibility & Low Score Solutions**: MGMU-CET 2026 and 12th PCM merit seats.
• **2026–27 Official Fees & Installments**: Starting from ₹1.50L/year.
• **150+ Merit Scholarships**: Up to 100% tuition fee waivers.
• **Placements & Internships**: Average ₹5.0–6.5 LPA, highest ₹18+ LPA.`;
    } else {
      answer = `Welcome to MGM University IICT Admissions (2026–27)! 🎓

Choosing the right engineering program is one of your most important decisions. I can give you authoritative, transparent answers to help you compare programs and eliminate doubts:

• **Program Comparisons**: AI & ML vs CSE (AI) vs Data Science vs IT.
• **Worried about CET/JEE score?**: How to secure a seat via MGMU-CET or 12th PCM merit.
• **Official Fees & Installments**: Starting at ₹1.50 Lakhs/year.
• **Merit Scholarships**: Up to 100% tuition waivers for top scores.
• **Placements**: Average packages ₹5.0–6.5 LPA, top recruiters TCS, Persistent, Infosys.`;
    }
    suggestions = [
      "AI & ML vs CSE (AI)",
      "Data Science vs AI",
      "Low CET Score Options",
      "Check Fees (2026–27)"
    ];
  }

  // ─────────────────────────────────────────────────────────────
  // Conversational Next Step Prompt (Subtle, non-intrusive)
  // ─────────────────────────────────────────────────────────────
  let prompt = "";
  let actionType = null;

  if (p.name && p.interested_program && (p.phone || p.email) && (p.marks_12th || p.entrance_score || p.academic_background)) {
    // All key student profile info collected -> propose one-click inquiry submission!
    prompt = `\n\n📋 **Your Official IICT Admission Profile:**\n• Candidate: **${p.name}**\n• Target Program: **${p.interested_program}**\n• Contact: **${p.phone || 'Phone pending'}** | **${p.email || 'Email pending'}**\n• Academic Marks: **${p.academic_background || (p.marks_12th ? `${p.marks_12th}%` : '12th PCM')}**\n• Entrance: **${p.entrance_exam || 'MGMU-CET / Eligible'}**\n• Domicile: **${p.location}**\n\nYour profile is complete! Would you like me to submit your priority admission application to the admissions directorate now?`;
    actionType = "submit_proposal";
  } else if (!p.name) {
    prompt = `\n\n💡 *Tip: Feel free to share your full name and 12th marks anytime so I can check your exact scholarship waiver and provisional seat eligibility!*`;
  } else if (!p.interested_program) {
    prompt = `\n\nWhich program aligns best with your career goals, ${p.name}? (B.Tech AI & ML, B.Tech CSE, Data Science, or IT?)`;
  } else if (!p.phone && !p.email) {
    prompt = `\n\nWould you like our admissions desk to send you the official seat allotment guide for **${p.interested_program}**? You can share your WhatsApp number or email anytime!`;
  }

  return {
    text: answer + prompt,
    actionType,
    suggestions
  };
}


function Inquiry({ programs, onSubmit, onBack, onMyInquiry, onStaff, session }) {
  const [messages, setMessages] = useState([
    {
      id: "m-1",
      role: "assistant",
      content:
        "Hello and welcome to MGM University IICT Admissions (2026–27)! 🎓\n\nI am your official AI Admission Counsellor. Choosing an engineering specialization is a huge decision, and I am here to give you crystal-clear, transparent guidance on program choices (AI vs CSE vs Data Science vs IT), official fees, eligibility, cutoffs, and 150+ merit scholarships.\n\nTo begin, what questions or comparisons can I help clarify for you?",
      suggestions: [
        "AI & ML vs CSE (AI)",
        "Data Science vs AI",
        "Low CET Score Options",
        "Check Fees (2026–27)"
      ]
    }
  ]);

  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [error, setError] = useState("");
  const [showEditModal, setShowEditModal] = useState(false);
  const [modalMode, setModalMode] = useState("edit");
  const [submitting, setSubmitting] = useState(false);

  const [profile, setProfile] = useState(() => {
    let preselected = "";
    try {
      preselected = localStorage.getItem("iict_selected_prog") || "";
      if (preselected) localStorage.removeItem("iict_selected_prog");
    } catch {}
    return {
      name: "",
      role: "Prospective Student",
      email: "",
      phone: "",
      interested_program: preselected,
      academic_background: "",
      marks_12th: null,
      marks_10th: null,
      entrance_exam: "",
      entrance_score: null,
      location: "Maharashtra",
      questions_noted: "",
      progress: preselected ? 20 : 0
    };
  });

  const handleResetConversation = () => {
    try {
      localStorage.removeItem("iict_profile");
      sessionStorage.removeItem("iict_profile");
    } catch {
      // ignore
    }
    setProfile({
      name: "",
      role: "Prospective Student",
      email: "",
      phone: "",
      interested_program: "",
      academic_background: "",
      marks_12th: null,
      marks_10th: null,
      entrance_exam: "",
      entrance_score: null,
      location: "Maharashtra",
      questions_noted: "",
      progress: 0
    });
    setMessages([
      {
        id: "m-1",
        role: "assistant",
        content:
          "Hello and welcome to MGM University IICT Admissions (2026–27)! 🎓\n\nI am your official AI Admission Counsellor. Choosing an engineering specialization is a huge decision, and I am here to give you crystal-clear, transparent guidance on program choices (AI vs CSE vs Data Science vs IT), official fees, eligibility, cutoffs, and 150+ merit scholarships.\n\nTo begin, what questions or comparisons can I help clarify for you?",
        suggestions: [
          "AI & ML vs CSE (AI)",
          "Data Science vs AI",
          "Low CET Score Options",
          "Check Fees (2026–27)"
        ]
      }
    ]);
  };

  const chatEndRef = useRef(null);
  const [mobileTab, setMobileTab] = useState("chat"); // "chat" | "profile"

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isTyping]);

  const handleSendMessage = (textToSend) => {
    const text = (textToSend || input).trim();
    if (!text || isTyping) return;

    if (text === "Talk to Admissions") {
      handleSendInquiry();
      return;
    }

    const userMessage = {
      id: `u-${Date.now()}`,
      role: "user",
      content: text
    };

    setMessages((prev) => [...prev, userMessage]);
    if (!textToSend) setInput("");
    setIsTyping(true);
    setError("");

    const parsedUpdates = parseProfileUpdates(text, profile);
    const updatedProfile = { ...profile, ...parsedUpdates };
    updatedProfile.progress = calculateProgress(updatedProfile);
    setProfile(updatedProfile);

    setTimeout(() => {
      const { text: replyText, actionType, suggestions } = generateCounsellorReply(text, updatedProfile);

      if (actionType === "submit_now") {
        setIsTyping(false);
        setMessages((prev) => [
          ...prev,
          {
            id: `a-${Date.now()}`,
            role: "assistant",
            content: `Thank you, ${updatedProfile.name}! Submitting your official admission application for ${updatedProfile.interested_program}...`
          }
        ]);
        executeSubmission(updatedProfile);
        return;
      }

      setMessages((prev) => [
        ...prev,
        {
          id: `a-${Date.now()}`,
          role: "assistant",
          content: replyText,
          actionType: actionType,
          suggestions: suggestions || []
        }
      ]);
      setIsTyping(false);
    }, 450);
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const executeSubmission = async (currentProf) => {
    if (!currentProf.name || (!currentProf.phone && !currentProf.email)) {
      setModalMode("submit");
      setShowEditModal(true);
      return;
    }

    setSubmitting(true);
    setError("");

    const conversationSummary = messages
      .slice(-5)
      .map((m) => `${m.role === "assistant" ? "Assistant" : "Student"}: ${m.content}`)
      .join("\n");

    const payload = {
      student_name: currentProf.name.trim(),
      email: currentProf.email ? currentProf.email.trim() : `${currentProf.phone.trim()}@temp.mgmu.ac.in`,
      phone: currentProf.phone.trim() || "N/A",
      program_interest: currentProf.interested_program || "B.Tech in Artificial Intelligence & Machine Learning",
      course_category: "UG",
      marks_10th: currentProf.marks_10th || null,
      marks_12th: currentProf.marks_12th || null,
      entrance_exam: currentProf.entrance_exam || null,
      entrance_score: currentProf.entrance_score || null,
      location: currentProf.location || "Maharashtra",
      question: `Counsellor Chat Profile: ${currentProf.academic_background || '12th'}, Entrance: ${currentProf.entrance_exam || 'Eligible'}, Location: ${currentProf.location}. Topics: ${currentProf.questions_noted || 'General'}.\n\nRecent Transcript:\n${conversationSummary}`
    };

    try {
      await onSubmit(payload, (err) => {
        setError(err || "Submission failed. Please try again.");
        setSubmitting(false);
      });
    } catch (e) {
      setError(e.message || "An unexpected error occurred.");
      setSubmitting(false);
    }
  };

  const handleSendInquiry = () => {
    if (!profile.name || !profile.email || !profile.phone || profile.email.length < 5 || profile.phone.length < 5) {
      setModalMode("submit");
      setShowEditModal(true);
      return;
    }
    executeSubmission(profile);
  };

  return (
    <>
      <Header
        onHome={onBack}
        onInquiry={() => {}}
        onPrograms={onBack}
        onMyInquiry={onMyInquiry}
        onStaff={onStaff}
        session={session}
        activeNav="inquiry"
      />
      <main className="counselling-page">
        {/* Mobile Segmented Toggle */}
        <div className="counselling-mobile-nav">
          <button
            type="button"
            className={`counselling-mobile-btn ${mobileTab === "chat" ? "active" : ""}`}
            onClick={() => setMobileTab("chat")}
          >
            <MessageCircle size={14} /> Live Counselling Chat
          </button>
          <button
            type="button"
            className={`counselling-mobile-btn ${mobileTab === "profile" ? "active" : ""}`}
            onClick={() => setMobileTab("profile")}
          >
            <User size={14} /> Admission Profile ({profile.progress}%)
          </button>
        </div>

        {/* Left Column: Chat Area */}
        <section className={`counselling-chat-col ${mobileTab !== "chat" ? "mobile-tab-hidden" : ""}`}>
          <div className="counselling-header" style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", flexWrap: "wrap", gap: "10px" }}>
            <div>
              <p className="eyebrow">OFFICIAL IICT ADMISSIONS 2026–27</p>
              <h1>Live Admissions Counselling</h1>
              <p className="muted">Get authoritative guidance on B.Tech, M.Tech, fees, eligibility, and scholarship quotas.</p>
            </div>
            <button
              type="button"
              className="secondary-button"
              onClick={handleResetConversation}
              title="Reset conversation and start fresh"
              style={{ fontSize: "12px", padding: "6px 12px", alignSelf: "center", cursor: "pointer" }}
            >
              Start Fresh Chat
            </button>
          </div>

          <div className="chat-thread">
            {messages.map((m) => (
              <div key={m.id} className={`msg-item ${m.role}`}>
                {m.role === "assistant" ? (
                  <>
                    <div className="msg-meta msg-meta-assistant">
                      <span className="bot-avatar-badge">A</span>
                      <span className="msg-author-label">IICT Admission Counsellor</span>
                    </div>
                    <div className="msg-bubble-assistant">
                      <div style={{ whiteSpace: "pre-line" }}>{m.content}</div>

                      {/* Dynamic Contextual Suggestion Pills */}
                      {m.suggestions && m.suggestions.length > 0 && (
                        <div className="msg-suggestions-wrap">
                          <span className="msg-suggestions-label">
                            <HelpCircle size={13} color="#C05A21" /> Suggested Questions:
                          </span>
                          <div className="msg-suggestions-pills">
                            {m.suggestions.map((sug) => (
                              <button
                                key={sug}
                                type="button"
                                className="msg-suggestion-pill"
                                onClick={() => handleSendMessage(sug)}
                              >
                                {sug}
                              </button>
                            ))}
                          </div>
                        </div>
                      )}

                      {m.actionType === "submit_proposal" && (
                        <div className="in-chat-submission-card">
                          <div className="in-chat-card-header">
                            <Award size={16} color="#C05A21" />
                            <strong>Official IICT Admissions Application Ready</strong>
                          </div>
                          <div className="in-chat-card-summary">
                            <div><strong>Candidate:</strong> {profile.name || "Pending"}</div>
                            <div><strong>Target Program:</strong> {profile.interested_program}</div>
                            <div><strong>Mobile Phone:</strong> {profile.phone || "Required"}</div>
                            <div><strong>Email:</strong> {profile.email || "Required"}</div>
                            <div><strong>Score / Marks:</strong> {profile.academic_background || profile.entrance_exam || "Eligible"}</div>
                            <div><strong>Domicile:</strong> {profile.location}</div>
                          </div>
                          <div className="in-chat-card-actions">
                            <button
                              type="button"
                              className="primary-button in-chat-confirm-btn"
                              onClick={() => executeSubmission(profile)}
                              disabled={submitting}
                            >
                              {submitting ? "Submitting Application..." : "Confirm & Submit Admission Inquiry"} <ArrowRight size={14} />
                            </button>
                            <button
                              type="button"
                              className="secondary-button"
                              onClick={() => {
                                setModalMode("edit");
                                setShowEditModal(true);
                              }}
                            >
                              <Edit3 size={13} style={{ marginRight: 4 }} /> Edit Details
                            </button>
                          </div>
                        </div>
                      )}
                    </div>
                  </>
                ) : (
                  <>
                    <div className="msg-meta msg-meta-user">
                      <span className="msg-author-label">You</span>
                      <span className="user-avatar-badge">
                        <User size={15} />
                      </span>
                    </div>
                    <div className="msg-bubble-user">{m.content}</div>
                  </>
                )}
              </div>
            ))}

            {isTyping && (
              <div className="msg-item assistant">
                <div className="msg-meta msg-meta-assistant">
                  <span className="bot-avatar-badge">A</span>
                  <span className="msg-author-label">IICT Admission Counsellor</span>
                </div>
                <div className="typing-bubble">
                  <div className="typing-dot" />
                  <div className="typing-dot" />
                  <div className="typing-dot" />
                </div>
              </div>
            )}
            <div ref={chatEndRef} />
          </div>

          {/* Quick Action Chips */}
          <div className="quick-chips-wrapper">
            {quickChips.map((chip) => (
              <button
                key={chip}
                type="button"
                className="quick-chip-btn"
                onClick={() => handleSendMessage(chip)}
              >
                {chip}
              </button>
            ))}
          </div>

          {/* In-Chat Action Banner */}
          <div className="in-chat-action-card">
            <div>
              <p>Ready to reserve your seat?</p>
              <small style={{ color: "#64748B", fontSize: "11px" }}>
                Official 2026–27 counselling intake is open. Submit your inquiry for direct priority follow-up.
              </small>
            </div>
            <button
              type="button"
              className="in-chat-action-btn"
              onClick={handleSendInquiry}
              disabled={submitting || !supabaseConfigured}
            >
              {submitting ? "Submitting..." : "Submit Inquiry"} <ArrowRight size={14} />
            </button>
          </div>

          {/* Chat Input Container */}
          <div className="chat-input-container">
            <textarea
              className="chat-input-textarea"
              placeholder="Ask about 2026–27 programs, exact fees, cut-offs, or scholarships…"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              rows={1}
            />
            <button
              type="button"
              className="chat-send-btn"
              onClick={() => handleSendMessage()}
              disabled={!input.trim() || isTyping}
              aria-label="Send message"
            >
              <Send size={16} />
            </button>
          </div>
          <div className="chat-input-caption">Enter to send · Shift + Enter for a new line</div>
          {error && <div className="staff-error" style={{ marginTop: "12px" }}>{error}</div>}
        </section>

        {/* Right Column: Counselling Snapshot Sidebar (Hidden Profile in Database) */}
        <aside className={`counselling-sidebar ${mobileTab !== "profile" ? "mobile-tab-hidden" : ""}`}>
          <div className="sidebar-top">
            <span className="sidebar-eyebrow">COUNSELLING SNAPSHOT</span>
            <span className="sidebar-live-pill">
              <span className="sidebar-live-dot" /> Live
            </span>
          </div>

          <h2 className="sidebar-title">Your Admission Profile</h2>

          <div className="profile-card">
            <div className="profile-user-left">
              <div className="profile-avatar-circle">
                {profile.name ? (
                  profile.name
                    .split(" ")
                    .map((n) => n[0])
                    .slice(0, 2)
                    .join("")
                    .toUpperCase()
                ) : (
                  <User size={18} />
                )}
              </div>
              <div className="profile-user-info">
                <strong>{profile.name || "Candidate Profile"}</strong>
                <small>{profile.role || "Prospective Student"}</small>
              </div>
            </div>
            <button
              type="button"
              className="profile-edit-btn"
              onClick={() => {
                setModalMode("edit");
                setShowEditModal(true);
              }}
              title="Edit Profile"
            >
              <Edit3 size={15} />
            </button>
          </div>

          <div className="profile-fields-list">
            <div className="profile-field-row">
              <div className="profile-field-header">
                <span className="profile-field-label">Target Program</span>
                {profile.interested_program ? (
                  <span className="field-status-chip verified"><Check size={10} /> +20%</span>
                ) : (
                  <span className="field-status-chip pending">Required</span>
                )}
              </div>
              <span className="profile-field-value">{profile.interested_program || "Share in chat or select below..."}</span>
            </div>
            <div className="profile-field-row">
              <div className="profile-field-header">
                <span className="profile-field-label">12th Marks / Academic</span>
                {(profile.academic_background || profile.marks_12th) ? (
                  <span className="field-status-chip verified"><Check size={10} /> +20%</span>
                ) : (
                  <span className="field-status-chip pending">Required</span>
                )}
              </div>
              <span className="profile-field-value">{profile.academic_background || "Share PCM % in chat..."}</span>
            </div>
            <div className="profile-field-row">
              <div className="profile-field-header">
                <span className="profile-field-label">Entrance Exam</span>
                {(profile.entrance_exam || profile.entrance_score) ? (
                  <span className="field-status-chip verified"><Check size={10} /> +15%</span>
                ) : (
                  <span className="field-status-chip neutral">Optional (+15%)</span>
                )}
              </div>
              <span className="profile-field-value">{profile.entrance_exam || "MHT-CET / JEE / MGMU-CET..."}</span>
            </div>
            <div className="profile-field-row">
              <div className="profile-field-header">
                <span className="profile-field-label">Verified Contact</span>
                {(profile.phone && profile.email) ? (
                  <span className="field-status-chip verified"><Check size={10} /> +25%</span>
                ) : (profile.phone || profile.email) ? (
                  <span className="field-status-chip pending">Partial</span>
                ) : (
                  <span className="field-status-chip pending">Required</span>
                )}
              </div>
              <span className="profile-field-value">
                {profile.phone && profile.email
                  ? `${profile.phone} · ${profile.email}`
                  : profile.phone || profile.email || "Phone & email for seat receipt..."}
              </span>
            </div>
            <div className="profile-field-row">
              <div className="profile-field-header">
                <span className="profile-field-label">Location / Quota</span>
                <span className="field-status-chip neutral">Verified</span>
              </div>
              <span className="profile-field-value">{profile.location || "Maharashtra State Quota"}</span>
            </div>
          </div>

          <div className="inquiry-progress-block">
            <div className="progress-header-row">
              <div
                className="progress-status-badge"
                style={{
                  backgroundColor: profile.progress === 100 ? "#FFF0E5" : profile.progress >= 60 ? "#FFF8F3" : "#F8FAFC",
                  color: profile.progress === 100 ? "#C05A21" : profile.progress >= 60 ? "#8C3A0B" : "#475569"
                }}
              >
                {profile.progress === 100 ? (
                  <><CheckCircle2 size={13} style={{ color: "#C05A21" }} /> Profile 100% Ready</>
                ) : profile.progress >= 60 ? (
                  <><GraduationCap size={13} style={{ color: "#C05A21" }} /> Reviewing Eligibility</>
                ) : profile.progress > 0 ? (
                  <><Clock size={13} style={{ color: "#475569" }} /> Intake In Progress</>
                ) : (
                  <><HelpCircle size={13} style={{ color: "#64748B" }} /> Ready to Start</>
                )}
              </div>
              <div className="progress-pct-value">
                <strong>{profile.progress}%</strong>
              </div>
            </div>

            <div className="progress-track">
              <div
                className="progress-fill"
                style={{
                  width: `${profile.progress}%`,
                  background: profile.progress === 100
                    ? "linear-gradient(90deg, #001E32, #C05A21)"
                    : "linear-gradient(90deg, #001E32, #F1B51C)"
                }}
              />
            </div>

            <div className="progress-checklist">
              <div className={`checklist-item ${profile.name ? "done" : "pending"}`}>
                <span className="checklist-bullet">
                  {profile.name ? <Check size={11} /> : <span className="bullet-dot" />}
                </span>
                <span className="checklist-text">
                  <span>Candidate Name</span>
                  {profile.name ? <strong>{profile.name}</strong> : <span className="pending-hint">+20%</span>}
                </span>
              </div>
              <div className={`checklist-item ${profile.interested_program ? "done" : "pending"}`}>
                <span className="checklist-bullet">
                  {profile.interested_program ? <Check size={11} /> : <span className="bullet-dot" />}
                </span>
                <span className="checklist-text">
                  <span>Target Program</span>
                  {profile.interested_program ? <strong>{profile.interested_program.replace("B.Tech in ", "")}</strong> : <span className="pending-hint">+20%</span>}
                </span>
              </div>
              <div className={`checklist-item ${(profile.academic_background || profile.marks_12th) ? "done" : "pending"}`}>
                <span className="checklist-bullet">
                  {(profile.academic_background || profile.marks_12th) ? <Check size={11} /> : <span className="bullet-dot" />}
                </span>
                <span className="checklist-text">
                  <span>12th PCM Marks</span>
                  {(profile.academic_background || profile.marks_12th) ? <strong>{profile.academic_background || `${profile.marks_12th}%`}</strong> : <span className="pending-hint">+20%</span>}
                </span>
              </div>
              <div className={`checklist-item ${(profile.entrance_exam || profile.entrance_score) ? "done" : "pending"}`}>
                <span className="checklist-bullet">
                  {(profile.entrance_exam || profile.entrance_score) ? <Check size={11} /> : <span className="bullet-dot" />}
                </span>
                <span className="checklist-text">
                  <span>Entrance Score</span>
                  {(profile.entrance_exam || profile.entrance_score) ? <strong>{profile.entrance_exam}</strong> : <span className="pending-hint">+15%</span>}
                </span>
              </div>
              <div className={`checklist-item ${(profile.phone && profile.email) ? "done" : (profile.phone || profile.email) ? "half" : "pending"}`}>
                <span className="checklist-bullet">
                  {(profile.phone && profile.email) ? <Check size={11} /> : <span className="bullet-dot" />}
                </span>
                <span className="checklist-text">
                  <span>Phone & Email</span>
                  {(profile.phone && profile.email) ? <strong>{profile.phone}</strong> : <span className="pending-hint">+25%</span>}
                </span>
              </div>
            </div>

            <div className="progress-privacy-badge">
              <Lock size={12} color="#64748B" />
              <span>Row-Level Security Active · Profile hidden from public</span>
            </div>
          </div>

          <div className="ready-connect-section">
            <h3 className="ready-connect-title">Ready to connect?</h3>
            <p className="ready-connect-desc">
              Send your profile directly to the IICT admission committee for priority eligibility check and seat allocation.
            </p>
            <button
              type="button"
              className="send-my-inquiry-btn"
              onClick={handleSendInquiry}
              disabled={submitting || !supabaseConfigured}
            >
              {submitting ? "Sending..." : "Send My Inquiry"} <ArrowRight size={16} />
            </button>
            {!supabaseConfigured && (
              <small className="form-help" style={{ textAlign: "center", display: "block" }}>
                Connect Supabase before accepting live inquiries.
              </small>
            )}
          </div>
        </aside>
      </main>

      {/* Edit / Confirm Modal */}
      {showEditModal && (
        <div className="modal-overlay" onClick={() => setShowEditModal(false)}>
          <div className="modal-dialog" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3>{modalMode === "submit" ? "Confirm Details & Submit" : "Edit Admission Profile"}</h3>
              <button
                type="button"
                className="modal-close-btn"
                onClick={() => setShowEditModal(false)}
              >
                <X size={18} />
              </button>
            </div>
            <form
              className="modal-form"
              onSubmit={(e) => {
                e.preventDefault();
                setShowEditModal(false);
                if (modalMode === "submit") {
                  executeSubmission(profile);
                }
              }}
            >
              <label>
                Full Name
                <input
                  type="text"
                  value={profile.name}
                  onChange={(e) => setProfile({ ...profile, name: e.target.value })}
                  placeholder="e.g. Aditi Deshmukh"
                  required
                />
              </label>
              <label>
                WhatsApp / Mobile Phone
                <input
                  type="tel"
                  value={profile.phone}
                  onChange={(e) => setProfile({ ...profile, phone: e.target.value })}
                  placeholder="e.g. 9822334455"
                  required
                />
              </label>
              <label>
                Email Address
                <input
                  type="email"
                  value={profile.email}
                  onChange={(e) => setProfile({ ...profile, email: e.target.value })}
                  placeholder="e.g. student@gmail.com"
                  required
                />
              </label>
              <label>
                Interested Program (2026–27)
                <select
                  value={profile.interested_program}
                  onChange={(e) => setProfile({ ...profile, interested_program: e.target.value })}
                >
                  {programs.map((p) => (
                    <option key={p.id} value={p.name}>
                      {p.name} ({formatCurrency(p.annual_tuition_fee)}/yr)
                    </option>
                  ))}
                </select>
              </label>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "10px" }}>
                <label>
                  12th Marks (%)
                  <input
                    type="number"
                    step="0.1"
                    value={profile.marks_12th || ""}
                    onChange={(e) => setProfile({ ...profile, marks_12th: parseFloat(e.target.value), academic_background: `12th · ${e.target.value}%` })}
                    placeholder="e.g. 78.5"
                  />
                </label>
                <label>
                  Entrance Score
                  <input
                    type="number"
                    step="0.1"
                    value={profile.entrance_score || ""}
                    onChange={(e) => setProfile({ ...profile, entrance_score: parseFloat(e.target.value), entrance_exam: `MHT-CET · ${e.target.value} percentile` })}
                    placeholder="e.g. 82.0"
                  />
                </label>
              </div>
              <label>
                Location / Domicile
                <input
                  type="text"
                  value={profile.location}
                  onChange={(e) => setProfile({ ...profile, location: e.target.value })}
                  placeholder="e.g. Maharashtra"
                />
              </label>
              <button
                type="submit"
                className="primary-button"
                style={{ marginTop: "10px", justifyContent: "center" }}
              >
                {modalMode === "submit" ? "Confirm & Send Inquiry →" : "Save Profile"}
              </button>
            </form>
          </div>
        </div>
      )}

      <Footer onStaff={() => {}} />
    </>
  );
}

// ── Staff & Super Admin Dashboard Component ──────────────────────────────
function Dashboard({ session, onExit }) {
  const [activeTab, setActiveTab] = useState("inquiries"); // inquiries, teachers, programs
  const [leads, setLeads] = useState([]);
  const [staffList, setStaffList] = useState([]);
  const [userRole, setUserRole] = useState("teacher"); // "super_admin" or "teacher"
  const [error, setError] = useState("");
  const [newTeacherEmail, setNewTeacherEmail] = useState("");
  const [newTeacherName, setNewTeacherName] = useState("");
  const [newTeacherRole, setNewTeacherRole] = useState("teacher");
  const [newTeacherDept, setNewTeacherDept] = useState("IICT Faculty");
  const [granting, setGranting] = useState(false);
  const [grantMsg, setGrantMsg] = useState("");
  const [revokingEmail, setRevokingEmail] = useState(null);
  const [apiHealth, setApiHealth] = useState(null);

  // Filters & Search
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [programFilter, setProgramFilter] = useState("all");
  const [scoreFilter, setScoreFilter] = useState("all");
  const [assignedFilter, setAssignedFilter] = useState("all");

  // Interaction Modals & Notes
  const [templateModalLead, setTemplateModalLead] = useState(null);
  const [leadNotesState, setLeadNotesState] = useState({});
  const [savingNotesId, setSavingNotesId] = useState(null);

  const userEmail = session?.user?.email || "";

  useEffect(() => {
    if (activeTab === "teachers") {
      fetch("/api/grant-staff")
        .then((res) => res.json())
        .then((data) => {
          if (data?.hasServiceRoleKey) {
            setApiHealth({ status: "online" });
          } else {
            setApiHealth({ status: "missing_key" });
          }
        })
        .catch(() => {
          setApiHealth({ status: "unreachable" });
        });
    }
  }, [activeTab]);

  useEffect(() => {
    if (!supabase) return;

    // Check & sync staff profile role
    const verifyAndSyncRole = async () => {
      let roleFound = null;

      // 1. Primary: Direct database procedure claim_or_sync_staff_profile (Instant)
      try {
        const { data: syncRes } = await supabase.rpc("claim_or_sync_staff_profile");
        if (syncRes && syncRes.status === "active") {
          roleFound = syncRes.role;
        }
      } catch (err) {
        console.warn("claim_or_sync_staff_profile notice:", err);
      }

      // 2. Query staff_profiles table directly
      if (!roleFound) {
        try {
          const { data: profile } = await supabase
            .from("staff_profiles")
            .select("role, display_name, user_id")
            .or(`user_id.eq.${session.user.id},email.eq.${session.user.email}`)
            .maybeSingle();

          if (profile?.role) {
            roleFound = profile.role;
            if (profile.user_id !== session.user.id) {
              await supabase.from("staff_profiles").update({ user_id: session.user.id }).eq("email", session.user.email);
            }
          } else if (session?.user?.email && session.user.email.toLowerCase() === "dp844771@gmail.com") {
            roleFound = "super_admin";
          }
        } catch {}
      }

      // 3. Fallback: serverless /api/sync-staff endpoint
      if (!roleFound) {
        try {
          const token = session?.access_token;
          if (token) {
            const apiRes = await fetch("/api/sync-staff", {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`
              }
            });
            if (apiRes.ok) {
              const apiData = await apiRes.json();
              if (apiData?.profile?.role) {
                roleFound = apiData.profile.role;
              }
              if (apiData?.staffList && apiData.staffList.length > 0) {
                setStaffList(apiData.staffList);
              }
            }
          }
        } catch {}
      }

      const currentEmail = (session?.user?.email || "").toLowerCase().trim();
      if (currentEmail === "dp844771@gmail.com") {
        setUserRole("super_admin");
      } else {
        // Any registered staff member who signs into /staff receives teacher permissions immediately
        setUserRole(roleFound || "teacher");
      }
      setError("");

      // Background auto-sync into staff_profiles table
      if (supabase && session?.user?.id) {
        supabase
          .from("staff_profiles")
          .upsert(
            {
              user_id: session.user.id,
              email: currentEmail,
              display_name: session.user.user_metadata?.display_name || currentEmail.split("@")[0],
              role: currentEmail === "dp844771@gmail.com" ? "super_admin" : (roleFound || "teacher"),
              department: "IICT Faculty"
            },
            { onConflict: "user_id" }
          )
          .then(() => {});
      }
    };

    verifyAndSyncRole();

    // Load inquiries (protected by RLS)
    supabase
      .from("inquiries")
      .select("*")
      .order("created_at", { ascending: false })
      .then(({ data, error: queryError }) => {
        if (queryError) setError(queryError.message);
        else {
          setLeads(data || []);
          const initialNotes = {};
          (data || []).forEach((l) => {
            if (l.counselor_notes) initialNotes[l.id] = l.counselor_notes;
          });
          setLeadNotesState(initialNotes);
        }
      });

    // Load staff profiles list (protected by RLS)
    supabase
      .from("staff_profiles")
      .select("*")
      .order("created_at", { ascending: false })
      .then(({ data }) => {
        if (data && data.length > 0) setStaffList(data);
      });
  }, [session]);

  const updateLeadStatus = async (leadId, nextStatus, notes) => {
    if (!supabase) return;
    const { error: updateError } = await supabase
      .from("inquiries")
      .update({ status: nextStatus, counselor_notes: notes, updated_at: new Date().toISOString() })
      .eq("id", leadId);

    if (updateError) {
      setError(updateError.message);
    } else {
      setLeads((prev) =>
        prev.map((l) => (l.id === leadId ? { ...l, status: nextStatus, counselor_notes: notes } : l))
      );
    }
  };

  const updateLeadAssignment = async (leadId, teacherUserId) => {
    if (!supabase) return;
    const { error: assignError } = await supabase
      .from("inquiries")
      .update({ assigned_to: teacherUserId || null, updated_at: new Date().toISOString() })
      .eq("id", leadId);

    if (assignError) {
      setError(assignError.message);
    } else {
      setLeads((prev) =>
        prev.map((l) => (l.id === leadId ? { ...l, assigned_to: teacherUserId || null } : l))
      );
    }
  };

  const saveLeadNotes = async (leadId) => {
    if (!supabase) return;
    setSavingNotesId(leadId);
    const noteText = leadNotesState[leadId] || "";
    const { error: noteError } = await supabase
      .from("inquiries")
      .update({ counselor_notes: noteText, updated_at: new Date().toISOString() })
      .eq("id", leadId);

    setSavingNotesId(null);
    if (noteError) {
      setError(noteError.message);
    } else {
      setLeads((prev) =>
        prev.map((l) => (l.id === leadId ? { ...l, counselor_notes: noteText } : l))
      );
    }
  };

  const handleGrantTeacher = async (e) => {
    e.preventDefault();
    const cleanEmail = newTeacherEmail.toLowerCase().trim();
    const cleanName = newTeacherName.trim();
    if (!cleanEmail || !cleanName) return;

    setGranting(true);
    setGrantMsg("");

    // 1. Primary: Direct Supabase RPC (Works immediately in database, bypasses Vercel deploy dependency)
    if (supabase) {
      try {
        const { data: rpcRes, error: rpcErr } = await supabase.rpc("grant_staff_access_by_email", {
          p_email: cleanEmail,
          p_display_name: cleanName,
          p_role: newTeacherRole,
          p_department: newTeacherDept
        });

        if (!rpcErr && rpcRes) {
          setGrantMsg(rpcRes.message || "Staff access granted successfully!");
          const { data: refreshed } = await supabase
            .from("staff_profiles")
            .select("*")
            .order("created_at", { ascending: false });
          if (refreshed) setStaffList(refreshed);
          setNewTeacherEmail("");
          setNewTeacherName("");
          setGranting(false);
          return;
        }

        if (rpcErr && rpcErr.message && !rpcErr.message.includes("not found")) {
          setGrantMsg(`Notice: ${rpcErr.message}`);
          setGranting(false);
          return;
        }
      } catch (err) {
        console.warn("Direct RPC error:", err);
      }
    }

    // 2. Fallback: Serverless /api/grant-staff endpoint
    try {
      const token = session?.access_token;
      const apiResponse = await fetch("/api/grant-staff", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: token ? `Bearer ${token}` : ""
        },
        body: JSON.stringify({
          email: cleanEmail,
          displayName: cleanName,
          role: newTeacherRole,
          department: newTeacherDept,
          callerEmail: session?.user?.email || ""
        })
      });

      let resJson = null;
      try {
        resJson = await apiResponse.json();
      } catch {}

      if (apiResponse.ok && resJson?.success) {
        setGrantMsg(resJson.message || "Staff access granted successfully!");
        const { data: refreshed } = await supabase
          .from("staff_profiles")
          .select("*")
          .order("created_at", { ascending: false });
        if (refreshed) setStaffList(refreshed);
        setNewTeacherEmail("");
        setNewTeacherName("");
        setGranting(false);
        return;
      }

      if (resJson?.error) {
        setGrantMsg(`Notice: ${resJson.error}`);
        setGranting(false);
        return;
      }
    } catch {}

    setGrantMsg("Notice: Please make sure you are signed in as Super Admin (dp844771@gmail.com).");
    setGranting(false);
  };

  const handleRevokeStaff = async (emailToRevoke) => {
    if (!emailToRevoke || emailToRevoke === "dp844771@gmail.com") return;
    if (!confirm(`Are you sure you want to revoke staff access for ${emailToRevoke}?`)) return;

    setRevokingEmail(emailToRevoke);
    try {
      const { error: rpcErr } = await supabase.rpc("revoke_staff_access", { p_email: emailToRevoke });
      if (!rpcErr) {
        setStaffList((prev) => prev.filter((s) => s.email !== emailToRevoke));
      } else {
        await supabase.from("staff_profiles").delete().eq("email", emailToRevoke);
        setStaffList((prev) => prev.filter((s) => s.email !== emailToRevoke));
      }
    } catch {
      // ignore
    } finally {
      setRevokingEmail(null);
    }
  };

  // ── KPI Analytics Computations ─────────────────────────────
  const totalLeadsCount = leads.length;
  const newLeadsCount = leads.filter((l) => !l.status || l.status === "new").length;
  const qualifiedLeadsCount = leads.filter((l) => l.status === "qualified").length;

  // Average 12th PCM %
  const pcmScores = leads
    .map((l) => parseFloat(l.marks_12th))
    .filter((n) => !isNaN(n) && n > 0);
  const avgPcm = pcmScores.length > 0
    ? (pcmScores.reduce((a, b) => a + b, 0) / pcmScores.length).toFixed(1)
    : "—";

  // Top Program Demand
  const progCounts = {};
  leads.forEach((l) => {
    if (l.program_interest) {
      progCounts[l.program_interest] = (progCounts[l.program_interest] || 0) + 1;
    }
  });
  let topProgram = "—";
  let topProgCount = 0;
  Object.entries(progCounts).forEach(([prog, count]) => {
    if (count > topProgCount) {
      topProgram = prog;
      topProgCount = count;
    }
  });
  const topProgShare = totalLeadsCount > 0 && topProgCount > 0
    ? Math.round((topProgCount / totalLeadsCount) * 100)
    : 0;

  // ── Multi-Filter and Search Logic ──────────────────────────
  const distinctPrograms = Array.from(
    new Set(leads.map((l) => l.program_interest).filter(Boolean))
  );

  const filteredLeads = leads.filter((lead) => {
    // Text search across multiple fields
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      const matchName = lead.student_name?.toLowerCase().includes(q);
      const matchRef = lead.reference_code?.toLowerCase().includes(q);
      const matchPhone = lead.phone?.toLowerCase().includes(q);
      const matchEmail = lead.email?.toLowerCase().includes(q);
      const matchLoc = lead.location?.toLowerCase().includes(q);
      const matchProg = lead.program_interest?.toLowerCase().includes(q);
      if (!matchName && !matchRef && !matchPhone && !matchEmail && !matchLoc && !matchProg) {
        return false;
      }
    }

    // Status filter
    if (statusFilter !== "all") {
      const actualStatus = lead.status || "new";
      if (actualStatus !== statusFilter) return false;
    }

    // Program filter
    if (programFilter !== "all") {
      if (lead.program_interest !== programFilter) return false;
    }

    // Score filter
    if (scoreFilter !== "all") {
      const score = parseFloat(lead.marks_12th) || 0;
      if (scoreFilter === "above85" && score < 85) return false;
      if (scoreFilter === "70to85" && (score < 70 || score >= 85)) return false;
      if (scoreFilter === "below70" && (score >= 70 || score <= 0)) return false;
    }

    // Assignment filter
    if (assignedFilter !== "all") {
      if (assignedFilter === "me" && lead.assigned_to !== session?.user?.id) return false;
      if (assignedFilter === "unassigned" && lead.assigned_to) return false;
    }

    return true;
  });

  // ── One-Click CSV Export ──────────────────────────────────
  const exportToCSV = () => {
    if (!filteredLeads || filteredLeads.length === 0) {
      alert("No inquiry records to export for the active filters.");
      return;
    }

    const headers = [
      "Reference Code",
      "Student Name",
      "Phone",
      "Email",
      "Program Interest",
      "12th PCM Marks (%)",
      "10th Marks (%)",
      "Entrance Exam",
      "Location",
      "Status",
      "Assigned Faculty",
      "Counselor Notes",
      "Inquiry Transcript / Questions",
      "Created At"
    ];

    const escapeCsv = (str) => {
      if (str === null || str === undefined) return '""';
      const val = String(str).replace(/"/g, '""');
      return `"${val}"`;
    };

    const rows = filteredLeads.map((lead) => {
      const assignedStaff =
        staffList.find((s) => s.user_id === lead.assigned_to)?.display_name || "Unassigned";
      return [
        escapeCsv(lead.reference_code || ""),
        escapeCsv(lead.student_name || ""),
        escapeCsv(lead.phone || ""),
        escapeCsv(lead.email || ""),
        escapeCsv(lead.program_interest || ""),
        escapeCsv(lead.marks_12th || ""),
        escapeCsv(lead.marks_10th || ""),
        escapeCsv(lead.entrance_exam || ""),
        escapeCsv(lead.location || ""),
        escapeCsv(lead.status || "new"),
        escapeCsv(assignedStaff),
        escapeCsv(lead.counselor_notes || ""),
        escapeCsv(lead.question || ""),
        escapeCsv(lead.created_at ? new Date(lead.created_at).toLocaleString() : "")
      ].join(",");
    });

    const csvContent = "\uFEFF" + [headers.join(","), ...rows].join("\r\n");
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    const dateStr = new Date().toISOString().split("T")[0];
    link.setAttribute("href", url);
    link.setAttribute("download", `IICT_Admissions_Inquiries_${dateStr}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  // ── WhatsApp Templates Generator ──────────────────────────
  const getWhatsAppTemplates = (lead) => {
    if (!lead) return [];
    const name = lead.student_name || "Candidate";
    const prog = lead.program_interest || "Engineering";
    const ref = lead.reference_code || "IICT-2026";
    const score = lead.marks_12th ? `${lead.marks_12th}%` : "academic score";

    return [
      {
        id: "verification",
        title: "Eligibility & Document Verification",
        tag: "High Priority",
        text: `Dear ${name}, greetings from MGM University IICT Admissions Committee! Regarding your inquiry for ${prog} (Ref: ${ref}), our academic board has reviewed your details. Please share your 10th & 12th scorecards for expedited eligibility & document verification.`
      },
      {
        id: "scholarship",
        title: "Merit Scholarship Offer (Up to 100%)",
        tag: "Scholarship",
        text: `Congratulations ${name}! With your academic record (${score}), you qualify to apply for the MGM University Merit Scholarship offering up to 100% tuition waiver for ${prog}. Would you like our senior counselor to book an online evaluation slot for you?`
      },
      {
        id: "reservation",
        title: "Direct Seat Reservation Follow-up",
        tag: "Seat Allocation",
        text: `Hello ${name}, admissions for ${prog} (Academic Year 2026–27) at MGMU IICT are filling up rapidly under CAP & Institutional quota. You can secure your provisional seat reservation today using Reference: ${ref}. Let us know if you wish to confirm!`
      },
      {
        id: "campus_tour",
        title: "Campus Visit & Lab Tour Invitation",
        tag: "Invitation",
        text: `Dear ${name} & Parents, you are cordially invited to visit MGM University IICT campus in Chhatrapati Sambhajinagar. Tour our cutting-edge AI & Cloud Computing Labs, meet faculty mentors, and complete on-the-spot provisional admission.`
      }
    ];
  };


  return (
    <main className="dashboard-page">
      <div className="dashboard-head">
        <div>
          <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "6px" }}>
            <span className="eyebrow" style={{ margin: 0 }}>IICT ADMISSIONS COMMITTEE</span>
            <span className={userRole === "super_admin" ? "super-admin-badge" : "teacher-badge"}>
              {userRole === "super_admin" ? "Super Admin (You)" : "Teacher Admin"}
            </span>
          </div>
          <h1>{userRole === "super_admin" ? "Super Admin Portal" : "Faculty Lead Dashboard"}</h1>
          <p className="muted">
            Signed in as <strong>{userEmail}</strong> · Accessing confidential student records securely.
          </p>
        </div>
        <button
          className="secondary-button"
          onClick={async () => {
            await supabase?.auth.signOut();
            onExit();
          }}
        >
          Sign out
        </button>
      </div>

      {/* Navigation Tabs */}
      <div className="dashboard-nav-tabs">
        <button
          type="button"
          className={`dashboard-tab-btn ${activeTab === "inquiries" ? "active" : ""}`}
          onClick={() => setActiveTab("inquiries")}
        >
          <UsersRound size={16} /> Student Inquiries & Profiles ({leads.length})
        </button>

        {userRole === "super_admin" && (
          <button
            type="button"
            className={`dashboard-tab-btn ${activeTab === "teachers" ? "active" : ""}`}
            onClick={() => setActiveTab("teachers")}
          >
            <UserPlus size={16} /> Teacher Access Management
          </button>
        )}

        <button
          type="button"
          className={`dashboard-tab-btn ${activeTab === "programs" ? "active" : ""}`}
          onClick={() => setActiveTab("programs")}
        >
          <GraduationCap size={16} /> Official 2026–27 Fee Schedule
        </button>
      </div>

      {error && <div className="staff-error" style={{ marginBottom: "20px" }}>{error}</div>}

      {/* TAB 1: Inquiries & Hidden Profiles */}
      {activeTab === "inquiries" && (
        <div>
          {/* KPI Analytics Summary Cards */}
          <section className="admin-kpi-grid">
            <div className="admin-kpi-card">
              <div className="kpi-icon-wrap kpi-icon-blue">
                <UsersRound size={22} />
              </div>
              <div className="kpi-content">
                <span className="kpi-val">{totalLeadsCount}</span>
                <span className="kpi-lbl">Total Inquiries</span>
                <span className="kpi-sub">Overall student interest</span>
              </div>
            </div>

            <div className="admin-kpi-card">
              <div className="kpi-icon-wrap kpi-icon-amber">
                <Clock size={22} />
              </div>
              <div className="kpi-content">
                <span className="kpi-val">{newLeadsCount}</span>
                <span className="kpi-lbl">New / Uncontacted</span>
                <span className="kpi-sub">Require immediate outreach</span>
              </div>
            </div>

            <div className="admin-kpi-card">
              <div className="kpi-icon-wrap kpi-icon-green">
                <CheckCircle2 size={22} />
              </div>
              <div className="kpi-content">
                <span className="kpi-val">{qualifiedLeadsCount}</span>
                <span className="kpi-lbl">Qualified Leads</span>
                <span className="kpi-sub">Ready for seat reservation</span>
              </div>
            </div>

            <div className="admin-kpi-card">
              <div className="kpi-icon-wrap kpi-icon-purple">
                <TrendingUp size={22} />
              </div>
              <div className="kpi-content">
                <span className="kpi-val" style={{ fontSize: "16px", textOverflow: "ellipsis", overflow: "hidden", whiteSpace: "nowrap", maxWidth: "160px" }} title={topProgram}>
                  {topProgram.replace("B.Tech in ", "")}
                </span>
                <span className="kpi-lbl">Top Demand Program</span>
                <span className="kpi-sub">{topProgShare}% of inquiry pool</span>
              </div>
            </div>

            <div className="admin-kpi-card">
              <div className="kpi-icon-wrap kpi-icon-teal">
                <Award size={22} />
              </div>
              <div className="kpi-content">
                <span className="kpi-val">{avgPcm !== "—" ? `${avgPcm}%` : "—"}</span>
                <span className="kpi-lbl">Avg 12th PCM</span>
                <span className="kpi-sub">Academic benchmark</span>
              </div>
            </div>
          </section>

          {/* Admin Toolbar: Search, Multi-Filters, Export */}
          <div className="admin-toolbar-card">
            <div className="admin-toolbar-row">
              <div className="admin-search-box">
                <Search size={16} />
                <input
                  type="text"
                  placeholder="Search by student name, ref code, phone, email, city..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>

              <button
                type="button"
                className="export-csv-btn"
                onClick={exportToCSV}
                title="Download current inquiries filtered list as Excel/CSV"
              >
                <Download size={15} />
                Export CSV ({filteredLeads.length})
              </button>
            </div>

            <div className="admin-toolbar-row" style={{ borderTop: "1px solid #f3f4f6", paddingTop: "12px" }}>
              <div className="admin-filters-group">
                <span style={{ fontSize: "12px", color: "#6b7280", display: "flex", alignItems: "center", gap: "4px" }}>
                  <Filter size={13} /> Filters:
                </span>

                {/* Status Filter */}
                <select
                  className="admin-filter-select"
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                >
                  <option value="all">All Statuses</option>
                  <option value="new">New</option>
                  <option value="contacted">Contacted</option>
                  <option value="qualified">Qualified</option>
                  <option value="closed">Closed</option>
                </select>

                {/* Program Filter */}
                <select
                  className="admin-filter-select"
                  value={programFilter}
                  onChange={(e) => setProgramFilter(e.target.value)}
                >
                  <option value="all">All Programs</option>
                  {distinctPrograms.map((prog) => (
                    <option key={prog} value={prog}>
                      {prog}
                    </option>
                  ))}
                </select>

                {/* Score Bracket Filter */}
                <select
                  className="admin-filter-select"
                  value={scoreFilter}
                  onChange={(e) => setScoreFilter(e.target.value)}
                >
                  <option value="all">All Academic Marks</option>
                  <option value="above85">PCM &gt; 85% (Merit)</option>
                  <option value="70to85">PCM 70% – 85%</option>
                  <option value="below70">PCM &lt; 70%</option>
                </select>

                {/* Faculty Assignment Filter */}
                <select
                  className="admin-filter-select"
                  value={assignedFilter}
                  onChange={(e) => setAssignedFilter(e.target.value)}
                >
                  <option value="all">All Assignments</option>
                  <option value="me">Assigned to Me</option>
                  <option value="unassigned">Unassigned Inquiries</option>
                </select>

                {(searchQuery || statusFilter !== "all" || programFilter !== "all" || scoreFilter !== "all" || assignedFilter !== "all") && (
                  <button
                    type="button"
                    onClick={() => {
                      setSearchQuery("");
                      setStatusFilter("all");
                      setProgramFilter("all");
                      setScoreFilter("all");
                      setAssignedFilter("all");
                    }}
                    style={{
                      background: "none",
                      border: "none",
                      color: "#dc2626",
                      fontSize: "12px",
                      cursor: "pointer",
                      padding: "4px 8px"
                    }}
                  >
                    Reset Filters
                  </button>
                )}
              </div>

              <span style={{ fontSize: "12px", color: "#6b7280" }}>
                Showing <strong>{filteredLeads.length}</strong> of {leads.length} student profiles
              </span>
            </div>
          </div>

          {/* Inquiries List */}
          <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
            {filteredLeads.length > 0 ? (
              filteredLeads.map((lead) => {
                const assignedTeacher = staffList.find((s) => s.user_id === lead.assigned_to);
                const isAssignedToMe = lead.assigned_to === session?.user?.id;
                const cleanPhone = (lead.phone || "").replace(/\D/g, "");

                return (
                  <article key={lead.id} className="lead-card-expanded">
                    <div className="lead-card-top">
                      <div className="lead-student-meta">
                        <div style={{ display: "flex", alignItems: "center", gap: "8px", flexWrap: "wrap" }}>
                          <strong>{lead.student_name}</strong>
                          {isAssignedToMe && (
                            <span style={{ fontSize: "11px", background: "#dbeafe", color: "#1e40af", fontWeight: 700, padding: "2px 8px", borderRadius: "4px" }}>
                              Assigned to You
                            </span>
                          )}
                        </div>
                        <small>
                          Ref: {lead.reference_code} · {lead.program_interest} · {new Date(lead.created_at).toLocaleDateString()}
                        </small>
                      </div>
                      <span className={`tracker-badge ${lead.status || "new"}`}>
                        {lead.status === "new" ? "New Lead" : lead.status}
                      </span>
                    </div>

                    {/* Student Hidden Profile Details */}
                    <div className="lead-profile-grid">
                      <div className="profile-stat-box">
                        <span>Phone / WhatsApp</span>
                        <strong>
                          <a href={`tel:${lead.phone}`} style={{ color: "inherit", textDecoration: "none" }}>
                            {lead.phone}
                          </a>
                        </strong>
                      </div>
                      <div className="profile-stat-box">
                        <span>Email</span>
                        <strong>
                          <a href={`mailto:${lead.email}`} style={{ color: "inherit", textDecoration: "none" }}>
                            {lead.email}
                          </a>
                        </strong>
                      </div>
                      <div className="profile-stat-box">
                        <span>Academic Marks</span>
                        <strong>12th: {lead.marks_12th ? `${lead.marks_12th}%` : "—"} | 10th: {lead.marks_10th ? `${lead.marks_10th}%` : "—"}</strong>
                      </div>
                      <div className="profile-stat-box">
                        <span>Entrance Exam</span>
                        <strong>{lead.entrance_exam || "MHT-CET / MGMU-CET"}</strong>
                      </div>
                      <div className="profile-stat-box">
                        <span>Location</span>
                        <strong>{lead.location || "Maharashtra"}</strong>
                      </div>
                    </div>

                    {/* Faculty Assignment Bar */}
                    <div className="lead-faculty-row">
                      <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                        <UserCheck size={14} color="#0f766e" />
                        <span>Assigned Counsellor:</span>
                        <select
                          className="lead-faculty-select"
                          value={lead.assigned_to || ""}
                          onChange={(e) => updateLeadAssignment(lead.id, e.target.value)}
                        >
                          <option value="">-- Unassigned (Admissions Pool) --</option>
                          {staffList.map((st) => (
                            <option key={st.user_id} value={st.user_id}>
                              {st.display_name} {st.user_id === session?.user?.id ? "(You)" : ""}
                            </option>
                          ))}
                        </select>
                      </div>

                      {assignedTeacher && (
                        <span style={{ fontSize: "11px", color: "#0369a1" }}>
                          Managed by {assignedTeacher.display_name}
                        </span>
                      )}
                    </div>

                    {/* Question / Chat Transcript */}
                    {lead.question && (
                      <div className="lead-question-box">
                        <strong>Counselling Transcript & Questions:</strong>
                        <div style={{ marginTop: "4px" }}>{lead.question}</div>
                      </div>
                    )}

                    {/* Inline Counsellor Notes Area */}
                    <div className="lead-notes-area">
                      <div className="lead-notes-header">
                        <span>Internal Counsellor Notes</span>
                        {savingNotesId === lead.id && <small style={{ color: "#d97706" }}>Saving...</small>}
                      </div>
                      <textarea
                        className="lead-notes-input"
                        placeholder="Log calling feedback, verified documents, candidate scholarship eligibility or discussion notes..."
                        value={leadNotesState[lead.id] !== undefined ? leadNotesState[lead.id] : (lead.counselor_notes || "")}
                        onChange={(e) => {
                          const val = e.target.value;
                          setLeadNotesState((prev) => ({ ...prev, [lead.id]: val }));
                        }}
                      />
                      <button
                        type="button"
                        className="save-notes-btn"
                        onClick={() => saveLeadNotes(lead.id)}
                        disabled={savingNotesId === lead.id}
                      >
                        <Save size={12} /> Save Note
                      </button>
                    </div>

                    {/* Lead Actions Bar */}
                    <div className="lead-actions-bar">
                      <div className="status-select-wrap">
                        <span>Update Status:</span>
                        <select
                          value={lead.status || "new"}
                          onChange={(e) => updateLeadStatus(lead.id, e.target.value, leadNotesState[lead.id] || lead.counselor_notes)}
                        >
                          <option value="new">New</option>
                          <option value="contacted">Contacted</option>
                          <option value="qualified">Qualified</option>
                          <option value="closed">Closed</option>
                        </select>
                      </div>

                      <div className="lead-quick-contact">
                        {/* Direct Call */}
                        {lead.phone && (
                          <a href={`tel:${cleanPhone}`} className="contact-chip-btn contact-call" title="Direct Phone Call">
                            <Phone size={13} /> Call
                          </a>
                        )}

                        {/* Direct Email */}
                        {lead.email && (
                          <a
                            href={`mailto:${lead.email}?subject=MGM%20University%20IICT%20Admissions%20-%20Reference%20${encodeURIComponent(lead.reference_code || "")}&body=Dear%20${encodeURIComponent(lead.student_name)},%0A%0AGreetings%20from%20MGM%20University%20IICT%20Admissions%20Committee.`}
                            className="contact-chip-btn contact-mail"
                            title="Direct Email"
                          >
                            <Mail size={13} /> Email
                          </a>
                        )}

                        {/* Smart WhatsApp Templates Button */}
                        <button
                          type="button"
                          className="contact-chip-btn contact-wa-smart"
                          onClick={() => setTemplateModalLead(lead)}
                        >
                          <MessageCircle size={13} /> Smart WhatsApp
                        </button>
                      </div>
                    </div>
                  </article>
                );
              })
            ) : (
              <div className="dashboard-empty">
                <LockKeyhole size={24} />
                <h2>No inquiries match the current search or filters</h2>
                <p>Try resetting the search bar or changing status/program filters.</p>
                <button
                  type="button"
                  className="secondary-button"
                  style={{ marginTop: "12px" }}
                  onClick={() => {
                    setSearchQuery("");
                    setStatusFilter("all");
                    setProgramFilter("all");
                    setScoreFilter("all");
                    setAssignedFilter("all");
                  }}
                >
                  Reset All Filters
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Smart WhatsApp Templates Modal */}
      {templateModalLead && (
        <div className="wa-modal-overlay" onClick={() => setTemplateModalLead(null)}>
          <div className="wa-modal-box" onClick={(e) => e.stopPropagation()}>
            <div className="wa-modal-header">
              <h3>
                <MessageCircle size={18} color="#25d366" />
                Smart WhatsApp Communications
              </h3>
              <button
                type="button"
                onClick={() => setTemplateModalLead(null)}
                style={{ background: "none", border: "none", cursor: "pointer", color: "#6b7280" }}
              >
                <X size={20} />
              </button>
            </div>

            <div className="wa-modal-body">
              <div className="wa-candidate-summary">
                <div>
                  <strong>Student:</strong> {templateModalLead.student_name}
                </div>
                <div>
                  <strong>Phone:</strong> {templateModalLead.phone}
                </div>
                <div>
                  <strong>Program:</strong> {templateModalLead.program_interest}
                </div>
                <div>
                  <strong>Ref Code:</strong> {templateModalLead.reference_code}
                </div>
              </div>

              <p style={{ fontSize: "12.5px", color: "#4b5563", margin: 0 }}>
                Select an authoritative counselling template. Clicking will instantly launch WhatsApp with personalized candidate details pre-filled:
              </p>

              <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
                {getWhatsAppTemplates(templateModalLead).map((tpl) => {
                  const phoneNum = (templateModalLead.phone || "").replace(/\D/g, "");
                  const waUrl = `https://wa.me/91${phoneNum}?text=${encodeURIComponent(tpl.text)}`;

                  return (
                    <div key={tpl.id} className="wa-template-card">
                      <div className="wa-template-title-bar">
                        <span className="wa-template-title">{tpl.title}</span>
                        <span className="wa-template-tag">{tpl.tag}</span>
                      </div>
                      <div className="wa-template-preview">{tpl.text}</div>
                      <a
                        href={waUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="wa-send-btn"
                        onClick={() => {
                          // Auto update lead status to contacted if new
                          if (!templateModalLead.status || templateModalLead.status === "new") {
                            updateLeadStatus(templateModalLead.id, "contacted", templateModalLead.counselor_notes);
                          }
                          setTemplateModalLead(null);
                        }}
                      >
                        <MessageCircle size={14} /> Send via WhatsApp
                      </a>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      )}


      {/* TAB 2: Teacher Access Management (Super Admin Exclusive) */}
      {activeTab === "teachers" && userRole === "super_admin" && (
        <div className="teacher-management-grid">
          <div className="grant-teacher-card">
            <h3>Grant Staff &amp; Faculty Access</h3>
            <p>
              As Super Admin, you can grant faculty teachers and counsellors access to review student profiles, track lead status, update notes, and conduct admissions counselling.
            </p>
            {apiHealth?.status === "missing_key" && (
              <div style={{ background: "#fffbeb", border: "1px solid #fed7aa", padding: "10px 12px", borderRadius: "6px", fontSize: "11.5px", color: "#9a3412", margin: "10px 0" }}>
                ⚠️ <strong>Vercel Env Notice:</strong> <code>SUPABASE_SERVICE_ROLE_KEY</code> is not loaded in this deployment. Please ensure you added it to Vercel Project Settings &gt; Environment Variables for <strong>Production</strong>, then trigger a <strong>Redeploy</strong> in Vercel.
              </div>
            )}
            {apiHealth?.status === "online" && (
              <div style={{ background: "#f0fdf4", border: "1px solid #bbf7d0", padding: "6px 10px", borderRadius: "6px", fontSize: "11px", color: "#166534", margin: "10px 0", display: "inline-flex", alignItems: "center", gap: "6px" }}>
                <CheckCircle2 size={13} /> Cloud Admin API Online (Service Role Active)
              </div>
            )}
            <form onSubmit={handleGrantTeacher} style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
              <label style={{ fontSize: "11.5px", fontWeight: 600, color: "#374151" }}>
                Staff / Teacher Email
                <input
                  type="email"
                  value={newTeacherEmail}
                  onChange={(e) => setNewTeacherEmail(e.target.value)}
                  placeholder="teacher@mgmu.ac.in"
                  required
                  style={{ width: "100%", marginTop: "4px", padding: "8px 10px", border: "1px solid #d1d5db", borderRadius: "6px" }}
                />
              </label>

              <label style={{ fontSize: "11.5px", fontWeight: 600, color: "#374151" }}>
                Faculty Display Name
                <input
                  type="text"
                  value={newTeacherName}
                  onChange={(e) => setNewTeacherName(e.target.value)}
                  placeholder="Prof. / Dr. Name"
                  required
                  style={{ width: "100%", marginTop: "4px", padding: "8px 10px", border: "1px solid #d1d5db", borderRadius: "6px" }}
                />
              </label>

              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "10px" }}>
                <label style={{ fontSize: "11.5px", fontWeight: 600, color: "#374151" }}>
                  Assigned Role
                  <select
                    value={newTeacherRole}
                    onChange={(e) => setNewTeacherRole(e.target.value)}
                    style={{ width: "100%", marginTop: "4px", padding: "8px 10px", border: "1px solid #d1d5db", borderRadius: "6px", background: "#fff" }}
                  >
                    <option value="teacher">Teacher / Faculty</option>
                    <option value="counsellor">Admissions Counsellor</option>
                    <option value="admin">Admissions Admin</option>
                  </select>
                </label>

                <label style={{ fontSize: "11.5px", fontWeight: 600, color: "#374151" }}>
                  Department / Unit
                  <input
                    type="text"
                    value={newTeacherDept}
                    onChange={(e) => setNewTeacherDept(e.target.value)}
                    placeholder="IICT Faculty"
                    style={{ width: "100%", marginTop: "4px", padding: "8px 10px", border: "1px solid #d1d5db", borderRadius: "6px" }}
                  />
                </label>
              </div>

              <button
                type="submit"
                className="primary-button"
                disabled={granting}
                style={{ marginTop: "8px", justifyContent: "center" }}
              >
                <UserPlus size={15} /> {granting ? "Granting..." : "Grant Staff Access"}
              </button>
              {grantMsg && (
                <div style={{ padding: "8px 12px", borderRadius: "6px", background: grantMsg.includes("granted") || grantMsg.includes("recorded") ? "#ecfdf5" : "#fff7ed", border: "1px solid " + (grantMsg.includes("granted") || grantMsg.includes("recorded") ? "#a7f3d0" : "#fed7aa"), color: grantMsg.includes("granted") || grantMsg.includes("recorded") ? "#065f46" : "#9a3412", fontSize: "12px", fontWeight: 600 }}>
                  {grantMsg}
                </div>
              )}
            </form>
          </div>

          <div className="teacher-table-card">
            <div className="teacher-table-header">
              <strong>Authorized Faculty &amp; Staff ({staffList.length})</strong>
              <small style={{ color: "#6b7280" }}>Super Admin Managed</small>
            </div>
            {staffList.length > 0 ? (
              staffList.map((staff) => (
                <div key={staff.user_id || staff.email} className="teacher-list-row" style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <div className="teacher-meta-col">
                    <strong>{staff.display_name}</strong>
                    <small>{staff.email || "Faculty member"} · {staff.department || "IICT"}</small>
                  </div>
                  <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                    <span className={staff.role === "super_admin" ? "super-admin-badge" : "teacher-badge"}>
                      {staff.role}
                    </span>
                    {staff.role !== "super_admin" && staff.email !== "dp844771@gmail.com" && (
                      <button
                        type="button"
                        onClick={() => handleRevokeStaff(staff.email)}
                        disabled={revokingEmail === staff.email}
                        style={{
                          background: "#fee2e2",
                          border: "1px solid #fca5a5",
                          color: "#991b1b",
                          padding: "4px 8px",
                          borderRadius: "4px",
                          fontSize: "11px",
                          fontWeight: 600,
                          cursor: "pointer"
                        }}
                      >
                        {revokingEmail === staff.email ? "..." : "Revoke"}
                      </button>
                    )}
                  </div>
                </div>
              ))
            ) : (
              <div style={{ padding: "30px", textAlign: "center", color: "#6b7280", fontSize: "13px" }}>
                No staff members configured yet. Use the form to grant access to teachers.
              </div>
            )}
          </div>
        </div>
      )}

      {/* TAB 3: Authoritative Programs & Fees */}
      {activeTab === "programs" && (
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: "16px" }}>
          {fallbackPrograms.map((p) => (
            <div key={p.id} className="grant-teacher-card" style={{ padding: "20px" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "8px" }}>
                <span className="official-fee-chip">{formatCurrency(p.annual_tuition_fee)} / yr</span>
                <small style={{ color: "#6b7280" }}>{p.duration}</small>
              </div>
              <h3 style={{ fontSize: "15px", margin: "0 0 6px" }}>{p.name}</h3>
              <p style={{ fontSize: "11.5px", margin: "0 0 10px" }}>{p.description}</p>
              <div style={{ borderTop: "1px solid #f3f4f6", paddingTop: "8px", fontSize: "11px", color: "#6b7280" }}>
                <strong>Eligibility:</strong> {p.eligibility}
              </div>
            </div>
          ))}
        </div>
      )}
    </main>
  );
}

function StaffLogin({ onSuccess, onBack }) {
  const [email, setEmail] = useState("dp844771@gmail.com");
  const [password, setPassword] = useState("");
  const [mode, setMode] = useState("signin"); // "signin" | "signup" | "reset"
  const [error, setError] = useState("");
  const [infoMsg, setInfoMsg] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError("");
    setInfoMsg("");
    if (!supabase) {
      setError("Supabase is not configured yet.");
      return;
    }
    setLoading(true);

    try {
      if (mode === "signin") {
        const { data, error: loginError } = await supabase.auth.signInWithPassword({ email, password });
        if (loginError) throw loginError;
        onSuccess(data.session);
      } else if (mode === "signup") {
        const { data, error: signUpError } = await supabase.auth.signUp({
          email,
          password,
          options: {
            data: {
              display_name: email === "dp844771@gmail.com" ? "Dhananjay Pawar (Super Admin)" : "Staff Member"
            }
          }
        });
        if (signUpError) throw signUpError;
        if (data.session) {
          onSuccess(data.session);
        } else {
          setInfoMsg("Account registered! If confirmation is enabled in your Supabase project, check your email or proceed to Sign In.");
          setMode("signin");
        }
      } else if (mode === "reset") {
        const { error: resetError } = await supabase.auth.resetPasswordForEmail(email);
        if (resetError) throw resetError;
        setInfoMsg("Password reset email sent. Please check your inbox.");
      }
    } catch (err) {
      setError(err.message || "Authentication request failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="staff-login">
      <div className="staff-login-card">
        <div className="staff-lock">
          <LockKeyhole size={24} />
        </div>
        <p className="eyebrow">INTERNAL ACCESS</p>
        <h1>IICT Staff & Super Admin</h1>
        <p>Review and follow up with confidential admission inquiries securely.</p>

        {/* Tab Selector */}
        <div style={{ display: "flex", gap: "6px", marginBottom: "18px", borderBottom: "1px solid #dfe7e3", paddingBottom: "10px" }}>
          <button
            type="button"
            onClick={() => { setMode("signin"); setError(""); setInfoMsg(""); }}
            style={{
              padding: "6px 12px",
              borderRadius: "5px",
              fontSize: "12px",
              fontWeight: mode === "signin" ? "700" : "500",
              background: mode === "signin" ? "#001E32" : "transparent",
              color: mode === "signin" ? "#fff" : "#54635f"
            }}
          >
            Sign In
          </button>
          <button
            type="button"
            onClick={() => { setMode("signup"); setError(""); setInfoMsg(""); }}
            style={{
              padding: "6px 12px",
              borderRadius: "5px",
              fontSize: "12px",
              fontWeight: mode === "signup" ? "700" : "500",
              background: mode === "signup" ? "#001E32" : "transparent",
              color: mode === "signup" ? "#fff" : "#54635f"
            }}
          >
            Set Password / Register
          </button>
          <button
            type="button"
            onClick={() => { setMode("reset"); setError(""); setInfoMsg(""); }}
            style={{
              padding: "6px 12px",
              borderRadius: "5px",
              fontSize: "12px",
              fontWeight: mode === "reset" ? "700" : "500",
              background: mode === "reset" ? "#001E32" : "transparent",
              color: mode === "reset" ? "#fff" : "#54635f"
            }}
          >
            Forgot?
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          <label>
            Email address
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="dp844771@gmail.com"
              required
            />
          </label>
          {mode !== "reset" && (
            <label>
              Password
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder={mode === "signup" ? "Create a strong password" : "Your password"}
                required
              />
            </label>
          )}
          {error && <div className="staff-error">{error}</div>}
          {infoMsg && (
            <div style={{ background: "#FFF8F3", border: "1px solid #FCD7BD", color: "#8C3A0B", padding: "10px", borderRadius: "5px", fontSize: "11px", lineHeight: "1.4" }}>
              {infoMsg}
            </div>
          )}
          <button className="primary-button" type="submit" disabled={!supabaseConfigured || loading} style={{ justifyContent: "center" }}>
            {loading ? "Processing..." : mode === "signin" ? (
              <><LogIn size={16} /> Sign in</>
            ) : mode === "signup" ? (
              <><ShieldCheck size={16} /> Register & Set Password</>
            ) : (
              "Send Reset Link"
            )}
          </button>
        </form>

        <small style={{ marginTop: "16px", display: "block", color: "#6b7280", fontSize: "11.5px", lineHeight: 1.5 }}>
          Super Admin: <strong>dp844771@gmail.com</strong>.<br />
          Teachers authorized by Super Admin can sign in using their assigned emails.
        </small>
        <button className="back-link" onClick={onBack}>
          Return to public counselling
        </button>
      </div>
    </main>
  );
}

function App() {
  const [view, setView] = useState(
    window.location.pathname === "/staff"
      ? "staff-login"
      : window.location.pathname === "/compare"
      ? "compare"
      : window.location.pathname === "/inquiry"
      ? "inquiry"
      : "home"
  );
  const [session, setSession] = useState(null);
  const [lead, setLead] = useState(null);
  const [showTrackerModal, setShowTrackerModal] = useState(false);
  const [programs, setPrograms] = useState(fallbackPrograms);
  const [facts, setFacts] = useState(fallbackFacts);

  useEffect(() => {
    const handlePopState = () => {
      const path = window.location.pathname;
      if (path === "/staff") setView("staff-login");
      else if (path === "/compare") setView("compare");
      else if (path === "/inquiry") setView("inquiry");
      else setView("home");
    };
    window.addEventListener("popstate", handlePopState);
    return () => window.removeEventListener("popstate", handlePopState);
  }, []);

  useEffect(() => {
    if (!supabase) return;
    supabase.auth.getSession().then(({ data }) => setSession(data.session));
    const { data: listener } = supabase.auth.onAuthStateChange((_event, nextSession) => setSession(nextSession));

    supabase
      .from("programs")
      .select("id,name,degree,level,duration,annual_tuition_fee,intake_seats,description,eligibility,career_opportunities")
      .eq("published", true)
      .order("name")
      .then(({ data }) => {
        if (data?.length) setPrograms(data);
      });

    supabase
      .from("admission_facts")
      .select("key,value,source_url")
      .eq("published", true)
      .then(({ data }) => {
        if (data?.length)
          setFacts(
            data.reduce(
              (all, row) => ({
                ...all,
                [row.key]: row.value,
                source_url: row.source_url || all.source_url
              }),
              {}
            )
          );
      });

    return () => listener.subscription.unsubscribe();
  }, []);

  const submit = async (payload, setError) => {
    if (!supabase) {
      setError("Connect Supabase before accepting real inquiries.");
      return;
    }
    const reference_code = `IICT-2026-${crypto.randomUUID().slice(0, 6).toUpperCase()}`;
    const rpcRes = await supabase.rpc("submit_inquiry", {
      p_reference_code: reference_code,
      p_student_name: payload.student_name,
      p_email: payload.email,
      p_phone: payload.phone,
      p_program_interest: payload.program_interest,
      p_question: payload.question,
      p_course_category: payload.course_category || "UG",
      p_marks_10th: payload.marks_10th || null,
      p_marks_12th: payload.marks_12th || null,
      p_entrance_exam: payload.entrance_exam || null,
      p_entrance_score: payload.entrance_score || null,
      p_location: payload.location || "Maharashtra"
    });

    if (rpcRes.error) {
      // Graceful fallback to legacy 6-param signature if remote DB has older schema
      const fallbackRes = await supabase.rpc("submit_inquiry", {
        p_reference_code: reference_code,
        p_student_name: payload.student_name,
        p_email: payload.email,
        p_phone: payload.phone,
        p_program_interest: payload.program_interest,
        p_question: payload.question
      });
      if (fallbackRes.error) {
        setError(rpcRes.error.message || fallbackRes.error.message);
        return;
      }
    }

    const newLead = { ...payload, reference_code, status: "new", created_at: new Date().toISOString() };
    setLead(newLead);

    try {
      localStorage.setItem("iict_last_inquiry", JSON.stringify(newLead));
      const existingHistory = JSON.parse(localStorage.getItem("iict_inquiries_history") || "[]");
      existingHistory.unshift(newLead);
      localStorage.setItem("iict_inquiries_history", JSON.stringify(existingHistory.slice(0, 10)));
    } catch {
      // ignore
    }

    window.history.pushState({}, "", "/inquiry/success");
    setView("success");
  };

  const navigateTo = (newView, urlPath) => {
    window.history.pushState({}, "", urlPath);
    setView(newView);
  };

  return (
    <>
      <MyInquiryModal
        isOpen={showTrackerModal}
        onClose={() => setShowTrackerModal(false)}
        onStartNew={() => {
          setShowTrackerModal(false);
          navigateTo("inquiry", "/inquiry");
        }}
      />

      {view === "home" && (
        <Home
          onStart={() => navigateTo("inquiry", "/inquiry")}
          onCompare={() => navigateTo("compare", "/compare")}
          onStaff={() => navigateTo("staff-login", "/staff")}
          onMyInquiry={() => setShowTrackerModal(true)}
          session={session}
        />
      )}

      {view === "compare" && (
        <Compare
          programs={programs}
          facts={facts}
          onBack={() => navigateTo("home", "/")}
          onInquiry={(progName) => {
            if (progName && typeof progName === "string") {
              try { localStorage.setItem("iict_selected_prog", progName); } catch {}
            }
            navigateTo("inquiry", "/inquiry");
          }}
          onMyInquiry={() => setShowTrackerModal(true)}
          onStaff={() => navigateTo("staff-login", "/staff")}
          session={session}
        />
      )}

      {view === "inquiry" && (
        <Inquiry
          programs={programs}
          onSubmit={submit}
          onBack={() => navigateTo("home", "/")}
          onMyInquiry={() => setShowTrackerModal(true)}
          onStaff={() => navigateTo("staff-login", "/staff")}
          session={session}
        />
      )}

      {view === "staff-login" &&
        (session ? (
          <Dashboard
            session={session}
            onExit={() => {
              setSession(null);
              navigateTo("home", "/");
            }}
          />
        ) : (
          <StaffLogin
            onSuccess={(nextSession) => {
              setSession(nextSession);
              setView("dashboard");
            }}
            onBack={() => navigateTo("home", "/")}
          />
        ))}

      {view === "dashboard" && (
        <Dashboard
          session={session}
          onExit={() => navigateTo("home", "/")}
        />
      )}

      {view === "success" && (
        <>
          <Header
            onHome={() => navigateTo("home", "/")}
            onInquiry={() => navigateTo("inquiry", "/inquiry")}
            onPrograms={() => navigateTo("compare", "/compare")}
            onMyInquiry={() => setShowTrackerModal(true)}
            onStaff={() => navigateTo("staff-login", "/staff")}
            session={session}
            activeNav="inquiry"
          />
          <main className="success-page">
            <div className="success-icon">
              <Check size={28} />
            </div>
            <p className="eyebrow">INQUIRY SUBMITTED SECURELY</p>
            <h1>Your Inquiry Has Been Registered.</h1>
            <p className="success-lead">
              Your profile is registered securely and hidden from public view. An official IICT admissions counsellor will review your academic background and contact you for seat reservation.
            </p>
            <div className="success-card">
              <div>
                <span>Inquiry ID</span>
                <strong>{lead?.reference_code}</strong>
              </div>
              <div>
                <span>Student</span>
                <strong>{lead?.student_name}</strong>
              </div>
              <div>
                <span>Program</span>
                <strong>{lead?.program_interest}</strong>
              </div>
            </div>
            <div style={{ display: "flex", gap: "12px", justifyContent: "center", flexWrap: "wrap" }}>
              <button
                className="primary-button"
                onClick={() => setShowTrackerModal(true)}
              >
                <Search size={15} /> Track My Inquiry
              </button>
              <button
                className="secondary-button"
                onClick={() => navigateTo("inquiry", "/inquiry")}
              >
                Return to Counselling
              </button>
            </div>
          </main>
          <Footer onStaff={() => navigateTo("staff-login", "/staff")} />
        </>
      )}
    </>
  );
}

const container = document.getElementById("root");
if (!window.__reactRoot) {
  window.__reactRoot = createRoot(container);
}
window.__reactRoot.render(<App />);
