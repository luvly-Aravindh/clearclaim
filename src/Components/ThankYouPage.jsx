import { useState, useEffect } from "react";

// ─── DATA ───────────────────────────────────────────────────────────────────
const TICKER_ITEMS = [
  "1,250+ Clients Served",
  "150+ Crore Identified & Recovered",
  "Fixed Fees Only. No Percentage Cuts",
  "Refund Assurance",
  "Registered Entity with GSTIN",
  "25-Person In-House Team",
  "One Office. No Subcontracting",
  "IEPF Claims & Physical to Demat",
  "Legal Heir Cases & NRI Recovery",
  "No India Travel Required for NRIs",
  "Agreement Before Documents Move",
  "4 Years. 2,500+ Claims Processed",
];

const TIMELINE = [
  {
    label: "Right Now",
    heading: "Confirmation Sent.",
    body: "WhatsApp message and email with your call time, how to join, and a short note on what to keep handy. Check spam if it's not there in 5 minutes.",
  },
  {
    label: "24 Hours Before",
    heading: "Reminder Message.",
    body: "A WhatsApp reminder goes out the evening before. You'll get a short form asking about your certificates so the team can review before the call.",
  },
  {
    label: "On the Call",
    heading: "Your Valuation.",
    body: "30 minutes. We identify the companies, estimate current market value, and tell you the claim type: IEPF, physical to demat, legal heir, or otherwise.",
  },
  {
    label: "After the Call",
    heading: "Written Quote.",
    body: "If your case is recoverable, you get a fixed-fee quote in writing. Nothing moves until you agree. No original documents leave your hands before a signed agreement is in place.",
  },
];

const PREP_ITEMS = [
  {
    n: "01",
    title: "Find your certificates.",
    body: "Physical certificates, old passbooks, dividend warrants — anything with a company name on it. Even one is enough. Don't worry if it's faded or partially illegible.",
    hint: "Check old files, lockers, or stored documents",
  },
  {
    n: "02",
    title: "Write down the company names.",
    body: "Note the names printed on the certificates. Don't try to look them up first. Bring the name as-is. We trace company mergers and name changes on the call.",
    hint: "Faded text? A phone photo under good light works",
  },
  {
    n: "03",
    title: "Know the rough time period.",
    body: "Roughly when were the shares bought — 1980s, 90s, early 2000s? A decade is fine. No need for exact dates. The certificate print date is usually visible if you look closely.",
    hint: "Approximate decade is enough to start",
  },
  {
    n: "04",
    title: "Clarify whose name the shares are in.",
    body: "Your name, a parent's name, or a spouse's? If the original shareholder has passed, note whether there was a nomination registered with the company.",
    hint: "This determines direct claim vs. legal heir case",
  },
  {
    n: "05",
    title: "For NRIs: note your country of residence.",
    body: "This affects documentation requirements and the account type for demat credit. Nothing to prepare in advance — just knowing this on the call helps us give you accurate timelines.",
    hint: "No India travel required in most NRI cases",
  },
];

const CASE_STUDIES = [
  {
    type: "IEPF Claim",
    location: "Bengaluru, Karnataka",
    duration: "11 Months",
    amount: "₹9.2 Lakh",
    role: "IT Manager · Physical Certificates from the 1990s",
    story:
      "Suresh V. had paper certificates from the 1990s. The shares had already moved to IEPF by the time he contacted us. Every CA he consulted directed him elsewhere. On the free call, we identified the holdings, quoted ₹18,000 across three instalments, and filed the complete IEPF-5 process. Eleven months later, the shares were credited to his demat.",
    tags: ["IEPF Claim", "Physical Certificates", "Fixed Fee"],
  },
  {
    type: "NRI Recovery",
    location: "Austin, Texas — No India Trip",
    duration: "13 Months",
    amount: "₹14 Lakh",
    role: "Software Engineer · USA · Inherited Shares",
    story:
      "Ananya R. is based in the US and inherited shares she couldn't track or access from abroad. The entire process was handled through WhatsApp, video calls, and a limited Power of Attorney. FEMA compliance was confirmed before a single document moved. Shares were credited to her NRO demat account 13 months later. She did not travel to India.",
    tags: ["NRI Recovery", "FEMA Compliant", "NRO Demat Credit"],
  },
  {
    type: "Legal Heir Case",
    location: "Mumbai · Four Siblings · Three Cities",
    duration: "Completed",
    amount: "₹22 Lakh",
    role: "Operations Head · Shares Held Since Father's Passing",
    story:
      "Meera K. and three siblings were trying to recover shares after their father passed away. Different cities, no single point of coordination, and three years of inaction. We issued one consolidated checklist for all four, managed the full RTA process, and sent WhatsApp updates at every stage. Completed in full. Three years of waiting, done.",
    tags: ["Legal Heir", "Transmission", "Multi-Claimant"],
  },
];

const TRUST_TILES = [
  {
    label: "Registered Entity",
    heading: "ClearClaim Ventures Private Limited",
    body: "Verified GSTIN. Registered and operating from Pune, Maharashtra since 2021.",
  },
  {
    label: "Fixed Fee Policy",
    heading: "No Percentage Commission",
    body: "Your fee is based on case complexity, not on what your family recovers. Written and agreed upfront.",
  },
  {
    label: "Milestone Payments",
    heading: "Pay in Verified Stages",
    body: "Payments are tied to confirmed progress milestones. Not one bulk amount upfront. Not half-and-half.",
  },
  {
    label: "Outcome Assurance",
    heading: "Refund Policy in Writing",
    body: "Refund is applicable if recovery is not completed after the full process has been run on your case.",
  },
];

const NRI_POINTS = [
  {
    title: "No physical visits needed",
    body: "Every step — filings, RTA coordination, company correspondence — is handled from our Pune office on your behalf.",
  },
  {
    title: "FEMA compliance confirmed upfront",
    body: "We review FEMA requirements and NRO/NRE account eligibility on the free call, before any process begins.",
  },
  {
    title: "Limited PoA covers everything",
    body: "A limited Power of Attorney — couriered, signed, and returned — is sufficient for the full recovery process in most cases.",
  },
  {
    title: "WhatsApp updates throughout",
    body: "Regular status messages in plain language. No jargon, no chasing — you're informed at every stage that matters.",
  },
];

const NRI_COUNTRIES = ["USA", "United Kingdom", "UAE", "Australia", "Singapore", "Canada", "Germany", "New Zealand", "+ More"];

const PROOF_FIRST = ["Suresh","Meera","Ananya","Rajesh","Kavitha","Sanjay","Priya","Harish","Nandini","Kiran","Ramesh","Lakshmi","Vikram","Deepa","Anil","Sunita","Rohit","Neha","Srinivas","Padma","Arjun","Girish","Usha","Mohan","Rekha","Ganesh","Poornima","Balaji","Shanthi","Vivek","Madhavi","Rajan"];
const PROOF_LAST  = ["K.","M.","R.","S.","V.","N.","P.","B.","G.","A.","T.","L."];
const PROOF_CITIES = ["Bengaluru, KA","Mumbai, MH","Chennai, TN","Pune, MH","Hyderabad, TS","New Delhi, DL","Kochi, KL","Ahmedabad, GJ","Coimbatore, TN","Kolkata, WB","Austin, TX","San Jose, CA","Dubai, UAE","London, UK","Singapore, SG","Melbourne, AU","Toronto, ON","Sharjah, UAE","Manchester, UK","Mysuru, KA","Lucknow, UP","Nagpur, MH"];
const PROOF_ACTIONS = ["Just booked a free valuation call","Certificate identified — process started","IEPF claim submitted successfully","Legal heir documentation completed","Physical shares converted to demat","Free valuation call completed","NRI recovery handled without India visit","Shares credited to demat account"];
const PROOF_TIMES = ["2 min ago","4 min ago","6 min ago","9 min ago","14 min ago","18 min ago","23 min ago","31 min ago","38 min ago"];

function mulberry32(a) {
  return function () {
    a |= 0; a = a + 0x6D2B79F5 | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = t + Math.imul(t ^ (t >>> 7), 61 | t) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}
function weekSeed() {
  const d = new Date(), ys = new Date(d.getFullYear(), 0, 1);
  const doy = Math.floor((d - ys) / 86400000);
  return d.getFullYear() * 100 + Math.floor(doy / 7);
}

// ─── SUB-COMPONENTS ──────────────────────────────────────────────────────────

function Ticker() {
  const items = [...TICKER_ITEMS, ...TICKER_ITEMS];

  return (
    <div className="bg-[#166638] text-white py-[9px] overflow-hidden border-b-2 border-white/10">
      <style>{`
        @keyframes ticker-scroll {
          from { transform: translateX(0); }
          to { transform: translateX(-50%); }
        }
        .ticker-wrapper {
          display: flex;
          width: max-content;
          animation: ticker-scroll 55s linear infinite;
        }
      `}</style>
      <div className="ticker-wrapper whitespace-nowrap font-mono text-[11px] font-bold tracking-[0.06em] uppercase">
        {items.map((item, i) => (
          <span key={i} className="inline-flex items-center px-6">
            {item}
            <span className="opacity-40 ml-6">&raquo;&raquo;</span>
          </span>
        ))}
      </div>
    </div>
  );
}

function Nav() {
  return (
    <nav className="bg-white border-b border-[#DDE4EE] py-4 px-5 md:px-8 flex justify-between items-center sticky top-0 z-[100]">
      <a href="https://www.clearclaim.in">
        <img
          src="https://www.clearclaim.in/_next/static/media/logo.0..s._s9yl8ut.png"
          alt="ClearClaim"
          className="h-10 md:h-14 w-auto"
        />
      </a>
      <a
        href="https://www.clearclaim.in/contact"
        className="font-mono text-[11px] font-bold tracking-[0.08em] uppercase text-[#647080] border-b border-[#DDE4EE] pb-px hover:text-[#166638] hover:border-[#166638] transition-colors"
      >
        Need to reschedule? →
      </a>
    </nav>
  );
}

function Hero() {
  return (
    <section className="max-w-[1240px] mx-auto px-5 md:px-8 pt-12 md:pt-[52px] pb-8 text-center">
      <div className="inline-flex items-center gap-3 bg-[#EAF5EF]/60 border border-[#166638]/35 rounded-full pl-3 pr-5 py-2.5 font-mono text-[11px] font-bold tracking-[0.16em] uppercase text-[#166638] mb-9 shadow-sm">
        <span className="w-3 h-3 bg-[#166638] rounded-full flex-shrink-0 shadow-[0_0_0_4px_rgba(22,102,56,0.12)] animate-pulse" />
        Your Free Valuation Call Is Confirmed
      </div>
      <h1
        className="font-[Archivo] font-extrabold text-[#0A1F3D] leading-[0.95] tracking-[-0.01em] mb-5"
        style={{ fontSize: "clamp(28px,5.5vw,80px)" }}
      >
        Your Shares Are <br className="hidden sm:block" />
        Being{" "}
        <span className="italic text-[#166638]"> Looked Into.</span>
      </h1>
      <p className="text-base md:text-xl text-[#647080] max-w-[600px] mx-auto mb-12 leading-relaxed">
        You've started something most families keep putting off. On the call, we'll go through what you have, put a number to it, and tell you which kind of case it is. No pressure after that.
      </p>
    </section>
  );
}

function ReminderBar() {
  return (
    <div
      className="flex items-start gap-[18px] py-2.5 px-5 md:px-9 max-w-[900px] mx-auto my-2.5 rounded-[14px] shadow-[0_8px_20px_rgba(0,0,0,0.1)] border-l-[6px] border-[#ff9800]"
      style={{ background: "linear-gradient(135deg,#fff3cd,#ffe69c)" }}
    >
      <div className="w-[45px] h-[45px] min-w-[45px] bg-[#ff9800] text-white text-2xl font-bold flex items-center justify-center rounded-full">!</div>
      <p className="text-[15px] md:text-[17px] leading-[1.7] text-[#333] py-2">
        <strong>Important:</strong> Confirmation has been sent to your WhatsApp and email. If it's not there in 5 minutes, check your spam folder. Still nothing? WhatsApp us at{" "}
        <strong>+91 98765 43210</strong> and we'll sort it out.
      </p>
    </div>
  );
}

function Timeline() {
  return (
    <div className="border-t border-[#DDE4EE]">
      <div className="max-w-[1240px] mx-auto px-5 md:px-8 py-14 md:py-[72px]">
        <div className="font-mono text-[10px] font-bold tracking-[0.2em] uppercase text-[#166638] mb-3.5 flex items-center gap-2.5">
          <span className="w-5 h-0.5 bg-[#166638] inline-block" />
          Full Timeline
        </div>
        <h2
          className="font-[Archivo] font-extrabold text-[#0A1F3D] leading-none tracking-[-0.01em] mb-3"
          style={{ fontSize: "clamp(40px,5.5vw,72px)" }}
        >
          What Happens <span className="italic text-[#166638]">Next.</span>
        </h2>
        <p className="text-[17px] text-[#647080] max-w-[520px] leading-relaxed mb-12">
          From this moment to the end of your call, here's the complete picture.
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-px bg-[#DDE4EE] border border-[#DDE4EE]">
          {TIMELINE.map((step) => (
            <div
              key={step.label}
              className="bg-white p-6 md:p-7 hover:bg-[#EAF5EF] transition-colors"
            >
              <div className="font-mono text-[9px] font-bold tracking-[0.2em] uppercase text-[#166638] mb-3.5 pb-3 border-b border-[#DDE4EE]">
                {step.label}
              </div>
              <div className="font-[Archivo] font-extrabold text-[26px] text-[#0A1F3D] leading-tight mb-2.5">
                {step.heading}
              </div>
              <p className="text-sm text-[#647080] leading-[1.65]">{step.body}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function PrepChecklist() {
  const left = PREP_ITEMS.slice(0, 3);
  const right = PREP_ITEMS.slice(3);
  return (
    <div className="border-t border-[#DDE4EE]">
      <div className="max-w-[1240px] mx-auto px-5 md:px-8 py-14 md:py-[72px]">
        <div className="text-center max-w-[720px] mx-auto mb-12 md:mb-16">
          <div className="font-mono text-[10px] font-bold tracking-[0.2em] uppercase text-[#166638] mb-3.5 flex items-center justify-center gap-2.5">
            <span className="w-5 h-0.5 bg-[#166638] inline-block" />
            Before the Call
            <span className="w-5 h-0.5 bg-[#166638] inline-block" />
          </div>
          <h2
            className="font-[Archivo] font-extrabold text-[#0A1F3D] leading-none tracking-[-0.01em] mb-4"
            style={{ fontSize: "clamp(40px,5.5vw,72px)" }}
          >
            Show Up <span className="italic text-[#166638]">Prepared.</span>
          </h2>
          <p className="text-[17px] text-[#647080] leading-relaxed">
            You don't need everything in order. Most clients come with one faded certificate and a rough memory of when it was bought. That's enough to start. Five minutes of prep saves a lot of back and forth on the call.
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 lg:gap-x-16 gap-y-0 max-w-[1100px] mx-auto">
          <div className="flex flex-col">
            {left.map((item, i) => (
              <PrepItem key={item.n} item={item} isLast={i === left.length - 1} />
            ))}
          </div>
          <div className="flex flex-col">
            {right.map((item) => (
              <PrepItem key={item.n} item={item} isLast={false} />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

function PrepItem({ item, isLast }) {
  return (
    <div className={`grid grid-cols-[40px_1fr] gap-4 py-5 items-start ${isLast ? "" : "border-b border-[#DDE4EE]"}`}>
      <div className="font-[Archivo] font-extrabold text-[30px] text-[#166638] leading-none pt-0.5">{item.n}</div>
      <div>
        <strong className="block text-[15px] font-bold text-[#0A1F3D] mb-1">{item.title}</strong>
        <p className="text-sm text-[#647080] leading-relaxed mb-1.5">{item.body}</p>
        <span className="font-mono text-[10px] tracking-[0.06em] uppercase text-[#166638] flex items-center gap-1.5">
          <span>→</span>{item.hint}
        </span>
      </div>
    </div>
  );
}

function CaseStudies() {
  return (
    <div className="border-t border-[#DDE4EE] bg-[#F7F6F2]">
      <div className="max-w-[1240px] mx-auto px-5 md:px-8 py-14 md:py-[72px]">
        <div className="font-mono text-[10px] font-bold tracking-[0.2em] uppercase text-[#166638] mb-3.5 flex items-center gap-2.5">
          <span className="w-5 h-0.5 bg-[#166638] inline-block" />
          Recoveries We've Completed
        </div>
        <h2
          className="font-[Archivo] font-extrabold text-[#0A1F3D] leading-none tracking-[-0.01em] mb-3"
          style={{ fontSize: "clamp(28px,5.5vw,72px)" }}
        >
          Real Cases. <span className="italic text-[#166638]">Real Outcomes.</span>
        </h2>
        <p className="text-[17px] text-[#647080] max-w-[520px] leading-relaxed mb-12">
          Three cases from our files. Different situations, different amounts, same result.
        </p>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {CASE_STUDIES.map((c) => (
            <div
              key={c.type}
              className="border-[1.5px] border-[#DDE4EE] bg-white flex flex-col transition-all duration-300 hover:border-[#166638] hover:-translate-y-1"
            >
              <div className="bg-[#0A1F3D] px-[22px] py-4 flex justify-between items-start">
                <div>
                  <div className="font-mono text-[9px] font-bold tracking-[0.18em] uppercase text-white/60">{c.type}</div>
                  <div className="text-white text-[13px] font-semibold mt-1">{c.location}</div>
                </div>
                <div className="font-mono text-[9px] font-bold tracking-[0.1em] uppercase text-[#5EE89A]">{c.duration}</div>
              </div>
              <div className="p-[22px] flex-1">
                <div className="font-[Archivo] font-extrabold text-[44px] text-[#B5810A] leading-none tracking-[-0.01em] mb-1.5">{c.amount}</div>
                <div className="font-mono text-[10px] font-bold tracking-[0.1em] uppercase text-[#647080] mb-4">{c.role}</div>
                <p className="text-sm text-[#0F1923] leading-[1.7] mb-5">{c.story}</p>
                <div className="flex flex-wrap gap-1.5">
                  {c.tags.map((t) => (
                    <span key={t} className="font-mono text-[9px] font-bold tracking-[0.1em] uppercase text-[#166638] bg-[#EAF5EF] border border-[#166638]/20 px-2.5 py-1">{t}</span>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
        <div className="mt-9 text-center">
          <a href="https://www.clearclaim.in/case-study" className="font-mono text-[11px] font-bold tracking-[0.1em] uppercase text-[#166638] border-b-2 border-[#166638] pb-0.5 hover:opacity-70 transition-opacity">
            Browse all case studies →
          </a>
        </div>
      </div>
    </div>
  );
}

function NriStrip() {
  return (
    <div className="bg-[#0A1F3D] text-white py-14 md:py-[72px] px-5 md:px-8 relative overflow-hidden">
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          backgroundImage:
            "linear-gradient(rgba(255,255,255,0.03) 1px,transparent 1px),linear-gradient(90deg,rgba(255,255,255,0.03) 1px,transparent 1px)",
          backgroundSize: "48px 48px",
        }}
      />
      <div className="max-w-[1240px] mx-auto grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16 items-center relative">
        <div>
          <div className="font-mono text-[10px] font-bold tracking-[0.2em] uppercase text-[#5EE89A] mb-[18px] flex items-center gap-2.5">
            <span className="w-5 h-0.5 bg-[#5EE89A] inline-block" />
            For Clients Based Abroad
          </div>
          <h2
            className="font-[Archivo] font-extrabold text-white leading-none tracking-[-0.01em] mb-5"
            style={{ fontSize: "clamp(28px,5vw,68px)" }}
          >
            No India Trip <br className="hidden sm:block" />
            <span className="italic text-[#5EE89A]">Required.</span>
          </h2>
          <p className="text-base text-white/70 leading-[1.7] mb-7 max-w-[480px]">
            If you're joining from the US, UK, UAE, Australia, Singapore, or anywhere else — the process works the same way. WhatsApp, courier, and a limited Power of Attorney cover everything that would otherwise need a physical visit.{" "}
            <strong className="text-white font-semibold">FEMA compliance and NRO/NRE account coordination are built into how we work, not an afterthought.</strong>{" "}
            Most NRI recoveries take 10 to 14 months. The call is the same 30 minutes regardless of where you're dialling from.
          </p>
          <div className="flex flex-wrap gap-2">
            {NRI_COUNTRIES.map((c) => (
              <span key={c} className="font-mono text-[10px] font-bold tracking-[0.08em] uppercase text-white/50 bg-white/[0.06] border border-white/10 px-3 py-1.5">{c}</span>
            ))}
          </div>
        </div>
        <div className="flex flex-col">
          {NRI_POINTS.map((pt, i) => (
            <div key={pt.title} className={`grid grid-cols-[28px_1fr] gap-4 py-5 items-start ${i < NRI_POINTS.length - 1 ? "border-b border-white/10" : ""}`}>
              <div className="w-7 h-7 bg-[#5EE89A]/15 border border-[#5EE89A]/30 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                <svg viewBox="0 0 16 16" fill="none" className="w-3.5 h-3.5">
                  <path d="M3 8L6.5 11.5L13 5" stroke="#5EE89A" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </div>
              <div>
                <div className="text-[15px] font-semibold text-white mb-1">{pt.title}</div>
                <p className="text-[13px] text-white/55 leading-relaxed">{pt.body}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function TrustTiles() {
  return (
    <div className="bg-[#F7F6F2] border-t border-b border-[#DDE4EE]">
      <div className="max-w-[1240px] mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
        {TRUST_TILES.map((tile, i) => (
          <div
            key={tile.label}
            className={`p-9 px-7 ${i < 3 ? "border-b lg:border-b-0 lg:border-r border-[#DDE4EE]" : ""}`}
          >
            <div className="w-9 h-9 bg-[#EAF5EF] border border-[#166638]/20 rounded-full flex items-center justify-center mb-3.5">
              <svg viewBox="0 0 20 20" fill="none" className="w-4 h-4">
                <path d="M10 2L3 5.5V10C3 13.87 6.13 17.36 10 18C13.87 17.36 17 13.87 17 10V5.5L10 2Z" stroke="#166638" strokeWidth="1.5" />
                <path d="M7 10L9.5 12.5L13 8" stroke="#166638" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </div>
            <div className="font-mono text-[9px] font-bold tracking-[0.18em] uppercase text-[#166638] mb-1.5">{tile.label}</div>
            <div className="font-[Archivo] font-extrabold text-lg text-[#0A1F3D] mb-1.5 leading-tight">{tile.heading}</div>
            <p className="text-[13px] text-[#647080] leading-relaxed">{tile.body}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

function Footer() {
  const FOOTER_LINKS = [
    {
      heading: "The Company",
      links: [
        { label: "Home", href: "https://www.clearclaim.in/" },
        { label: "How It Works", href: "https://www.clearclaim.in/#how-it-works" },
        { label: "Case Studies", href: "https://www.clearclaim.in/case-study" },
        { label: "Contact", href: "https://www.clearclaim.in/contact" },
      ],
    },
    {
      heading: "Recovery Types",
      links: [
        { label: "IEPF Claims", href: "https://www.clearclaim.in/iepfclaim/" },
        { label: "Physical to Demat", href: "https://www.clearclaim.in/" },
        { label: "Legal Heir Cases", href: "https://www.clearclaim.in/" },
        { label: "NRI Recovery", href: "https://www.clearclaim.in/" },
      ],
    },
    {
      heading: "Client Proof",
      links: [
        { label: "Case Studies", href: "https://www.clearclaim.in/case-study" },
        { label: "Google Reviews", href: "https://g.page/r/clearclaim" },
        { label: "Recovery FAQ", href: "https://www.clearclaim.in/#faq" },
        { label: "WhatsApp Us", href: "https://wa.me/9156701900" },
      ],
    },
    {
      heading: "Legal",
      links: [
        { label: "Privacy Policy", href: "https://www.clearclaim.in/privacy-policy" },
        { label: "Terms of Service", href: "https://www.clearclaim.in/terms" },
        { label: "Refund Policy", href: "https://www.clearclaim.in/refund-policy" },
      ],
    },
  ];

  return (
    <footer className="bg-[#0A1F3D] text-white pt-14 px-5 md:px-8 pb-8">
      <div className="max-w-[1240px] mx-auto flex flex-col items-center gap-5 pb-8 border-b border-white/10">
        <a href="https://www.clearclaim.in">
          <img src="https://www.clearclaim.in/_next/static/media/logo.0..s._s9yl8ut.png" alt="ClearClaim" className="h-14 w-auto" />
        </a>
        <a
          href="https://www.clearclaim.in/contact"
          className="font-mono text-[10px] font-bold tracking-[0.12em] uppercase text-white/50 border border-white/15 px-4 py-2.5 hover:text-white hover:border-white/40 transition-colors"
        >
          Need to reschedule? →
        </a>
      </div>
      <div className="max-w-[1240px] mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10 py-10 border-b border-white/10">
        {FOOTER_LINKS.map((col) => (
          <div key={col.heading}>
            <div className="font-mono text-[9px] font-bold tracking-[0.2em] uppercase text-white/35 mb-4">{col.heading}</div>
            <ul className="flex flex-col gap-2.5 list-none p-0 m-0">
              {col.links.map((lk) => (
                <li key={lk.label}>
                  <a href={lk.href} className="text-sm text-white/60 hover:text-white transition-colors">{lk.label}</a>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
      <div className="max-w-[1240px] mx-auto pt-6 flex flex-col md:flex-row justify-between items-center gap-3">
        <span className="font-mono text-[10px] tracking-[0.06em] text-white/30 uppercase text-center md:text-left">
          &copy;2026 ClearClaim Ventures Private Limited &raquo;&raquo; Pune, Maharashtra &raquo;&raquo; All Rights Reserved
        </span>
        <span className="font-mono text-[10px] tracking-[0.06em] text-white/30 uppercase">hello@clearclaim.in</span>
      </div>
    </footer>
  );
}

function SocialProofPopup() {
  const [visible, setVisible] = useState(false);
  const [proof, setProof] = useState({ name: "", city: "", action: "", time: "", initial: "S" });

  useEffect(() => {
    const rand = mulberry32(weekSeed());
    const pick = (arr) => arr[Math.floor(rand() * arr.length)];

    const show = () => {
      const first = pick(PROOF_FIRST);
      setProof({
        name: `${first} ${pick(PROOF_LAST)}`,
        city: pick(PROOF_CITIES),
        action: pick(PROOF_ACTIONS),
        time: pick(PROOF_TIMES),
        initial: first.charAt(0),
      });
      setVisible(true);
      setTimeout(() => setVisible(false), 6000);
    };

    const t1 = setTimeout(() => {
      show();
      const interval = setInterval(show, 11000);
      return () => clearInterval(interval);
    }, 4000);

    return () => clearTimeout(t1);
  }, []);

  return (
    <>
      <style>{`
        .proof-popup {
          transform: translateX(-120%);
          opacity: 0;
          transition: transform 0.45s cubic-bezier(0.22,1,0.36,1), opacity 0.4s ease;
        }
        .proof-popup.visible {
          transform: translateX(0);
          opacity: 1;
        }
      `}</style>
      <div
        className={`proof-popup${visible ? " visible" : ""} fixed bottom-5 left-5 z-[9999] flex items-center gap-3 bg-white border border-[#DDE4EE] rounded-[60px] py-2.5 pl-2.5 pr-5 max-w-[340px] min-w-[260px] shadow-[0_8px_32px_rgba(10,31,61,0.14),0_2px_6px_rgba(10,31,61,0.06)] pointer-events-none`}
        role="status"
        aria-live="polite"
      >
        <div className="w-11 h-11 rounded-full bg-[#EAF5EF] border-2 border-[#166638] flex items-center justify-center flex-shrink-0 font-[Archivo] font-extrabold text-lg text-[#166638]">
          {proof.initial}
        </div>
        <div className="flex-1 min-w-0">
          <div className="text-[13px] font-bold text-[#0F1923] whitespace-nowrap overflow-hidden text-ellipsis leading-tight">
            {proof.name}
            <span className="text-[#647080] font-normal"> from </span>
            {proof.city}
          </div>
          <div className="text-xs text-[#647080] whitespace-nowrap overflow-hidden text-ellipsis leading-tight mt-0.5">{proof.action}</div>
          <div className="flex items-center gap-1.5 mt-0.5">
            <span className="font-mono text-[10px] font-bold text-[#0F1923]">{proof.time}</span>
            <svg className="w-3 h-3 flex-shrink-0" viewBox="0 0 24 24" fill="none">
              <path d="M8.603 3.799A4.49 4.49 0 0 1 12 2.25c1.357 0 2.573.6 3.397 1.549a4.49 4.49 0 0 1 3.498 1.307 4.491 4.491 0 0 1 1.307 3.497A4.49 4.49 0 0 1 21.75 12a4.49 4.49 0 0 1-1.549 3.397 4.491 4.491 0 0 1-1.307 3.497 4.491 4.491 0 0 1-3.497 1.307A4.49 4.49 0 0 1 12 21.75a4.49 4.49 0 0 1-3.397-1.549 4.49 4.49 0 0 1-3.498-1.306 4.491 4.491 0 0 1-1.307-3.498A4.49 4.49 0 0 1 2.25 12c0-1.357.6-2.573 1.549-3.397a4.49 4.49 0 0 1 1.307-3.497 4.49 4.49 0 0 1 3.497-1.307Z" fill="#2563EB" />
              <path d="M8 12.5l2.7 2.7L16.5 9" stroke="#fff" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
            <span className="font-mono text-[10px] font-bold text-[#2563EB]">Verified</span>
          </div>
        </div>
      </div>
    </>
  );
}

// ─── ROOT ────────────────────────────────────────────────────────────────────
export default function ClearClaimConfirmation() {
  // ── Meta Pixel ─────────────────────────────────────────────────────────────
  useEffect(() => {
    if (typeof window === "undefined") return;

    // Inject the Meta Pixel script once
    if (!window.fbq) {
      (function (f, b, e, v, n, t, s) {
        if (f.fbq) return;
        n = f.fbq = function () {
          n.callMethod
            ? n.callMethod.apply(n, arguments)
            : n.queue.push(arguments);
        };
        if (!f._fbq) f._fbq = n;
        n.push = n;
        n.loaded = true;
        n.version = "2.0";
        n.queue = [];
        t = b.createElement(e);
        t.async = true;
        t.src = v;
        s = b.getElementsByTagName(e)[0];
        s.parentNode.insertBefore(t, s);
      })(
        window,
        document,
        "script",
        "https://connect.facebook.net/en_US/fbevents.js"
      );
    }

    window.fbq("init", "1826615968297626");
    window.fbq("track", "PageView");

    // Noscript fallback pixel image
    const noscript = document.createElement("noscript");
    const img = document.createElement("img");
    img.height = 1;
    img.width = 1;
    img.style.display = "none";
    img.src =
      "https://www.facebook.com/tr?id=1826615968297626&ev=PageView&noscript=1";
    noscript.appendChild(img);
    document.head.appendChild(noscript);
  }, []);
  // ───────────────────────────────────────────────────────────────────────────

  return (
    <div className="bg-white text-[#0F1923] overflow-x-hidden" style={{ fontFamily: "'Archivo', system-ui, sans-serif" }}>
      <Ticker />
      <Nav />
      <Hero />
      <ReminderBar />
      <Timeline />
      <PrepChecklist />
      <CaseStudies />
      <NriStrip />
      <TrustTiles />
      <Footer />
      <SocialProofPopup />
    </div>
  );
}
