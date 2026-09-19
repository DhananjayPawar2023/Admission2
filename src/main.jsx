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
  Sparkles,
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
  Award
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

// ── Authoritative 2026–27 IICT Programs (from http://iict.mgmu.ac.in) ────────
const fallbackPrograms = [
  {
    id: "btech-aiml",
    name: "B.Tech in Artificial Intelligence & Machine Learning",
    degree: "B.Tech",
    level: "Undergraduate",
    duration: "4 years",
    annual_tuition_fee: 150000,
    intake_seats: 60,
    description: "Deep neural networks, computer vision, autonomous robotics, natural language processing and applied ML architectures.",
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
    intake_seats: 60,
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
    intake_seats: 30,
    description: "Direct entry into 2nd year B.Tech for polytechnic engineering diploma holders across AI & ML, CSE (AI), IT and Data Science.",
    eligibility: "3-year Engineering Diploma with minimum 45% (40% for Maharashtra Reserved categories).",
    career_opportunities: "Accelerated Engineering Careers in AI, CS, IT, and Analytics"
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
    id: "mtech-aiml",
    name: "M.Tech in Artificial Intelligence and Machine Learning",
    degree: "M.Tech",
    level: "Postgraduate",
    duration: "2 years",
    annual_tuition_fee: 150000,
    intake_seats: 18,
    description: "Postgraduate research in generative AI, deep reinforcement learning, cognitive computing and embedded edge intelligence.",
    eligibility: "B.E./B.Tech in CSE/IT/ECE with at least 50% (45% for Reserved). GATE / MGMU-CET PG.",
    career_opportunities: "Principal AI Scientist, Autonomous Systems Specialist, Generative AI Researcher"
  },
  {
    id: "diploma-cyber",
    name: "Diploma in Cyber Security and Digital Forensics",
    degree: "Diploma",
    level: "Diploma",
    duration: "1 year",
    annual_tuition_fee: 100000,
    intake_seats: 30,
    description: "Practical incident response, ethical hacking, digital forensics, malware analysis and information security compliance.",
    eligibility: "10+2 / HSC from any stream (Science, Commerce, Arts) with minimum 45% (40% for Reserved).",
    career_opportunities: "Cyber Security Analyst, Digital Forensics Examiner, SOC Analyst"
  }
];

// ── Authoritative 2026–27 Admission Facts & Contacts ─────────────────────────
const fallbackFacts = {
  academic_year: "2026–27",
  admissions_status: "Admissions Open (2026–27 Academic Batch)",
  application_deadline: "September 23, 2026",
  application_fee_domestic: "₹2,000 (Application & MGMU-CET)",
  application_fee_international: "₹5,000",
  caution_money_deposit: "₹5,000 (Refundable)",
  eligibility_fee: "₹5,000",
  scholarships: "150+ Merit-based Scholarships (Up to 100% tuition waivers for top MHT-CET/JEE/HSC rankers), Sports concessions & MahaDBT government schemes",
  university_programs: "310+ Programs across MGM University",
  helpline_phone_1: "+91 0240-6481000",
  helpline_phone_2: "+91 906 761 2000",
  helpline_phone_3: "+91 93564 36622 / +91 93564 36633",
  admissions_email: "admissions@mgmu.ac.in",
  iict_office_email: "iict@mgmu.ac.in",
  campus_address: "Institute of Information and Communication Technology (IICT), MGM University, MGM Campus, N-6, CIDCO, Chhatrapati Sambhajinagar (Aurangabad) - 431003, Maharashtra, India",
  office_hours: "Monday – Saturday: 9:30 AM – 5:00 PM",
  source_url: "http://iict.mgmu.ac.in"
};

function formatCurrency(val) {
  return "₹" + Number(val).toLocaleString("en-IN");
}

function Header({ onHome, onInquiry, onPrograms, onMyInquiry, onStaff, session, activeNav }) {
  return (
    <header className="site-header">
      <button className="brand" onClick={onHome}>
        <span className="brand-mark">M</span>
        <span>
          <strong>MGM University</strong>
          <small>IICT Admissions 2026–27</small>
        </span>
      </button>
      <nav>
        <button className={activeNav === "inquiry" ? "active" : ""} onClick={onInquiry}>
          Start Inquiry
        </button>
        <button className={activeNav === "programs" ? "active" : ""} onClick={onPrograms}>
          Programs & Fees
        </button>
        <button className={activeNav === "myInquiry" ? "active" : ""} onClick={onMyInquiry}>
          My Inquiry
        </button>
      </nav>
      <div className="header-right">
        <button className="contact-link" onClick={onInquiry}>
          Helpline <ArrowRight size={14} />
        </button>
        <span className="status">
          <i /> Admissions 2026–27
        </span>
        {session ? (
          <button className="header-signin-btn logged-in" onClick={onStaff} title="Staff Dashboard">
            <ShieldCheck size={13} /> Staff Portal
          </button>
        ) : (
          <button className="header-signin-btn" onClick={onStaff} title="Staff & Teacher Sign In">
            Sign In
          </button>
        )}
      </div>
    </header>
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
                  <span style={{ color: "#059669", fontWeight: 600, fontSize: "11.5px" }}>
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
            <Sparkles size={16} />
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
        <span>Helpline: +91 0240-6481000 / +91 906 761 2000</span>
      </div>
      <Footer onStaff={onStaff} />
    </div>
  );
}

function Compare({ programs, facts, onBack, onInquiry, onMyInquiry, onStaff, session }) {
  const [selected, setSelected] = useState(["btech-aiml", "btech-cse-ai", "btech-it", "btech-ds"]);
  const visible = programs.filter((p) => selected.includes(p.id));
  const toggle = (id) =>
    setSelected((items) =>
      items.includes(id) ? (items.length > 1 ? items.filter((item) => item !== id) : items) : items.length < 4 ? [...items, id] : items
    );

  return (
    <>
      <Header
        onHome={onBack}
        onInquiry={onInquiry}
        onPrograms={() => {}}
        onMyInquiry={onMyInquiry}
        onStaff={onStaff}
        session={session}
        activeNav="programs"
      />
      <main className="compare-page">
        <div className="compare-heading">
          <div>
            <p className="eyebrow">OFFICIAL IICT 2026–27 CURRICULUM & FEE SCHEDULE</p>
            <h1>Programs & Fee Structure</h1>
            <p className="muted">Authoritative fees and eligibility criteria sourced from http://iict.mgmu.ac.in.</p>
          </div>
          <button className="primary-button" onClick={onInquiry}>
            Apply for Counselling <ArrowRight size={15} />
          </button>
        </div>

        <div className="compare-picker">
          {programs.map((program) => (
            <button
              className={selected.includes(program.id) ? "selected" : ""}
              key={program.id}
              onClick={() => toggle(program.id)}
            >
              <span>{selected.includes(program.id) ? <Check size={14} /> : <span className="empty-check" />}</span>
              {program.name}
            </button>
          ))}
        </div>

        <div className="compare-table">
          <div className="compare-row compare-labels">
            <div>Program</div>
            {visible.map((p) => (
              <div key={p.id}>
                <strong>{p.name}</strong>
              </div>
            ))}
          </div>
          <div className="compare-row">
            <div>Annual Tuition Fee</div>
            {visible.map((p) => (
              <div key={p.id}>
                <span className="official-fee-chip">{formatCurrency(p.annual_tuition_fee)} / year</span>
              </div>
            ))}
          </div>
          <div className="compare-row">
            <div>Level & Duration</div>
            {visible.map((p) => (
              <div key={p.id}>{p.level} · {p.duration}</div>
            ))}
          </div>
          <div className="compare-row">
            <div>Intake / Seats</div>
            {visible.map((p) => (
              <div key={p.id}>{p.intake_seats} seats</div>
            ))}
          </div>
          <div className="compare-row">
            <div>Core Focus</div>
            {visible.map((p) => (
              <div key={p.id}>{p.description}</div>
            ))}
          </div>
          <div className="compare-row">
            <div>Official Eligibility</div>
            {visible.map((p) => (
              <div key={p.id}>{p.eligibility}</div>
            ))}
          </div>
          <div className="compare-row">
            <div>Career Prospects</div>
            {visible.map((p) => (
              <div key={p.id}>{p.career_opportunities}</div>
            ))}
          </div>
        </div>

        <div className="official-facts" style={{ marginTop: "32px" }}>
          <span className="verified-mark">
            <Check size={13} />
          </span>
          <div>
            <strong>Verified MGM University IICT Fee & Date Guidelines (2026–27)</strong>
            <p>
              • Application & MGMU-CET Fee: <strong>{facts.application_fee_domestic || "₹2,000"}</strong> (Domestic) / {facts.application_fee_international || "₹5,000"} (International)<br />
              • Caution Money Deposit: <strong>{facts.caution_money_deposit || "₹5,000"}</strong> (100% Refundable) · Eligibility Fee: <strong>{facts.eligibility_fee || "₹5,000"}</strong><br />
              • Current Application Deadline: <strong>{facts.application_deadline || "September 23, 2026"}</strong><br />
              • Scholarships: {facts.scholarships}
            </p>
            <small>Helpline: {facts.helpline_phone_1} · Source: {facts.source_url}</small>
          </div>
        </div>
      </main>
      <Footer onStaff={() => {}} />
    </>
  );
}

// ── AI Counsellor Chatbot Engine (Authoritative Knowledge Base) ───────────
const quickChips = [
  "Explore Programs",
  "Find the Right Course",
  "Check Fees (2026–27)",
  "Eligibility & Entrance",
  "Scholarships",
  "Admission Dates",
  "Talk to Admissions"
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
    const keywords = ["fee", "fees", "course", "courses", "ai", "cse", "it", "ds", "scholarship", "cutoff", "eligibility", "when", "how", "what", "where", "hi", "hello", "hey", "yes", "no", "ok", "sure", "help"];
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
    (q === "yes" || q === "submit" || q === "confirm" || q === "apply" || q.includes("submit inquiry") || q.includes("submit my inquiry") || q.includes("please submit") || q.includes("confirm inquiry")) &&
    p.name && (p.phone || p.email)
  ) {
    return {
      text: `Excellent, ${p.name}! I am submitting your official priority admission inquiry to the IICT admissions desk right now...`,
      actionType: "submit_now"
    };
  }

  let answer = "";

  // 1. Fee queries
  if (q.includes("fee") || q.includes("cost") || q.includes("tuition") || q.includes("check fees") || q.includes("expense") || q.includes("charges")) {
    answer = "Here is the official 2026–27 Annual Tuition Fee schedule for MGM University IICT:\n\n• B.Tech AI & ML: ₹1,50,000 / year (4 Years)\n• B.Tech Data Science: ₹1,50,000 / year (4 Years)\n• B.Tech Information Technology: ₹1,75,000 / year (4 Years)\n• B.Tech CSE (Artificial Intelligence): ₹2,04,500 / year (4 Years)\n• B.Tech Lateral Entry (DSY): ₹1,50,000 / year (3 Years)\n• M.Tech (AI & ML / Data Science): ₹1,50,000 / year (2 Years)\n• Diploma in Cyber Security: ₹1,00,000 / year (1 Year)\n\nAdditional official charges: Application & MGMU-CET (₹2,000), Refundable Caution Money (₹5,000), and University Eligibility fee (₹5,000). Up to 100% tuition waiver is available under our 150+ merit scholarships!";
  }
  // 2. Program comparison or course choice
  else if (q.includes("which course") || q.includes("difference") || q.includes("compare") || (q.includes("ai") && (q.includes("cse") || q.includes("ds") || q.includes("it")))) {
    answer = "Comparing IICT's premier engineering pathways:\n\n1. B.Tech AI & ML (₹1.50L/yr): Focused on intelligent systems, neural networks, robotics, computer vision, and generative AI models.\n2. B.Tech CSE (AI) (₹2.045L/yr): Rigorous classic computer science engineering (compilers, operating systems, algorithms) combined with an applied AI specialization. Excellent for global tier-1 tech hiring.\n3. B.Tech Data Science (₹1.50L/yr): Emphasizes big-data engineering, statistical machine learning, business intelligence, and real-time data streaming.\n4. B.Tech IT (₹1.75L/yr): Focuses on cloud computing, devops, cybersecurity, and enterprise software architecture.";
  }
  // 3. Eligibility & Entrance Exams
  else if (q.includes("eligib") || q.includes("criteria") || q.includes("entrance") || q.includes("cet") || q.includes("jee") || q.includes("cutoff") || q.includes("cut off") || q.includes("marks") || q.includes("percent")) {
    answer = "Official 2026–27 Eligibility Criteria for IICT Admissions:\n\n• Academic Requirement: Passed 10+2 (HSC) with Physics & Mathematics as compulsory subjects, plus Chemistry/CS/IT/Biology with at least 45% aggregate (40% for Maharashtra reserved categories: SC/ST/OBC/EWS/PwD).\n• Accepted Entrance Exams: MHT-CET 2026, JEE (Main) 2026, or MGMU-CET 2026.\n• Lateral Entry (DSY): 3-year Engineering Diploma with minimum 45% aggregate marks (40% for reserved category).";
  }
  // 4. Scholarships
  else if (q.includes("scholarship") || q.includes("waiver") || q.includes("concession") || q.includes("financial aid") || q.includes("discount")) {
    answer = "MGM University offers extensive financial assistance for 2026–27:\n\n• 150+ Merit Scholarships: 25% to 100% tuition waivers for top percentiles in MHT-CET, JEE Main, and 12th Board examinations.\n• Sports & Cultural Concessions: Fee waivers for state and national athletes.\n• Government Welfare Schemes: Direct facilitation for MahaDBT post-matric scholarships (SC/ST/OBC/SBC/VJNT) and EBC tuition subsidies.";
  }
  // 5. Dates & Deadlines
  else if (q.includes("date") || q.includes("deadline") || q.includes("schedule") || q.includes("last date")) {
    answer = "Key Dates for 2026–27 Admissions:\n\n• Application Round: Open now until September 23, 2026\n• MGMU-CET Slot: Online test link provided immediately upon registration\n• Document Verification & Seat Allotment: Rolling basis on merit rank at the IICT admission office.";
  }
  // 6. Placements & Recruiters
  else if (q.includes("placement") || q.includes("package") || q.includes("salary") || q.includes("company") || q.includes("recruit")) {
    answer = "IICT Placement Highlights:\n\n• Top Recruiters: Tata Consultancy Services, Infosys, Tech Mahindra, Cognizant, Persistent Systems, Capgemini, and leading AI product startups.\n• Dedicated Training: Dedicated training on DSA, Cloud architectures, Deep Learning frameworks, and mock technical interviews starting from 3rd year.\n• Campus AI Research Labs equipped with high-performance GPU clusters.";
  }
  // 7. Hostel & Campus
  else if (q.includes("hostel") || q.includes("mess") || q.includes("stay") || q.includes("accommodation") || q.includes("campus") || q.includes("facility")) {
    answer = "Campus & Hostel Facilities:\n\n• On-Campus Hostels: Separate secure hostels for boys and girls with high-speed Wi-Fi, 24/7 power backup, hygienic dining mess, sports gymnasium, and round-the-clock medical care.\n• Campus Location: MGM University, MGM Campus, N-6, CIDCO, Chhatrapati Sambhajinagar (Aurangabad).";
  }
  // 8. Contact & Helplines
  else if (q.includes("contact") || q.includes("helpline") || q.includes("phone") || q.includes("email") || q.includes("address") || q.includes("counselor") || q.includes("talk to")) {
    answer = "Official IICT MGM University Helpdesk:\n\n• Admission Helplines: +91 0240-6481000 | +91 906 761 2000 | +91 93564 36622\n• Official Email: admissions@mgmu.ac.in | iict@mgmu.ac.in\n• Office Hours: Monday – Saturday (9:30 AM – 5:00 PM)";
  }
  // 9. Greeting / General fallback
  else {
    if (p.name) {
      answer = `Thank you, ${p.name}! I am your IICT Admission Counsellor. I can provide accurate details on 2026–27 course fees, compare programs, check your eligibility, and calculate your merit scholarship.`;
    } else {
      answer = "Welcome to IICT Admissions! I am your official admission counsellor for the 2026–27 academic year. I can provide verified fees, compare AI & ML vs CSE (AI) vs Data Science, check your CET/JEE eligibility, and detail merit scholarships.";
    }
  }

  // Progressive conversational prompt based on missing info:
  let prompt = "";
  let actionType = null;

  if (!p.name) {
    prompt = "\n\nMay I know your **full name** so I can personalize your official counselling record?";
  } else if (!p.interested_program) {
    prompt = `\n\nWhich program excites you most, ${p.name}? We offer B.Tech AI & ML (₹1.50L/yr), B.Tech CSE (AI) (₹2.045L/yr), B.Tech IT (₹1.75L/yr), or B.Tech Data Science (₹1.50L/yr)?`;
  } else if (!p.marks_12th && !p.entrance_score) {
    prompt = `\n\nTo evaluate your seat eligibility and check if you qualify for our 25% to 100% merit scholarship waivers, **what is your 12th percentage or entrance exam score (MHT-CET / JEE)?**`;
  } else if (!p.phone || !p.email) {
    prompt = `\n\nGreat! To ensure the IICT admissions committee can send you your official eligibility report and seat reservation confirmation, **could you please share your WhatsApp mobile number and email address?**`;
  } else {
    // All required information gathered!
    prompt = `\n\n📋 **Your Official IICT Admission Summary:**\n• Candidate: **${p.name}**\n• Target Program: **${p.interested_program}**\n• Contact: **${p.phone}** | **${p.email}**\n• Academic Background: **${p.academic_background || '12th PCM'}**\n• Entrance Score: **${p.entrance_exam || 'Eligible'}**\n• Domicile: **${p.location}**\n\nAll your details are ready! Would you like me to submit your official priority admission inquiry to the IICT admissions desk now?`;
    actionType = "submit_proposal";
  }

  return {
    text: answer + prompt,
    actionType
  };
}

function Inquiry({ programs, onSubmit, onBack, onMyInquiry, onStaff, session }) {
  const [messages, setMessages] = useState([
    {
      id: "m-1",
      role: "assistant",
      content:
        "Hello and welcome to MGM University IICT Admissions (2026–27)! 🎓\n\nI am your official AI Admission Counsellor. I can answer all your questions regarding our specialized B.Tech, M.Tech, and Diploma programs, official 2026–27 fee structures, eligibility cutoffs, and 150+ merit scholarships.\n\nTo begin your personal admission counselling, **what is your full name**, and which engineering program or domain interests you?"
    }
  ]);

  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [error, setError] = useState("");
  const [showEditModal, setShowEditModal] = useState(false);
  const [modalMode, setModalMode] = useState("edit");
  const [submitting, setSubmitting] = useState(false);

  const [profile, setProfile] = useState({
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
          "Hello and welcome to MGM University IICT Admissions (2026–27)! 🎓\n\nI am your official AI Admission Counsellor. I can answer all your questions regarding our specialized B.Tech, M.Tech, and Diploma programs, official 2026–27 fee structures, eligibility cutoffs, and 150+ merit scholarships.\n\nTo begin your personal admission counselling, **what is your full name**, and which engineering program or domain interests you?"
      }
    ]);
  };

  const chatEndRef = useRef(null);

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
      const { text: replyText, actionType } = generateCounsellorReply(text, updatedProfile);

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
          actionType: actionType
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
        {/* Left Column: Chat Area */}
        <section className="counselling-chat-col">
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
                      {m.actionType === "submit_proposal" && (
                        <div className="in-chat-submission-card">
                          <div className="in-chat-card-header">
                            <Sparkles size={16} color="#0c5b52" />
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
              <small style={{ color: "#047857", fontSize: "11px" }}>
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
        <aside className="counselling-sidebar">
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
                  backgroundColor: profile.progress === 100 ? "#d1fae5" : profile.progress >= 60 ? "#ecfdf5" : "#f3f4f6",
                  color: profile.progress === 100 ? "#065f46" : profile.progress >= 60 ? "#047857" : "#4b5563"
                }}
              >
                {profile.progress === 100 ? (
                  <><CheckCircle2 size={13} style={{ color: "#059669" }} /> Profile 100% Ready</>
                ) : profile.progress >= 60 ? (
                  <><Sparkles size={13} style={{ color: "#047857" }} /> Reviewing Eligibility</>
                ) : profile.progress > 0 ? (
                  <><Clock size={13} style={{ color: "#4b5563" }} /> Intake In Progress</>
                ) : (
                  <><HelpCircle size={13} style={{ color: "#6b7280" }} /> Ready to Start</>
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
                    ? "linear-gradient(90deg, #10b981, #059669)"
                    : "linear-gradient(90deg, #0d4b3b, #10b981)"
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
              <Lock size={12} color="#059669" />
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
  const [statusFilter, setStatusFilter] = useState("all");
  const [granting, setGranting] = useState(false);
  const [grantMsg, setGrantMsg] = useState("");

  const userEmail = session?.user?.email || "";

  useEffect(() => {
    if (!supabase) return;

    // Check current staff profile role
    supabase
      .from("staff_profiles")
      .select("role, display_name")
      .eq("user_id", session.user.id)
      .maybeSingle()
      .then(({ data }) => {
        if (data?.role) {
          setUserRole(data.role);
        } else if (session?.user?.email === "dp844771@gmail.com") {
          setUserRole("super_admin");
        } else {
          setUserRole(null);
          setError("Your account does not have staff permissions yet. Please contact the Admissions Directorate.");
        }
      });

    // Load inquiries (protected by RLS)
    supabase
      .from("inquiries")
      .select("*")
      .order("created_at", { ascending: false })
      .then(({ data, error: queryError }) => {
        if (queryError) setError(queryError.message);
        else setLeads(data || []);
      });

    // Load staff profiles list (protected by RLS)
    supabase
      .from("staff_profiles")
      .select("*")
      .order("created_at", { ascending: false })
      .then(({ data }) => {
        if (data) setStaffList(data);
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

  const handleGrantTeacher = async (e) => {
    e.preventDefault();
    if (!newTeacherEmail || !newTeacherName) return;

    setGranting(true);
    setGrantMsg("");

    const newStaffObj = {
      user_id: crypto.randomUUID(),
      email: newTeacherEmail.toLowerCase().trim(),
      display_name: newTeacherName.trim(),
      role: "teacher",
      department: "IICT Faculty",
      created_at: new Date().toISOString()
    };

    if (supabase) {
      const { error: insertError } = await supabase.from("staff_profiles").insert([newStaffObj]);
      if (insertError) {
        setGrantMsg(insertError.message.includes("foreign key")
          ? "Note: The teacher must register an account first with this email."
          : `Notice: ${insertError.message}`);
      } else {
        setGrantMsg("Teacher access granted successfully!");
        setStaffList((prev) => [newStaffObj, ...prev]);
        setNewTeacherEmail("");
        setNewTeacherName("");
      }
    }
    setGranting(false);
  };

  const filteredLeads = leads.filter((l) => {
    if (statusFilter === "all") return true;
    return l.status === statusFilter;
  });

  if (userRole === null) {
    return (
      <main className="dashboard-page" style={{ maxWidth: 560, margin: "60px auto", textAlign: "center" }}>
        <div className="grant-teacher-card" style={{ padding: "36px 24px" }}>
          <ShieldAlert size={40} color="#d97706" style={{ margin: "0 auto 14px" }} />
          <h2 style={{ fontSize: "19px", color: "#111827", margin: "0 0 10px" }}>Staff Access Pending</h2>
          <p style={{ color: "#4b5563", fontSize: "13.5px", lineHeight: 1.6, margin: "0 0 24px" }}>
            Signed in as <strong>{userEmail}</strong>.<br />
            Your account is authenticated, but staff permissions have not been assigned yet. Please contact the Admissions Directorate for activation.
          </p>
          <button
            type="button"
            className="secondary-button"
            style={{ margin: "0 auto" }}
            onClick={async () => {
              await supabase?.auth.signOut();
              onExit();
            }}
          >
            Sign out
          </button>
        </div>
      </main>
    );
  }

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
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "20px", flexWrap: "wrap", gap: "12px" }}>
            <div style={{ display: "flex", gap: "8px", alignItems: "center" }}>
              <span style={{ fontSize: "12px", color: "#6b7280" }}>Filter Status:</span>
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                style={{ padding: "6px 12px", borderRadius: "6px", border: "1px solid #d1d5db", fontSize: "12.5px" }}
              >
                <option value="all">All Inquiries</option>
                <option value="new">New</option>
                <option value="contacted">Contacted</option>
                <option value="qualified">Qualified</option>
                <option value="closed">Closed</option>
              </select>
            </div>
            <span style={{ fontSize: "12px", color: "#6b7280" }}>
              Showing {filteredLeads.length} student profiles (Protected under RLS)
            </span>
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
            {filteredLeads.length > 0 ? (
              filteredLeads.map((lead) => (
                <article key={lead.id} className="lead-card-expanded">
                  <div className="lead-card-top">
                    <div className="lead-student-meta">
                      <strong>{lead.student_name}</strong>
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
                      <strong><a href={`tel:${lead.phone}`} style={{ color: "inherit", textDecoration: "none" }}>{lead.phone}</a></strong>
                    </div>
                    <div className="profile-stat-box">
                      <span>Email</span>
                      <strong><a href={`mailto:${lead.email}`} style={{ color: "inherit", textDecoration: "none" }}>{lead.email}</a></strong>
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

                  {lead.question && (
                    <div className="lead-question-box">
                      <strong>Counselling Transcript & Questions:</strong>
                      <div style={{ marginTop: "4px" }}>{lead.question}</div>
                    </div>
                  )}

                  <div className="lead-actions-bar">
                    <div className="status-select-wrap">
                      <span>Update Status:</span>
                      <select
                        value={lead.status}
                        onChange={(e) => updateLeadStatus(lead.id, e.target.value, lead.counselor_notes)}
                      >
                        <option value="new">New</option>
                        <option value="contacted">Contacted</option>
                        <option value="qualified">Qualified</option>
                        <option value="closed">Closed</option>
                      </select>
                    </div>

                    <div style={{ display: "flex", gap: "8px" }}>
                      <a
                        href={`https://wa.me/91${lead.phone.replace(/\D/g, "")}?text=Hello%20${encodeURIComponent(lead.student_name)},%20this%20is%20MGM%20University%20IICT%20Admissions%20Committee%20following%20up%20on%20your%20inquiry%20for%20${encodeURIComponent(lead.program_interest)}.`}
                        target="_blank"
                        rel="noreferrer"
                        className="secondary-button"
                        style={{ padding: "6px 12px", fontSize: "11px" }}
                      >
                        WhatsApp Student
                      </a>
                    </div>
                  </div>
                </article>
              ))
            ) : (
              <div className="dashboard-empty">
                <LockKeyhole size={24} />
                <h2>No inquiries found</h2>
                <p>New inquiries submitted by students will securely populate here.</p>
              </div>
            )}
          </div>
        </div>
      )}

      {/* TAB 2: Teacher Access Management (Super Admin Exclusive) */}
      {activeTab === "teachers" && userRole === "super_admin" && (
        <div className="teacher-management-grid">
          <div className="grant-teacher-card">
            <h3>Grant Teacher Access</h3>
            <p>
              As Super Admin, you can grant faculty teachers access to review student profiles, track lead status, and conduct admissions counselling.
            </p>
            <form onSubmit={handleGrantTeacher} style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
              <label style={{ fontSize: "11.5px", fontWeight: 600, color: "#374151" }}>
                Teacher Email
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

              <button
                type="submit"
                className="primary-button"
                disabled={granting}
                style={{ marginTop: "8px", justifyContent: "center" }}
              >
                <UserPlus size={15} /> {granting ? "Granting..." : "Grant Teacher Access"}
              </button>
              {grantMsg && <small style={{ color: "#059669", fontWeight: 600 }}>{grantMsg}</small>}
            </form>
          </div>

          <div className="teacher-table-card">
            <div className="teacher-table-header">
              <strong>Authorized Faculty & Staff ({staffList.length})</strong>
              <small style={{ color: "#6b7280" }}>Super Admin Managed</small>
            </div>
            {staffList.length > 0 ? (
              staffList.map((staff) => (
                <div key={staff.user_id} className="teacher-list-row">
                  <div className="teacher-meta-col">
                    <strong>{staff.display_name}</strong>
                    <small>{staff.email || "Faculty member"} · {staff.department || "IICT"}</small>
                  </div>
                  <span className={staff.role === "super_admin" ? "super-admin-badge" : "teacher-badge"}>
                    {staff.role}
                  </span>
                </div>
              ))
            ) : (
              <div style={{ padding: "30px", textAlign: "center", color: "#6b7280", fontSize: "13px" }}>
                No additional teachers granted access yet. Use the form to grant access to teachers.
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
              background: mode === "signin" ? "#0c5b52" : "transparent",
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
              background: mode === "signup" ? "#0c5b52" : "transparent",
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
              background: mode === "reset" ? "#0c5b52" : "transparent",
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
            <div style={{ background: "#edf7f2", border: "1px solid #c2e2d0", color: "#0c5b52", padding: "10px", borderRadius: "5px", fontSize: "11px", lineHeight: "1.4" }}>
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
          onInquiry={() => navigateTo("inquiry", "/inquiry")}
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
