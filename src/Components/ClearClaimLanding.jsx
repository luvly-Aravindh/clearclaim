import { useEffect, useMemo, useRef, useState } from "react";
import "./ClearClaimLanding.css";
import rajeshImg from "../assets/rajesh.png";
import anjaliImg from "../assets/anjali.png";
import deepakImg from "../assets/deepak.png";
import nirajImg from "../assets/niraj.png";
import rohitImg from "../assets/rohit.png";
import priyaImg from "../assets/priya.png";
import vikramImg from "../assets/vikram.png";

const CONFIG = {
  PDF_URL: "./src/clearclaim_optin.pdf",
  PDF_FILENAME: "clearclaim_optin.pdf",
  // (No longer used to navigate — the SPA advances to the landing page via
  // the onComplete() callback. Kept only for reference.)
  REDIRECT_URL: "/landing",
  // Optional fire-and-forget lead capture (leave "" to disable).
  WEBHOOK_URL: "",
  LOGO_URL: "https://www.clearclaim.in/_next/static/media/logo.0..s._s9yl8ut.png",
};

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

/* Force a real file download on the SAME page — even when the file lives on
   a different origin (getnos.io). The HTML `download` attribute is ignored
   for cross-origin URLs, so we fetch the file as a blob and download via an
   object URL (blob URLs count as same-origin, so `download` is honoured and
   no navigation/new tab happens). Falls back gracefully if the fetch is
   blocked (e.g. CORS not enabled on the host).
   NOTE: for the blob method to work cross-origin, the file's server must send
   `Access-Control-Allow-Origin` (e.g. * ) on the PDF response. */
const downloadFile = async (url, filename) => {
  const safeName = filename || "download.pdf";
  try {
    const res = await fetch(url, { mode: "cors", credentials: "omit" });
    if (!res.ok) throw new Error("HTTP " + res.status);
    const blob = await res.blob();
    const blobUrl = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = blobUrl;
    a.download = safeName;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    // Revoke after the download has had time to start.
    window.setTimeout(() => URL.revokeObjectURL(blobUrl), 5000);
    return true;
  } catch {
    // Fallback 1: direct anchor download (works when same-origin).
    try {
      const a = document.createElement("a");
      a.href = url;
      a.download = safeName;
      a.rel = "noopener";
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
    } catch {
      // Fallback 2: open in a new tab so the file is at least reachable.
      window.open(url, "_blank", "noopener");
    }
    return false;
  }
};

/* ---------- tiny inline icons ---------- */
const Arrow = ({ className = "" }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="M5 12h14M13 6l6 6-6 6" />
  </svg>
);
const Check = ({ className = "" }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="20 6 9 17 4 12" />
  </svg>
);
const Lock = ({ className = "" }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <rect x="3" y="11" width="18" height="11" rx="2" /><path d="M7 11V7a5 5 0 0 1 10 0v4" />
  </svg>
);

/* A yellow shine CTA that simply scrolls to the form. */
const CtaScroll = ({ size = "lg", children, onClick }) => (
  <button type="button" className={`cta-yellow ${size === "lg" ? "cta-lg" : size === "sm" ? "cta-sm" : ""}`} onClick={onClick}>
    {children}
    <Arrow />
  </button>
);

/* ---------- static content ---------- */
const FEATURES = [
  { h: "47 Indian Companies", sub: "One page per company. HDFC. Infosys. Reliance. Wipro. ITC. TCS. L&T. And 40 others most families assume are worthless.", icon: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="18" height="18" rx="2" /><line x1="3" y1="9" x2="21" y2="9" /><line x1="9" y1="3" x2="9" y2="21" /></svg> },
  { h: "Real Recovery Math", sub: "Every bonus issue. Every stock split. Every demerger. Cumulative multipliers calculated from 1985 to 2026 BSE and NSE corporate action data.", icon: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="1" x2="12" y2="23" /><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" /></svg> },
  { h: "Documents By Case Type", sub: "Original holder alive. Transmission case. Name mismatch. Missing certificate. Exact document list per scenario per company.", icon: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" /><polyline points="14 2 14 8 20 8" /><line x1="9" y1="15" x2="15" y2="15" /></svg> },
  { h: "72-Hour Free Valuation", sub: "After reading the report, send photos of your certificates. Written valuation back on your WhatsApp inside 72 hours. Free.", icon: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10" /><polyline points="12 6 12 12 16 14" /></svg> },
  { h: "The 4-Question Tree", sub: "A decision tree that sorts your certificates into three buckets. Pursue now. Pursue soon. Leave alone. Saves families months of wasted effort.", icon: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round"><path d="M9 11l3 3 8-8" /><path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11" /></svg> },
  { h: "No Cost To You", sub: "Report free. 72-hour valuation free. Originals stay in your safe until you sign an agreement. No surprise sales calls.", icon: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round"><path d="M12 2 4 5v6c0 5 3.5 8 8 9 4.5-1 8-4 8-9V5l-8-3z" /><polyline points="9 12 11 14 15 10" /></svg> },
];

const T3 = [
  {
    image: rajeshImg,
    name: "Rajesh Mehta",
    meta: "Surat · Recovered Feb 2025",
    body: (
      <>
        My father bought 100 shares of Infosys in 1993. He passed in 2017 and we
        did not know they existed until 2024. The recovery came to{" "}
        <strong>far more than I had ever imagined.</strong> The team handled the
        legal heir process without us chasing a single RTA.
      </>
    ),
  },
  {
    image: anjaliImg,
    name: "Anjali Shah",
    meta: "Ahmedabad · Recovered Nov 2024",
    body: (
      <>
        We almost threw away a 1991 LIC envelope when we cleaned out my father's
        room. Inside were 14 certificates.{" "}
        <strong>Some were genuinely worth ₹41 lakh.</strong> Some were worth less
        than the cost of recovery. ClearClaim told us honestly which to pursue.
      </>
    ),
  },
  {
    image: deepakImg,
    name: "Deepak Kulkarni",
    meta: "Pune · NRI · Recovered Dec 2025",
    body: (
      <>
        I live in Dubai. My father held 40 Wipro shares from 1989. After
        cumulative bonuses the holding had become substantial.{" "}
        <strong>The entire process was handled over WhatsApp.</strong> I never
        had to fly to India to chase paperwork.
      </>
    ),
  },
];

const STACK = [
  { n: "01", h: "Find Every Certificate In Your Family's Possession", p: <>Steel almirahs, bank lockers, the puja room cabinet, parents' or grandparents' document boxes. Check every envelope marked with a company name and the words 'share certificate' or 'equity'. Indian families typically store these in three predictable places.</> },
  { n: "02", h: "Match Against The 47 Companies In This Report", p: <>Pages 5 to 31 are organised alphabetically. Find your company. Read the entry. Look at the 2026 value column. Companies that have changed names (TISCO is now Tata Steel, Hero Honda is now Hero MotoCorp) are cross-listed.</> },
  { n: "03", h: "Run The 4-Question Decision Tree", p: <><strong>Is the company on the list?</strong> <strong>Is the original holder alive?</strong> <strong>Do you have the original certificate?</strong> <strong>Does the holder name match current government IDs?</strong> Four answers sort every certificate into Pursue Now, Pursue Soon, or Leave Alone.</> },
  { n: "04", h: "Send Photos For The Free 72-Hour Valuation", p: <>WhatsApp us photos of every certificate worth pursuing. We return a written valuation report inside 72 hours, including approximate market value, dividend backlog estimate, and recovery timeline. Free. No commitment.</> },
];

const STEPS = [
  { n: "1", h: "Download the free 31-page report", p: "Find your specific companies. See approximate 2026 values. Run the 4-question decision tree on each certificate you hold." },
  { n: "2", h: "Send photos for the 72-hour free valuation", p: "A written valuation comes back on your WhatsApp inside 72 hours, with exact recoverable value and timeline for your specific case." },
  { n: "3", h: "We handle the rest, start to finish", p: "RTA filings. Transmission paperwork. IEPF claims. Dividend backlog recovery. Dematerialisation. You sign three documents. We do the work." },
];

const T4 = [
  {
    image: nirajImg,
    name: "Niraj Jha",
    meta: "Mumbai · Apr 2025",
    body: (
      <>
        850 Reliance shares from the 1980s, plus the Jio Financial demerger from
        2023. Team accounted for both.{" "}
        <strong>Fixed fee. No percentage cut.</strong> I waited 13 years to act
        and regret every one of them.
      </>
    ),
  },
  {
    image: rohitImg,
    name: "Rohit Gupta",
    meta: "Gurugram · Nov 2025",
    body: (
      <>
        Inherited 240 HDFC Limited shares from 1992.{" "}
        <strong>The 2023 merger conversion was handled cleanly</strong> by the
        team. We received both the share credit and dividend backlog. 22-week
        timeline as promised.
      </>
    ),
  },
  {
    image: priyaImg,
    name: "Priya Malhotra",
    meta: "Dubai (NRI) · Feb 2026",
    body: (
      <>
        67 Asian Paints shares from 1989 that nobody in the family knew about.
        After bonuses and the 2013 split, the recovery was{" "}
        <strong>life-changing for my mother and sister.</strong> Took 16 weeks.
      </>
    ),
  },
  {
    image: vikramImg,
    name: "Vikram Patel",
    meta: "United Kingdom (NRI) · Jan 2026",
    body: (
      <>
        My grandfather bought TISCO shares in the 1970s. Certificate said
        "Tata Iron & Steel Company".{" "}
        <strong>The team handled the name-change verification</strong> and the
        cumulative bonus accounting. Cleanest process.
      </>
    ),
  },
];

/* shared layout helpers (Tailwind) */
const WRAP = "max-w-[1180px] mx-auto px-[18px] md:px-6";
const SEC = "py-[42px] md:py-14 lg:py-20";
const SEC_EYEBROW = "mono block text-center text-[11.5px] tracking-[0.20em] text-[#00BE5E] mb-[10px] md:mb-[14px]";
const SEC_H2 = "text-center font-extrabold leading-[1.08] tracking-[-0.02em] text-[#00301A] max-w-[820px] mx-auto mb-3 md:mb-4 text-[clamp(30px,4vw,44px)]";
const SEC_SUB = "text-center text-[16px] md:text-[18px] text-[#5F6E66] leading-[1.6] max-w-[720px] mx-auto mb-6 md:mb-11";
const CARD = "bg-white rounded-[14px] border border-[#D8E5DC] shadow-[0_1px_2px_rgba(0,88,44,0.06),0_2px_6px_rgba(0,88,44,0.04)]";

const ClearClaimLanding = ({ onComplete }) => {
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const rootRef = useRef(null);

  const emailValid = useMemo(
    () => EMAIL_REGEX.test(email.trim()) && email.trim().length >= 6,
    [email]
  );
  // EXACTLY 10 digits. Fewer or more than 10 is invalid. No country code.
  const phoneValid = useMemo(() => phone.replace(/\D/g, "").length === 10, [phone]);
  const ready = emailValid && phoneValid;

  /* Load the Wistia player + embed scripts once, when this page mounts.
     (Hooks must live INSIDE the component body — this was the cause of the
     "Invalid hook call" crash when it sat at module top level.) */
  useEffect(() => {
    const playerScript = document.createElement("script");
    playerScript.src = "https://fast.wistia.com/player.js";
    playerScript.async = true;

    const embedScript = document.createElement("script");
    embedScript.src = "https://fast.wistia.com/embed/s242w29jyn.js";
    embedScript.async = true;
    embedScript.type = "module";

    document.body.appendChild(playerScript);
    document.body.appendChild(embedScript);

    return () => {
      // Guard removal: the node may already be gone on fast unmounts.
      if (playerScript.parentNode) playerScript.parentNode.removeChild(playerScript);
      if (embedScript.parentNode) embedScript.parentNode.removeChild(embedScript);
    };
  }, []);

  /* scroll-reveal, scoped to this component */
  useEffect(() => {
    const root = rootRef.current;
    if (!root) return;
    const els = root.querySelectorAll(".reveal");
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible");
            io.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.1, rootMargin: "0px 0px -40px 0px" }
    );
    els.forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, []);

  const scrollToForm = () => {
    document.getElementById("final-cta")?.scrollIntoView({ behavior: "smooth" });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!ready) return;

    const lead = {
      email: email.trim(),
      whatsapp: phone.trim(),
      source: "clearclaim_longform_landing_react",
      edition: "edition_01",
      report: "forgotten_crorepati",
      submitted_at: new Date().toISOString(),
      user_agent: navigator.userAgent.slice(0, 200),
    };

    // Optional fire-and-forget capture.
    if (CONFIG.WEBHOOK_URL) {
      try {
        fetch(CONFIG.WEBHOOK_URL, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(lead),
          mode: "no-cors",
          keepalive: true,
        }).catch(() => {});
      } catch {
        /* ignore */
      }
    }

    setSubmitted(true);

    // Download the report, then advance the funnel IN-APP: optin -> landing.
    // No window.location redirect — App swaps to the full landing page via
    // onComplete(), which then opens the TidyCal booking popup (prefilled).
    downloadFile(CONFIG.PDF_URL, CONFIG.PDF_FILENAME);

    // Small delay lets the download start before we swap views.
    window.setTimeout(() => {
      onComplete?.(lead);
    }, 1200);
  };

  return (
    <div ref={rootRef} className="cc-landing">
      {/* ============ NAV ============ */}
      <nav className="sticky top-0 z-[100] bg-[rgba(250,250,247,0.94)] backdrop-blur-[12px] border-b border-[#D8E5DC] py-[14px]">
        <div className="max-w-[1280px] mx-auto px-[18px] md:px-7 flex items-center justify-between gap-4">
          <a href="#" className="inline-flex items-center gap-[10px]">
            <img src={CONFIG.LOGO_URL} alt="ClearClaim" className="h-9 md:h-10 w-auto" />
          </a>
          <CtaScroll size="sm" onClick={scrollToForm}>Get The Free Report</CtaScroll>
        </div>
      </nav>

      {/* ============ HERO ============ */}
      <section className="cc-hero-bg relative overflow-hidden text-center pt-[26px] pb-[38px] md:pt-16 md:pb-20">
        <div className={WRAP}>
          <div className="reveal">
            <span className="inline-flex items-center gap-[9px] px-[19px] py-[9px] bg-[#FEF0EF] text-[#C42018] border border-[#F6C6C1] rounded-full mb-6 shadow-[0_1px_2px_rgba(196,32,24,0.08),0_4px_14px_rgba(196,32,24,0.10)]">
              <span className="hero-eyebrow-dot" />
              <span className="mono text-[#C42018]">Free Report For Indian Families Holding Old Share Certificates</span>
            </span>
            <h1 className="font-extrabold leading-[1.04] tracking-[-0.025em] text-[#00301A] max-w-[920px] mx-auto mb-[22px] text-[clamp(36px,5vw,60px)]">
              Find out what your family's <span className="serif-i text-[#008B45] text-[1.05em]">forgotten</span> share certificates are worth in 2026, before you spend a single rupee.
            </h1>
            <p className="text-[19px] text-[#5F6E66] leading-[1.55] max-w-[720px] mx-auto mb-8">
              A free 31-page report with real recovery math for <strong className="text-[#0F1F14] font-bold">47 Indian companies</strong>. HDFC. Infosys. Reliance. Wipro. ITC. TCS. L&amp;T. And 40 others most Indian families assume are worthless.
            </p>
            <CtaScroll size="lg" onClick={scrollToForm}>Get The Free Report</CtaScroll>
            <p className="text-center text-[14px] text-[#5F6E66] mt-[18px]"><strong className="text-[#1F3027] font-bold">No credit card.</strong> No spam. PDF delivered in under 5 minutes.</p>
          </div>

<div className="vsl-wrap reveal delay-2 max-w-[940px] mx-auto mt-[26px] md:mt-12">
  <div className="relative aspect-video overflow-hidden rounded-[20px]">
    <iframe
      src="https://fast.wistia.net/embed/iframe/s242w29jyn"
      title="ClearClaim Video"
      allow="autoplay; fullscreen"
      allowFullScreen
      className="absolute inset-0 w-full h-full"
    />
  </div>
</div>
        </div>
      </section>

      {/* ============ TRUST STRIP ============ */}
      <div className="bg-white border-y border-[#D8E5DC] py-[15px] md:py-6">
        <div className={WRAP}>
          <div className="flex items-center justify-center gap-[14px] flex-wrap text-[16px] text-[#1F3027]">
            <span className="text-[#F4B400] text-[18px] tracking-[1.5px]">★★★★★</span>
            <span>See why <strong className="text-[#0F1F14] font-extrabold">1,250+ Indian families</strong> trust ClearClaim with their recovery</span>
            <span className="text-[#95A39B]">·</span>
            <span><strong className="text-[#0F1F14] font-extrabold">₹150 Cr</strong> recovered</span>
            <span className="text-[#95A39B]">·</span>
            <span><strong className="text-[#0F1F14] font-extrabold">98.4%</strong> case completion</span>
          </div>
        </div>
      </div>

      {/* ============ 3-UP TESTIMONIALS ============ */}
      <section className={SEC + " bg-[#FAFAF7]"}>
        <div className={WRAP}>
          <div className="reveal">
            <span className={SEC_EYEBROW}>Why Indian Families Trust Us</span>
            <h2 className={SEC_H2}>Real families. Real <span className="serif-i text-[#008B45]">recovered</span> wealth.</h2>
          </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-[14px] md:gap-[22px] mt-[18px] md:mt-7">
  {T3.map((t, i) => (
    <div
      key={t.name}
      className={`${CARD} reveal delay-${i + 1} p-5 md:p-[26px]`}
    >
      <div className="text-[#F4B400] mb-3 text-[14px] tracking-[1.5px]">
        ★★★★★
      </div>

      <p className="text-[15.5px] text-[#1F3027] leading-[1.6] mb-[18px] [&_strong]:text-[#00582C] [&_strong]:font-bold">
        {t.body}
      </p>

      <div className="flex items-center gap-3 pt-[14px] border-t border-[#D8E5DC]">
        <img
          src={t.image}
          alt={t.name}
          className="w-12 h-12 rounded-full object-cover border-2 border-[#D8E5DC] shrink-0"
        />

        <div>
          <div className="font-bold text-[#0F1F14] text-[14.5px]">
            {t.name}
          </div>
          <div className="text-[12.5px] text-[#5F6E66]">
            {t.meta}
          </div>
        </div>
      </div>
    </div>
  ))}
</div>
        </div>
      </section>

      {/* ============ 6-FEATURE GRID ============ */}
      <section className={SEC + " bg-[#F2FCF6]"}>
        <div className={WRAP}>
          <div className="reveal">
            <span className={SEC_EYEBROW}>What's Inside The Report</span>
            <h2 className={SEC_H2}>Six things that make this report <span className="serif-i text-[#008B45]">different</span>.</h2>
            <p className={SEC_SUB}>Not a generic IEPF guide. Not a definition of dematerialisation. A company-by-company valuation reference you can match against the paper in your hand.</p>
          </div>
          <div className="reveal delay-1 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-[4px] bg-[#D8E5DC] rounded-[18px] overflow-hidden border border-[#D8E5DC] shadow-[0_4px_12px_rgba(0,88,44,0.08),0_12px_28px_rgba(0,88,44,0.06)]">
            {FEATURES.map((f) => (
              <div key={f.h} className="bg-white px-[26px] py-8 text-center flex flex-col items-center gap-3">
                <div className="feature-icon">{f.icon}</div>
                <div className="text-[17px] font-extrabold text-[#00301A] tracking-[-0.01em]">{f.h}</div>
                <div className="text-[13.5px] text-[#5F6E66] leading-[1.55]">{f.sub}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ============ SPLIT 1 ============ */}
      <section className={SEC + " bg-white"}>
        <div className={WRAP}>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-[26px] lg:gap-16 items-center">
            <div className="reveal">
              <span className="mono block text-left text-[11.5px] tracking-[0.20em] text-[#00BE5E] mb-[10px]">Step 1 · Find What You Hold</span>
              <h2 className="font-extrabold leading-[1.1] tracking-[-0.02em] text-[#00301A] mb-[18px] text-[clamp(28px,3.6vw,40px)]">Find out what your family's <span className="serif-i text-[#008B45]">forgotten</span> shares are worth.</h2>
              <p className="text-[16.5px] text-[#5F6E66] leading-[1.65] mb-[14px]">Most Indian families keep 12 to 14 paper share certificates somewhere in the house and have no idea what they are worth. Steel almirahs. Bank lockers. Plastic file folders. The puja room cabinet.</p>
              <p className="text-[16.5px] text-[#5F6E66] leading-[1.65] mb-[14px]">Look up your company in the report. Read one page. See the cumulative bonus history, the corporate action timeline, and the approximate 2026 value per original 1985 to 1995 share.</p>
              <p className="text-[16.5px] text-[#5F6E66] leading-[1.65] mb-[14px]"><strong className="text-[#0F1F14] font-bold">If you do not know what the paper is worth, you cannot make a decision about it.</strong> This report gives you the number.</p>
            </div>
            <div className="reveal delay-1">
              <div className="split-illu">
                <div className="illu-watermark">Sample · Page 12 of 31</div>
                <div className="illu-eyebrow">Company 05 of 47</div>
                <div className="illu-h">Infosys Limited</div>
                <div className="illu-tag">Listed 14 June 1993 at ₹95.</div>
                <div className="illu-stats">
                  {[["Listed Since", "14 June 1993"], ["IPO Price", "₹95 per share"], ["Bonus Issues", "1994. 1997. 1999. 2004. 2006. 2014. 2015. 2018."], ["Stock Splits", "2:1 in 1999"], ["Recovery Time", "9 to 15 weeks"], ["Required Docs", "8 items. Listed in full."]].map(([l, v]) => (
                    <div className="illu-stat" key={l}>
                      <div className="illu-stat-label">{l}</div>
                      <div className="illu-stat-value">{v}</div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ============ STACKED CARDS ============ */}
      <section className={SEC + " bg-[#F2FCF6]"}>
        <div className={WRAP}>
          <div className="reveal">
            <span className={SEC_EYEBROW}>Recovery Has Never Been This Easy</span>
            <h2 className={SEC_H2}>From <span className="serif-i text-[#008B45]">forgotten</span> paper to family wealth in 4 steps.</h2>
            <p className={SEC_SUB}>Most do-it-yourself recoveries stall on step 5 of 9. We handle the steps families cannot.</p>
          </div>
          <div className="max-w-[820px] mx-auto flex flex-col gap-3 md:gap-4">
            {STACK.map((s, i) => (
              <div key={s.n} className={`${CARD} reveal delay-${i + 1} flex gap-[22px] items-start px-7 py-[26px]`}>
                <div className="stack-num">{s.n}</div>
                <div>
                  <div className="text-[19px] font-extrabold text-[#00301A] mb-[6px] tracking-[-0.01em]">{s.h}</div>
                  <p className="text-[15.5px] text-[#5F6E66] leading-[1.6] [&_strong]:text-[#0F1F14] [&_strong]:font-bold">{s.p}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ============ CTA BLOCK ============ */}
      <div className="text-center py-[30px] md:py-0">
        <CtaScroll size="lg" onClick={scrollToForm}>Get The Free Report</CtaScroll>
        <p className="text-center text-[14px] text-[#5F6E66] mt-4"><strong className="text-[#1F3027] font-bold">Free. Forever.</strong> Delivered to your email and WhatsApp in 5 minutes.</p>
      </div>

      {/* ============ SPLIT 2 (reversed) ============ */}
      <section className={SEC + " bg-[#F2FCF6]"}>
        <div className={WRAP}>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-[26px] lg:gap-16 items-center">
            <div className="reveal delay-1 order-2 lg:order-1">
              <div className="cert-illu">
                <div className="cert-corner tl" /><div className="cert-corner tr" />
                <div className="cert-corner bl" /><div className="cert-corner br" />
                <div className="flex justify-between mono !text-[10.5px] !tracking-[0.08em] !normal-case text-[#5F6E66] !font-medium">
                  <span>No. 0427831</span><span>Folio. C-0427</span>
                </div>
                <div className="cert-company">Infosys Technologies Limited</div>
                <div className="cert-sub">REGISTERED OFFICE · BANGALORE · INDIA</div>
                <div className="cert-body">
                  This is to certify that <em>Shri V. K. Krishnan</em> of Bengaluru is the registered holder of <em>One Hundred (100) Equity Shares</em> of Rs. 10 each, subject to the Memorandum and Articles of Association of the Company.
                </div>
                <div className="cert-row"><span>14·06·1993</span><span>Issued at Bangalore</span></div>
                <div className="cert-stamp">In your<br />safe</div>
              </div>
            </div>
            <div className="reveal order-1 lg:order-2">
              <span className="mono block text-left text-[11.5px] tracking-[0.20em] text-[#00BE5E] mb-[10px]">Originals Stay In Your Safe</span>
              <h2 className="font-extrabold leading-[1.1] tracking-[-0.02em] text-[#00301A] mb-[18px] text-[clamp(28px,3.6vw,40px)]">Your certificates never <span className="serif-i text-[#008B45]">leave</span> your possession.</h2>
              <p className="text-[16.5px] text-[#5F6E66] leading-[1.65] mb-[14px]">We work from certified photocopies for the entire valuation phase. Your physical certificates stay locked in your home or bank locker until a signed agreement is in place.</p>
              <p className="text-[16.5px] text-[#5F6E66] leading-[1.65] mb-[14px]">When the recovery work actually begins, we receive your originals via secure courier with insurance, store them in a fire-proof secure room in our Bengaluru office, and return them with the recovery summary at the end.</p>
              <p className="text-[16.5px] text-[#5F6E66] leading-[1.65] mb-[14px]"><strong className="text-[#0F1F14] font-bold">Most families never need to hand over the originals at all.</strong> The 72-hour free valuation works entirely from photos.</p>
            </div>
          </div>
        </div>
      </section>

      {/* ============ TEAM ============ */}
      <section className={SEC + " bg-white"}>
        <div className={WRAP}>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-[26px] lg:gap-16 items-center">
            <div className="reveal">
              <span className="mono block text-left text-[11.5px] tracking-[0.20em] text-[#00BE5E] mb-[10px]">Made For Indian Families, By Indian Specialists</span>
              <h2 className="font-extrabold leading-[1.1] tracking-[-0.02em] text-[#00301A] mb-[18px] text-[clamp(28px,3.6vw,40px)]">A specialist team in Bengaluru. <span className="serif-i text-[#008B45]">Not a generalist lawyer in another city.</span></h2>
              <p className="text-[16.5px] text-[#5F6E66] leading-[1.65] mb-[14px]">ClearClaim is a 22-person recovery team that does one job: helping Indian families find and recover forgotten share certificates. Average team experience: 7 years in RTA work, IEPF claims, and securities recovery.</p>
              <p className="text-[16.5px] text-[#5F6E66] leading-[1.65] mb-[14px]">We have served 1,250+ families across India and the diaspora. We have recovered ₹150 crore in family wealth that would otherwise have been written off as lost paper.</p>
              <p className="text-[16.5px] text-[#5F6E66] leading-[1.65] mb-[14px]"><strong className="text-[#0F1F14] font-bold">Every case is run by the same specialist from start to finish.</strong> One point of contact. One WhatsApp thread. One phone call when you need it. No handoffs.</p>
            </div>
            <div className="reveal delay-1 flex flex-col gap-4">
              {[
                { i: "BS", name: "B. S. (Lead Specialist)", role: "9 yrs · RTA + IEPF + Transmission", b: ["184 families served", "₹26 Cr personally recovered", "Speaks Tamil, Hindi, Kannada"] },
                { i: "PR", name: "P. R. (Senior Specialist)", role: "7 yrs · NRI cases + Succession", b: ["140 NRI cases handled", "Specialist in transmission", "Speaks Hindi, Gujarati, English"] },
              ].map((m) => (
                <div key={m.i} className={`${CARD} flex gap-4 items-center p-[22px]`}>
                  <div className="w-14 h-14 rounded-full text-white flex items-center justify-center font-extrabold text-[18px] shrink-0 bg-[linear-gradient(135deg,#00BE5E_0%,#00582C_100%)]">{m.i}</div>
                  <div>
                    <div className="font-extrabold text-[#0F1F14] text-[16px] mb-1">{m.name}</div>
                    <div className="text-[13px] text-[#008B45] font-semibold mb-2">{m.role}</div>
                    <ul className="team-bullets">{m.b.map((x) => <li key={x}>{x}</li>)}</ul>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ============ CTA BLOCK 2 ============ */}
      <div className="text-center py-[30px] md:py-14 bg-[#F2FCF6]">
        <CtaScroll size="lg" onClick={scrollToForm}>Get The Free Report</CtaScroll>
        <p className="text-center text-[14px] text-[#5F6E66] mt-4"><strong className="text-[#1F3027] font-bold">31 pages.</strong> 47 companies. Real recovery math. Free.</p>
      </div>

      {/* ============ DARK 3 STEPS ============ */}
      <section className="steps-section py-[46px] md:py-[88px]">
        <div className={WRAP + " relative"}>
          <div className="reveal">
            <span className="mono block text-center text-[11.5px] tracking-[0.20em] text-[#6EE7A8] mb-[10px] md:mb-[14px]">From Forgotten Paper To Recovered Wealth</span>
            <h2 className="text-center font-extrabold leading-[1.08] tracking-[-0.02em] text-white max-w-[820px] mx-auto mb-3 md:mb-4 text-[clamp(30px,4vw,44px)]">In <span className="serif-i text-[#6EE7A8]">three</span> simple steps.</h2>
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-[14px] md:gap-6 max-w-[1040px] mx-auto mt-6 md:mt-10">
            {STEPS.map((s, i) => (
              <div key={s.n} className={`step-card reveal delay-${i + 1}`}>
                <div className="step-num">{s.n}</div>
                <div className="text-[21px] font-extrabold text-white mb-[10px] tracking-[-0.01em]">{s.h}</div>
                <p className="text-[15px] text-[#B6D2C0] leading-[1.6]">{s.p}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ============ GUARANTEE ============ */}
      <section className={SEC + " bg-[#FAFAF7]"}>
        <div className={WRAP}>
          <div className="reveal text-center max-w-[760px] mx-auto">
            <div className="guarantee-badge">
              <span className="guarantee-badge-line1">No</span>
              <span className="guarantee-badge-line2">Strings</span>
              <span className="guarantee-badge-line3">Promise</span>
            </div>
            <h2 className="font-extrabold leading-[1.12] tracking-[-0.02em] text-[#00301A] mb-4 text-[clamp(28px,4vw,40px)]">The report is free. The valuation is free. <span className="serif-i text-[#008B45]">No surprise sales calls.</span></h2>
            <p className="text-[17px] text-[#5F6E66] leading-[1.6] max-w-[600px] mx-auto mb-[14px]">We compiled this report because Indian families kept asking us the same questions. Sending it to anyone who asks is faster than answering one family at a time.</p>
            <p className="text-[17px] text-[#5F6E66] leading-[1.6] max-w-[600px] mx-auto mb-[30px]"><strong className="text-[#0F1F14] font-bold">If you read the report and decide ClearClaim is not for you, that is fine.</strong> The information is useful regardless of whether you ever speak to us. We do not chase. We never share your details. Unsubscribe whenever.</p>
            <CtaScroll size="lg" onClick={scrollToForm}>Get The Free Report</CtaScroll>
          </div>
        </div>
      </section>

      {/* ============ 4-UP TESTIMONIALS ============ */}
      <section className={SEC + " bg-[#F2FCF6]"}>
        <div className={WRAP}>
          <div className="reveal">
            <span className={SEC_EYEBROW}>More Families. More Recoveries.</span>
            <h2 className={SEC_H2}>Hear why Indian families <span className="serif-i text-[#008B45]">recommend</span> ClearClaim.</h2>
          </div>
     <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-[14px] md:gap-[18px] mt-[18px] md:mt-7">
  {T4.map((t, i) => (
    <div
      key={t.name}
      className={`${CARD} reveal delay-${i + 1} flex flex-col p-[22px]`}
    >
      <div className="text-[#F4B400] text-[13px] tracking-[1.5px] mb-[10px]">
        ★★★★★
      </div>

      <p className="text-[14px] text-[#1F3027] leading-[1.6] mb-4 flex-1 [&_strong]:text-[#00582C] [&_strong]:font-bold">
        {t.body}
      </p>

      <div className="flex items-center gap-[10px] pt-3 border-t border-[#D8E5DC]">
        <img
          src={t.image}
          alt={t.name}
          className="w-[42px] h-[42px] rounded-full object-cover border-2 border-[#D8E5DC] shrink-0"
        />

        <div>
          <div className="font-bold text-[#0F1F14] text-[13px]">
            {t.name}
          </div>
          <div className="text-[11.5px] text-[#5F6E66]">
            {t.meta}
          </div>
        </div>
      </div>
    </div>
  ))}
</div>
        </div>
      </section>

      {/* ============ FINAL FORM (GATED) ============ */}
      <section className="final-cta py-[48px] md:py-20" id="final-cta">
        <div className={WRAP + " relative"}>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-[26px] lg:gap-14 items-center">
            {/* copy */}
            <div className="reveal">
              <span className="mono block text-left text-[11.5px] tracking-[0.20em] text-[#6EE7A8] mb-3">Free 31-Page Report · Edition 01</span>
              <h2 className="font-extrabold leading-[1.08] tracking-[-0.02em] mb-[18px] text-[clamp(32px,4vw,46px)]">Begin your free <span className="serif-i text-[#6EE7A8]">forgotten certificate</span> valuation today.</h2>
              <p className="text-[17.5px] text-[#B6D2C0] leading-[1.6] mb-6">31 pages. 47 Indian companies. Real recovery math. Delivered to your email and WhatsApp in 5 minutes.</p>
              <ul className="list-none flex flex-col gap-[10px]">
                {[
                  "Free 31-page report covering 47 Indian companies",
                  "Followed by a 72-hour free valuation on your specific certificates",
                  "No credit card. No spam. No surprise sales calls. Ever.",
                ].map((line) => (
                  <li key={line} className="flex gap-3 items-start text-[#DBE8E0] text-[15px]">
                    <Check className="w-5 h-5 shrink-0 mt-[1px] text-[#6EE7A8]" />
                    <span>{line}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* gate card */}
            <div className="reveal delay-2">
              <form
                onSubmit={handleSubmit}
                noValidate
                className="bg-white rounded-[16px] p-7 shadow-[0_12px_28px_rgba(0,88,44,0.12),0_24px_60px_rgba(0,88,44,0.10)] text-[#0F1F14]"
              >
                {!submitted ? (
                  <div>
                    <div className="mono flex items-center gap-2 !text-[11px] !tracking-[0.18em] text-[#008B45] mb-1">
                      <Lock className="w-[14px] h-[14px]" />
                      Two fields. Then the download is yours.
                    </div>
                    <p className="text-[14px] text-[#5F6E66] mb-[18px]">Both fields must be valid to activate the button.</p>

                    {/* Email */}
                    <div className={`field mb-[14px] ${emailValid ? "valid" : ""}`}>
                      <label htmlFor="cc-email" className="block text-[13px] font-bold text-[#1F3027] mb-[6px]">Your email</label>
                      <input
                        type="email"
                        id="cc-email"
                        name="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="ramesh@example.com"
                        autoComplete="email"
                        required
                      />
                      <span className="field-check"><Check className="stroke-white" /></span>
                    </div>

                    {/* WhatsApp — exactly 10 digits, non-digits blocked on input */}
                    <div className={`field mb-[14px] ${phoneValid ? "valid" : ""}`}>
                      <label htmlFor="cc-phone" className="block text-[13px] font-bold text-[#1F3027] mb-[6px]">Your WhatsApp number</label>
                      <input
                        type="tel"
                        id="cc-phone"
                        name="whatsapp"
                        value={phone}
                        onChange={(e) => setPhone(e.target.value.replace(/\D/g, "").slice(0, 10))}
                        onKeyPress={(e) => { if (!/[0-9]/.test(e.key)) e.preventDefault(); }}
                        placeholder="9876543210"
                        autoComplete="tel"
                        inputMode="numeric"
                        pattern="\d{10}"
                        maxLength={10}
                        required
                      />
                      <span className="field-check"><Check className="stroke-white" /></span>
                    </div>

                    <button type="submit" className={`unlock-btn ${ready ? "unlocked" : ""}`} disabled={!ready}>
                      <Lock className="lock" />
                      <span>{ready ? "Download The Free Report" : "Fill both fields to continue"}</span>
                      <Arrow className="arrow" />
                    </button>

                    <p className="text-[12px] text-[#5F6E66] mt-[14px] text-center leading-[1.55]">
                      <strong className="text-[#1F3027] font-bold">No spam. No surprise sales calls.</strong> Unsubscribe anytime. We never share your information with third parties.
                    </p>
                  </div>
                ) : (
                  <div className="text-center py-2">
                    <div className="success-icon"><Check /></div>
                    <div className="text-[22px] font-extrabold text-[#00582C] mb-2">Report on its way.</div>
                    <p className="text-[15px] text-[#5F6E66] leading-[1.6] mb-5">A copy is being sent to your email and WhatsApp right now. If the download doesn't start, click below.</p>
                    <a
                      className="success-download"
                      href={CONFIG.PDF_URL}
                      download={CONFIG.PDF_FILENAME}
                      rel="noopener"
                      onClick={(e) => { e.preventDefault(); downloadFile(CONFIG.PDF_URL, CONFIG.PDF_FILENAME); }}
                    >
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" /><polyline points="7 10 12 15 17 10" /><line x1="12" y1="15" x2="12" y2="3" /></svg>
                      Download The Report (PDF)
                    </a>
                  </div>
                )}
              </form>
            </div>
          </div>
        </div>
      </section>

      {/* ============ FOOTER ============ */}
      <footer className="bg-[#00301A] text-[#95A39B] pt-9 pb-7 text-center text-[13px] border-t border-white/[0.06]">
        <div className={WRAP}>
          <img src={CONFIG.LOGO_URL} alt="ClearClaim" className="w-auto h-10 mx-auto mb-5 opacity-95" />
          <div className="flex justify-center gap-6 mb-2 flex-wrap">
            <span><strong className="text-white font-bold">Recovery Specialists for Indian Families</strong></span>
            <span>support@clearclaim.in</span>
          </div>
          <div>
            Edition 01 · 2026 · Compiled in Bengaluru · Valuations are illustrative and based on publicly available BSE and NSE corporate action data.
          </div>
        </div>
      </footer>
    </div>
  );
};

export default ClearClaimLanding;
