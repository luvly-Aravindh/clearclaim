import { useMemo, useState } from "react";
import "./ClearClaimOptin.css";
import { saveLead } from "./ccLead";
import ccMark from "../assets/clearclaim-mark.png";
import ccWordmark from "../assets/clearclaim-wordmark.png";

/* Optional: set this to a real endpoint to capture the opt-in lead the
   moment email + WhatsApp are submitted (before the booking step). Left
   empty so nothing fires until a real URL is wired in. The full lead,
   including name and case type, is still captured server-side at the
   booking step inside BookModal. */
const OPTIN_WEBHOOK_URL = "";

const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const Check = ({ className = "" }) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <polyline points="20 6 9 17 4 12" />
  </svg>
);

const ClearClaimOptin = ({ onComplete }) => {
  const [email, setEmail] = useState("");
  const [whatsapp, setWhatsapp] = useState("");

  const emailValid = useMemo(
    () => emailRegex.test(email.trim()) && email.trim().length >= 6,
    [email]
  );
  const phoneValid = useMemo(
    () => whatsapp.replace(/\D/g, "").length >= 10,
    [whatsapp]
  );

  const ready = emailValid && phoneValid;

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!ready) return;

    const lead = { email: email.trim(), whatsapp: whatsapp.trim() };

    // Persist for the landing page + booking modal (sessionStorage contract).
    saveLead(lead);

    // Optional fire-and-forget opt-in capture (no-op until URL is set).
    if (OPTIN_WEBHOOK_URL) {
      try {
        fetch(OPTIN_WEBHOOK_URL, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            email: lead.email,
            whatsapp: lead.whatsapp,
            source: "clearclaim_optin_gate_react",
            submitted_at: new Date().toISOString(),
          }),
          mode: "no-cors",
          keepalive: true,
        }).catch(() => {});
      } catch {
        /* ignore */
      }
    }

    // Advance the funnel: opt-in -> landing page.
    onComplete?.(lead);
  };

  const fieldInput =
    "w-full pl-4 pr-11 py-[14px] text-[16px] text-[#0F1F14] bg-[#FAFAF7] border-[1.5px] border-[#D8E5DC] rounded-[11px] outline-none transition-[border-color,background,box-shadow] duration-150 focus:border-[#00BE5E] focus:bg-white focus:shadow-[0_0_0_4px_rgba(0,190,94,0.10)]";

  return (
    <div className="cc-optin min-h-screen overflow-x-hidden bg-[#FAFAF7]">
      {/* ============ NAV ============ */}
      <nav className="sticky top-0 z-50 border-b border-[#D8E5DC] py-4 bg-[rgba(250,250,247,0.94)] backdrop-blur-[12px]">
        <div className="max-w-[1280px] mx-auto px-5 md:px-8 flex items-center justify-between gap-4">
          <a href="#" className="inline-flex items-center gap-2.5 font-extrabold text-[#00BE5E] text-[19px]">
            <img src={ccMark} alt="ClearClaim" className="w-[38px] h-[38px] block shrink-0" />
            <span>ClearClaim</span>
          </a>
          <div className="cc-mono inline-flex items-center gap-2 md:gap-3.5 text-[10px] md:text-[11px] font-bold tracking-[0.16em] text-[#5F6E66]">
            <span className="w-[5px] h-[5px] rounded-full bg-[#00BE5E]" />
            <span>FREE DOWNLOAD</span>
            <span>·</span>
            <span>EDITION 01</span>
          </div>
        </div>
      </nav>

      {/* ============ HERO / GATE ============ */}
      <section className="cc-hero flex items-center py-8 md:py-[56px] md:pb-[88px] md:min-h-[calc(100vh-72px)]">
        <div className="max-w-[1280px] mx-auto px-5 md:px-8 w-full">
          <div className="grid grid-cols-1 lg:grid-cols-[1.05fr_0.95fr] gap-14 lg:gap-[72px] items-center">

            {/* LEFT: form gate */}
            <div className="max-w-[580px] order-2 lg:order-1">
              <span className="inline-flex items-center gap-2 px-4 py-2 bg-white border border-[#D8E5DC] rounded-full mb-[22px] shadow-[0_1px_2px_rgba(0,88,44,0.06),0_2px_6px_rgba(0,88,44,0.04)]">
                <span className="cc-eyebrow-dot" />
                <span className="cc-mono text-[12px] font-bold text-[#008B45]">Free 31-Page Report · Edition 01</span>
              </span>

              <h1 className="text-[clamp(32px,6vw,56px)] leading-[1.04] tracking-[-0.025em] font-extrabold text-[#00301A] mb-[18px]">
                The <span className="cc-serif-i text-[#008B45] text-[1.05em]">Forgotten Crorepati</span> Report. Yours in 30 seconds.
              </h1>

              <p className="text-[19px] text-[#5F6E66] leading-[1.6] mb-[30px]">
                Enter your <strong className="text-[#0F1F14] font-bold">email</strong> and{" "}
                <strong className="text-[#0F1F14] font-bold">WhatsApp number</strong> below. The download button activates the moment both fields are valid. A PDF copy also lands in your inbox within 30 seconds.
              </p>

              <ul className="flex flex-col gap-2.5 mb-8">
                {[
                  "47 Indian companies. One page per company. Real recovery math.",
                  "HDFC merger math. Infosys 1993 IPO bonus history. Reliance + Jio Financial demerger.",
                  "Documents required for recovery, by case type.",
                  "The 4-question decision tree. Which certificates to pursue. Which to leave alone.",
                ].map((line) => (
                  <li key={line} className="flex items-start gap-3 text-[15.5px] text-[#1F3027] leading-[1.5]">
                    <span className="shrink-0 w-[22px] h-[22px] mt-px rounded-full bg-[#00BE5E] flex items-center justify-center">
                      <Check className="w-3 h-3 stroke-white" />
                    </span>
                    <span>{line}</span>
                  </li>
                ))}
              </ul>

              {/* Gate form */}
              <form onSubmit={handleSubmit} noValidate className="bg-white rounded-[16px] p-6 border border-[#D8E5DC] shadow-[0_4px_12px_rgba(0,88,44,0.08),0_12px_28px_rgba(0,88,44,0.06)]">
                <div className="cc-mono flex items-center gap-2 text-[11px] font-bold tracking-[0.18em] text-[#008B45] mb-1">
                  <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <rect x="3" y="11" width="18" height="11" rx="2" /><path d="M7 11V7a5 5 0 0 1 10 0v4" />
                  </svg>
                  Two fields. Then the download is yours.
                </div>
                <p className="text-[14px] text-[#5F6E66] mb-[18px]">Both fields must be valid to activate the button.</p>

                {/* Email */}
                <div className={`cc-field relative mb-3.5 ${emailValid ? "is-valid" : ""}`}>
                  <label htmlFor="cc-email" className="block text-[13px] font-bold text-[#1F3027] mb-1.5">Your email</label>
                  <input
                    type="email"
                    id="cc-email"
                    name="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="ramesh@example.com"
                    autoComplete="email"
                    required
                    className={fieldInput}
                  />
                  <span className="cc-field-check absolute right-3.5 bottom-3.5 w-6 h-6 rounded-full bg-[#00BE5E] flex items-center justify-center">
                    <Check className="w-[13px] h-[13px] stroke-white" />
                  </span>
                </div>

                {/* WhatsApp */}
                <div className={`cc-field relative mb-3.5 ${phoneValid ? "is-valid" : ""}`}>
                  <label htmlFor="cc-phone" className="block text-[13px] font-bold text-[#1F3027] mb-1.5">Your WhatsApp number (with country code)</label>
                  <input
                    type="tel"
                    id="cc-phone"
                    name="whatsapp"
                    value={whatsapp}
                    onChange={(e) => setWhatsapp(e.target.value)}
                    placeholder="+91 98765 43210"
                    autoComplete="tel"
                    inputMode="tel"
                    required
                    className={fieldInput}
                  />
                  <span className="cc-field-check absolute right-3.5 bottom-3.5 w-6 h-6 rounded-full bg-[#00BE5E] flex items-center justify-center">
                    <Check className="w-[13px] h-[13px] stroke-white" />
                  </span>
                </div>

                <button
                  type="submit"
                  disabled={!ready}
                  className={`cc-unlock ${ready ? "is-unlocked" : ""} relative w-full mt-1.5 px-6 py-[19px] rounded-[12px] text-[16.5px] font-extrabold flex items-center justify-center gap-3`}
                >
                  <svg className="cc-lock w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <rect x="3" y="11" width="18" height="11" rx="2" /><path d="M7 11V7a5 5 0 0 1 10 0v4" />
                  </svg>
                  <span>{ready ? "Download The Free Report" : "Fill both fields to continue"}</span>
                  <svg className="cc-arrow w-[18px] h-[18px]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M5 12h14M13 6l6 6-6 6" />
                  </svg>
                </button>

                <p className="text-[12px] text-[#5F6E66] mt-3.5 text-center leading-[1.55]">
                  <strong className="text-[#1F3027] font-bold">No spam. No surprise sales calls.</strong> Unsubscribe anytime. We never share your information with third parties.
                </p>
              </form>
            </div>

            {/* RIGHT: big book mockup */}
            <div className="cc-book-stage relative flex items-center justify-center min-h-[460px] lg:min-h-[600px] order-1 lg:order-2">
              <div className="cc-float-tag cc-top">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <rect x="3" y="3" width="18" height="18" rx="2" /><path d="M9 9h6v6H9z" />
                </svg>
                47 companies covered
              </div>
              <div className="cc-float-tag cc-bottom cc-yellow">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.8" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M12 8v4l3 2" /><circle cx="12" cy="12" r="10" />
                </svg>
                14-minute read
              </div>

              <div className="cc-book">
                <div className="cc-book-spine" />
                <div className="cc-book-pages" />
                <div className="cc-book-cover">
                  <div className="flex items-start justify-between gap-3">
                    <div className="w-16 h-16 bg-white rounded-[14px] p-2.5 flex items-center justify-center shadow-[0_6px_16px_rgba(0,0,0,0.20)]">
                      <img src={ccMark} alt="ClearClaim" className="w-full h-full object-contain" />
                    </div>
                    <div className="cc-book-stamp">
                      <span className="text-[11px] tracking-[0.16em] uppercase font-bold opacity-85" style={{ fontFamily: "'Plus Jakarta Sans'" }}>Edition</span>
                      <span className="text-[32px] leading-none italic">01</span>
                    </div>
                  </div>

                  <div className="-mt-5">
                    <div className="cc-mono text-[10.5px] tracking-[0.20em] opacity-85 mt-4">
                      <strong className="font-bold opacity-100 text-white">CLEARCLAIM</strong> · RECOVERY SPECIALISTS
                    </div>
                    <div className="cc-mono text-[14px] tracking-[0.32em] font-bold text-[#6EE7A8] mb-1.5 mt-[18px]">THE</div>
                    <div className="cc-book-title-main">FORGOTTEN</div>
                    <div className="cc-book-title-accent">Crorepati</div>
                    <div className="cc-book-title-report">REPORT</div>
                  </div>

                  <div className="border-t border-white/20 pt-4">
                    <div className="text-[13px] leading-[1.5] opacity-[0.88]">
                      What 47 Indian share certificates from 1985 to 1995 are actually worth in 2026. With real recovery math.
                    </div>
                    <div className="cc-mono text-[9.5px] tracking-[0.12em] mt-3.5 opacity-70 leading-[1.65]">
                      HDFC · INFOSYS · RELIANCE · WIPRO · ITC<br />
                      TCS · L&amp;T · TATA STEEL · ASIAN PAINTS<br />
                      + 38 OTHER INDIAN COMPANIES
                    </div>
                  </div>
                </div>
                <div className="cc-book-shadow" />
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* ============ TRUST STRIP ============ */}
      <div className="bg-white border-y border-[#D8E5DC] py-[22px]">
        <div className="max-w-[1280px] mx-auto px-5 md:px-8">
          <div className="flex items-center justify-center gap-[18px] flex-wrap text-[15.5px] text-[#1F3027] font-medium">
            <span className="text-[#F4B400] text-[17px] tracking-[1.5px]">★★★★★</span>
            <span><strong className="text-[#0F1F14] font-extrabold">1,250+ Indian families</strong> served</span>
            <span className="text-[#95A39B] font-normal">·</span>
            <span><strong className="text-[#0F1F14] font-extrabold">₹150 Cr</strong> recovered</span>
            <span className="text-[#95A39B] font-normal">·</span>
            <span><strong className="text-[#0F1F14] font-extrabold">98.4%</strong> case completion</span>
            <span className="text-[#95A39B] font-normal">·</span>
            <span><strong className="text-[#0F1F14] font-extrabold">22</strong> recovery specialists</span>
          </div>
        </div>
      </div>

      {/* ============ FOOTER ============ */}
      <footer className="bg-[#00301A] text-[#95A39B] pt-9 pb-7 text-center text-[13px]">
        <div className="max-w-[1280px] mx-auto px-5 md:px-8">
          <img src={ccWordmark} alt="ClearClaim" className="w-[130px] mx-auto mb-[18px] block opacity-95" />
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

export default ClearClaimOptin;
